import { useQuery, useRealm } from '@realm/react';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ClientesModel } from '../../../core/models/ClientesModel';
import { FacturasModel } from '../../../core/models/FacturasModel';
import { PagosModel } from '../../../core/models/PagosModel';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Button, Icon, IconButton } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ScrollView } from 'react-native-gesture-handler';
import { CAMPE_CONTS } from '../utils/Constantes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useClientesLocal } from '../../../hooks/database/clientes/useClientesLocal';
import { useFacturasLocal } from '../../../hooks/database/facturas/useFacturasLocal';
import { usePagosLocal } from '../../../hooks/database/pagos/usePagosLocal';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { CAMPE_LOADING } from '../utils/CampeLoading';

export const SyncronizerScreen = () => {

    const { width, height } = useWindowDimensions();
    const isFocused = useIsFocused();
    const realm = useRealm();
    const CLIENTES_LOCAL = useQuery(ClientesModel);
    const FACTURAS_LOCAL = useQuery(FacturasModel);
    const PAGOS_LOCAL = useQuery(PagosModel);
    const INSERT = 'INSERT';
    const UPDATE = 'UPDATE';

    const [isSync, setIsSync] = useState(false);
    const [ count, setCount ] = useState(0);
    const [ dataClientes, setDataClientes ] = useState<any>([]);
    const [ dataFacturasNew, setDataFacturasNew ] = useState<any>([]);
    const [ dataFacturasUpdate, setDataFacturasUpdate ] = useState<any>([]);
    const [ dataPagos, setDataPagos ] = useState<any>([]);

    const [ loading, setLoading ] = useState(true);

    const { insertCliente } = useClientesLocal({});
    const { insertFactura } = useFacturasLocal();
    const { insertPago } = usePagosLocal();

    const getClientes = () => {
        const filtrados = CLIENTES_LOCAL.filtered('action == $0', INSERT);
        return Array.from(filtrados);
    };

    const getFacturasNew = () => {
        const filtrados = FACTURAS_LOCAL.filtered('action == $0', INSERT);
        return Array.from(filtrados);
    };

    const getFacturasUpdate = () => {
        const filtrados = FACTURAS_LOCAL.filtered('action == $0', UPDATE);
        return Array.from(filtrados);
    };

    const getPagos = () => {
        const filtrados = PAGOS_LOCAL.filtered('action == $0', INSERT);
        return Array.from(filtrados);
    };

    const getCliente = (idCliente: string) => {
        const filtrados = CLIENTES_LOCAL.filtered('_id == $0', idCliente);
        return Array.from(filtrados);
    };

    const getDataSync = () => {
        const oClientes = getClientes();
        const oFacturasNew = getFacturasNew();
        const oFacturasUpdate = getFacturasUpdate();
        const oPagos = getPagos();

        setDataClientes(oClientes);
        setDataFacturasNew(oFacturasNew);
        setDataFacturasUpdate(oFacturasUpdate);
        setDataPagos(oPagos);

        console.log('DATA_CLIENTES: ', oClientes);
        console.log('DATA_FACTURAS_NUEVAS: ', oFacturasNew);
        console.log('DATA_FACTURAS_ACTUALIZADAS: ', oFacturasUpdate);
        console.log('DATA_PAGOS: ', oPagos);

        if (oClientes.length > 0 || oFacturasNew.length > 0 || oFacturasUpdate.length > 0 || oPagos.length > 0)
            setIsSync(true);
        else
            setIsSync(false);
    };

    const createCliente = async(cliente: any) => {
        console.log('NUEVA IMPLEMENTACION DE CLIENTE');
        const response = await fetch(`https://campews.onrender.com/api/usuario/`, {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(cliente)
        });

        const data = await response.json();
        console.log('data: ',data);
        return data._id;
    };

    const creaFactura = async(factura: any) => {
        console.log('NUEVA IMPLEMENTACION DE FACTURA');
        const response = await fetch(`https://campews.onrender.com/api/facturas/`, {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(factura)
        });

        const data = await response.json();
        console.log('data: ',data);
        return data._id;
    };
    
    const creaPago = async(pago: any) => {
        console.log('NUEVA IMPLEMENTACION DE PAGO');
        const response = await fetch(`https://campews.onrender.com/api/pagos/`, {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(pago)
        });

        const data = await response.json();
        console.log('data: ',data);
        return data._id;
    };

    const updateFactura = async(idFactura: string, factura: any) => {
        console.log('NUEVA IMPLEMENTACION DE PAGO');
        const response = await fetch(`https://campews.onrender.com/api/facturas/${idFactura}`, {  
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(factura)
        });

        const data = await response.json();
        console.log('data: ',data);
        return data;
    };

    const updateCliente = async(idCliente: string, cliente: any) => {
        console.log('NUEVA IMPLEMENTACION DE PAGO');
        const response = await fetch(`https://campews.onrender.com/api/usuario/${idCliente}`, {  
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(cliente)
        });

        const data = await response.json();
        console.log('data: ',data);
        return data;
    };

    const doSync = async() => {

        setLoading(false);

        const userId = await AsyncStorage.getItem('@KeyUserId');

        let flagFactura = false;
        //CREA CLIENTES FACTURAS Y PAGOS
        if(dataClientes){
            if(dataClientes.length>0){

                const oCliente = [];
                const facturasIDs: any= [];
                for(const cliente of dataClientes){
                    
                    if(dataFacturasNew.length>0){
                       
                        const oTarjeta = [];
                        const oPago= [];
                        const pagosIDs: any= [];
                        
                        for(const factura of dataFacturasNew){
                            
                            if(cliente._id == factura.cliente){

                                flagFactura = true;
                                if(dataPagos.length>0){
                                    
                                    for(const pago of dataPagos){

                                        if(pago.factura == factura._id){
                                            oPago.push({
                                                "monto": pago.monto,
                                                "metodo": pago.metodo,
                                                "status": pago.status,
                                                "fecha": pago.fecha,
                                                "usuario": userId
                                            });
                                        }

                                    }

                                    console.log("🚀 ~ doSync ~ oPago:", oPago);
                                    //CREA PAGOS
                                    for(const cobro of oPago){
                                        const doPago = await creaPago(cobro);
                                        pagosIDs.push(doPago);
                                        console.log("🚀 ~ doSync ~ doPago:", doPago);
                                    }
                                    
                                }
                                
                                oTarjeta.push({
                                    "usuario": factura.cliente,
                                    "pagos": pagosIDs,
                                    "articulo": factura.articulo,
                                    "cantidad": factura.cantidad,
                                    "total": factura.total,
                                    "abono": factura.abono,
                                    "resta": (Number(factura.total) - Number(factura.abono == '' ? 0 : factura.abono)),
                                    "status": factura.abono>0 ? "abono" :"Nuevo"
                                });

                            }
                        }

                        //CREA FACTURAS
                        for(const facturaCreate of oTarjeta){
                            const doFactura = await creaFactura(facturaCreate);
                            facturasIDs.push(doFactura);
                            console.log("🚀 ~ doSync ~ doFactura:", doFactura);
                        }
                    }

                    const PHOTO_URI = await savePhoto(cliente.uri, cliente.type, cliente.namePhoto);

                    oCliente.push({
                        "nombre": cliente.nombre,
                        "apellidoP": cliente.apellidoP,
                        "apellidoM": cliente.apellidoM,
                        "direccion": cliente.direccion,
                        "municipio": cliente.municipio,
                        "tel": cliente.tel,
                        "password": "",
                        "latitud": 0,
                        "longitud": 0,
                        "ruta": cliente.ruta,
                        "cobrador": cliente.cobrador,
                        //"foto": cliente.foto,
                        "foto": PHOTO_URI,
                        "tipoUsuario": CAMPE_CONTS.ID_CLIENTE,
                        "facturas": facturasIDs
                    });

                }

                console.log('CLIENTES NUEVOS --> ',oCliente);
                //CREA CLIENTES
                for(const clienteCreate of oCliente){
                    const doCliente = await createCliente(clienteCreate);
                    console.log("🚀 ~ doSync ~ doCliente:", doCliente)
                }
    
            }
        }

        //EN ESTE FLUJO SOLO SE ACTUALIZAN FACTURAS Y SE CREAN PAGOS
        if (dataFacturasUpdate.length) {
            
            const oPago = [];
            const pagosIDs: any = [];

            for (const factura of dataFacturasUpdate) {

                const idFactura = factura._id;

                for(const pago of dataPagos){
                    oPago.push({
                        "monto": pago.monto,
                        "metodo": pago.metodo,
                        "status": pago.status,
                        "fecha": pago.fecha,
                        "usuario": userId
                    });
                }
                 
                //CREA PAGOS
                for(const cobro of oPago){
                    const doPago = await creaPago(cobro);
                    pagosIDs.push(doPago);
                    console.log("🚀 ~ doSync ~ doPago:", doPago);
                }

                const idPagos = new String(factura.pagos).split(',');

                if(idPagos.length>0){
                    for(const pagoId of idPagos){
                        if(pagoId.length>0)
                            pagosIDs.push(pagoId);
                    }
                }

                let status = factura.abono == 0 ? 'Sin abono' : 'abono';

                if(factura.resta === 0)
                    status = 'Pagado';

                //OBJETO QUE SE MANDA AL SERVER
                const oFactura = [{
                    "usuario":factura.cliente,
                    "pagos":pagosIDs,
                    "articulo": factura.articulo,
                    "cantidad": factura.cantidad,
                    "total": factura.total,
                    "abono": Number(factura.abono),
                    "resta": factura.resta,
                    "status": status
                }];

                console.log("🚀 ~ doSync ~ idFactura:", idFactura)
                console.log("🚀 ~ doSync ~ oFactura:", oFactura)

                for(const iFactura of oFactura){
                    const facturaUpdate = await updateFactura(idFactura, iFactura);
                    console.log("🚀 ~ doSync ~ facturaUpdate:", facturaUpdate);
                }
            }
        }

        //EN ESTE FLUJO SE CREAN LAS NUEVAS FACTURAS
        //ESTA PENDIENTE ACTUALIZAR EL CLIENTE PARA ASIGNAR SUS FACTURAS.
        console.log('NUEVA FACTURA: ',dataFacturasNew.length);
        console.log('NUEVA FACTURA FLAG ',flagFactura);
        if (dataFacturasNew.length > 0 && !flagFactura) {
            console.log("🚀 ~ doSync ~ dataFacturasNew:", dataFacturasNew);

            const oTarjeta = [];
            const oPago = [];
            const pagosIDs: any = [];
            const facturasIDs: any = [];

            for (const factura of dataFacturasNew) {

                if (dataPagos.length > 0) {

                    for (const pago of dataPagos) {

                        if (pago.factura == factura._id) {
                            oPago.push({
                                "monto": pago.monto,
                                "metodo": pago.metodo,
                                "status": pago.status,
                                "fecha": pago.fecha,
                                "usuario": userId
                            });
                        }

                    }

                    console.log("🚀 ~ doSync ~ oPago:", oPago);
                    //CREA PAGOS
                    for (const cobro of oPago) {
                        const doPago = await creaPago(cobro);
                        pagosIDs.push(doPago);
                        console.log("🚀 ~ doSync ~ doPago:", doPago);
                    }

                }

                oTarjeta.push({
                    "usuario": factura.cliente,
                    "pagos": pagosIDs,
                    "articulo": factura.articulo,
                    "cantidad": factura.cantidad,
                    "total": factura.total,
                    "abono": factura.abono,
                    "resta": (Number(factura.total) - Number(factura.abono == '' ? 0 : factura.abono)),
                    "status": factura.abono > 0 ? "abono" : "Nuevo"
                });

                console.log("🚀 ~ doSync ~ oTarjeta:", oTarjeta)

                //CREA FACTURAS
                for(const facturaCreate of oTarjeta){
                    const doFactura = await creaFactura(facturaCreate);
                    facturasIDs.push(doFactura);
                    console.log("🚀 ~ doSync ~ doFactura:", doFactura);
                }
                
                const cliente = { "facturas": facturasIDs };
                const doCliente = await updateCliente(factura.cliente, cliente);
                console.log("🚀 ~ doSync ~ doCliente:", doCliente)
                
            }
        }

        //Al final hay que borrar toda la Base local y bajar de nuevo toda la info del server
        deleteBDLocal();

    };

    const deleteBDLocal = () => {
        realm.write(() => {
            realm.deleteAll();
        });
        console.log('BORRE LA BASE LOCAL');
        getDataClientes();
    }


    const getDataClientes = async() => {
        
        try{
            const idUser = await AsyncStorage.getItem('@KeyUserId');
            const URI = `https://campews.onrender.com/api/usuario/byCobrador?cobrador=${idUser}`;
            const data = await axios.get(URI);
            console.log('INSERTO INFORMACIÓN SINCRONIZADA');
            insertLocalData(data.data);
        }catch(e){
            console.log('ERROR: ',e);
        }

    }


    const insertLocalData = async(data: [])=>{
        
        const oDataCte: any = [];
        const oDataFacturas: any = [];
        const oDataPagos: any = [];

        for(const cliente of data as any[]){
            oDataCte.push({
                _id: cliente._id,
                nombre: cliente.nombre,
                apellidoP: cliente.apellidoP,
                apellidoM: cliente.apellidoM,
                direccion: cliente.direccion,
                municipio: cliente.municipio,
                tel: cliente.tel,
                latitud: cliente.latitud,
                longitud: cliente.longitud,
                cobrador: cliente.cobrador,
                ruta: cliente.ruta,
                foto: cliente.foto,
                uri: '',
                type: '',
                namePhoto: '',
                createdAt: cliente.createdAt,
                updatedAt: cliente.updatedAt,
                action: 'NONE',
            });

            if(cliente.facturas.length>0){
                for(const factura of cliente.facturas){

                    let idPagos = '';
                    let ids: string[] = [];
                    if(factura.pagos.length){
                        for(const pago of factura.pagos){
                            ids.push(pago._id);
                            oDataPagos.push({
                                _id: pago._id,
                                monto: pago.monto,
                                metodo: pago.metodo,
                                status: pago.status,
                                fecha: pago.fecha,
                                usuario: pago.usuario,
                                factura: factura._id,
                                action: 'NONE',
                            });
                        }
                        idPagos = ids.join(',');
                    }

                    oDataFacturas.push({
                        _id: factura._id,
                        articulo: factura.articulo,
                        cantidad: factura.cantidad,
                        total: factura.total,
                        abono: factura.abono,
                        resta: factura.resta,
                        status: factura.status,
                        cliente: cliente._id,
                        createdAt: factura.createdAt,
                        updatedAt: factura.updatedAt,
                        pagos: idPagos,
                        action: 'NONE',
                    });
                }
            }
        }

        const clientes = await insertCliente(oDataCte);
        const facturas = await insertFactura(oDataFacturas);
        const pagos = await insertPago(oDataPagos);

        setLoading(true);
        setIsSync(false);

    }

    const savePhoto = async (uri: string, type: string, fileName: string) => {
        
        const data = new FormData();
        data.append('file', {
            uri: uri,
            type: type,
            name: fileName,
        });
        data.append('upload_preset', 'campe-app'); // lo configuras en Cloudinary

        const res = await fetch('https://api.cloudinary.com/v1_1/dyfx8jypt/image/upload', {
            method: 'POST',
            body: data,
        });

        const json = await res.json();
        console.log('json.secure_url -> ', json.secure_url)
        return json.secure_url; // esta es la URL para guardar
    }

    useEffect(() => {
        getDataSync();
    }, [isFocused]);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFF', justifyContent: 'center', alignItems: 'center' }}>
            {
                isSync ?
                    <>
                    {
                        loading?
                        <ScrollView style={{ backgroundColor: '#FFF' }}>
                        
                        <View style={{ marginHorizontal: 40, marginTop: 25 }}>
                            <Text style={{ fontSize: 16, color: '#5a121c', fontWeight: '600', textAlign: 'center' }}>
                                {'¡Tienes información pendiente por sincronizar!\n\n'}
                                {'IMPORTANTE:\n\n'}
                                {'Asegurate de tener una conexión estable a internet para este proceso.\n'}
                            </Text>
                        </View>

                        <View style={{ marginTop: 20, alignSelf: 'center' }}>
            
                            <Icon
                                source="database-alert"
                                color={'#f0cdd1'}
                                //color={'#5a121c'}
                                size={250}
                            />

                        </View>

                        <View style={{ marginTop: 60, marginHorizontal: 40 }}>
                            <Button 
                                icon="sync-circle" 
                                mode="contained" 
                                onPress={ doSync }
                                style={{ borderRadius: 7 }}
                                buttonColor='#5a121c'
                                textColor='#FFFF'
                            >
                                Sincronizar
                            </Button>
                        </View>

                    </ScrollView>:
                    <View style={{ marginLeft: 70 }}>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: `<img src=${CAMPE_LOADING} />` }}
                            style={{ width: width }}
                        />
                    </View>
                    }
                    </> 
                    :<View>
                        <Text style={{ fontSize: 18, color: '#5a121c', fontWeight: '600', textAlign: 'center' }}>No tienes información pendiente por sincronizar</Text>
                        <View style={{ alignSelf: 'center', marginTop: 20 }}>
                            <Icon
                                source="database-check"
                                //color={'#DEDEDE'}
                                color={'#5a121c'}
                                size={250}
                            />
                        </View>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    percentageText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#5a121c',
    },
    logo: {
        width: 10,
        height: 10,
      },
});