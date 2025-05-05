import { useQuery } from '@realm/react';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ClientesModel } from '../../../core/models/ClientesModel';
import { FacturasModel } from '../../../core/models/FacturasModel';
import { PagosModel } from '../../../core/models/PagosModel';
import { useIsFocused } from '@react-navigation/native';
import { Button, IconButton } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ScrollView } from 'react-native-gesture-handler';
import { CAMPE_CONTS } from '../utils/Constantes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SyncronizerScreen = () => {

    const isFocused = useIsFocused();
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
    };

    /*const createCliente = async (cliente: any) => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            console.log('raw -> ', cliente);
            await fetch("https://campews.onrender.com/api/usuario/", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(cliente),
                redirect: "follow"
            }).then(async (response) => {
                const codigo = response.status;
                const texto = await response.text();
                return { codigo, texto };
            }).then(async(result) => {
                console.log('result: ', result);
                console.log('CLIENTE SINCRONIZADO CORRECTAMENTE!!!!!!!!!!!!');
            }).catch((error) => console.error(error));


        } catch (e) {
            console.log('Error al agregar cliente: ', e);
        }
    };*/

    /*const creaFactura = async (factura: any) => {
        console.log('addTarjeta');
        try {
    
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          await fetch("https://campews.onrender.com/api/facturas/", {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(factura),
            redirect: "follow"
          }).then(async (response) => {
            const codigo = response.status;
            const texto = await response.json();
            return { codigo, texto };
          }).then(async(result) => {
            console.log('FACTURAS result: ', result);

          }).catch((error) => console.error(error));
    
        } catch (e) {
          console.log('Error al agregar cliente: ', e);
        }
    };*/

    /*const creaPago = async (pago: any) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            await fetch(`https://campews.onrender.com/api/pagos/`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(pago),
                redirect: "follow"
            }).then(async (response) => {
                const codigo = response.status;
                const texto = await response.json();
                return { codigo, texto };
            }).then(async(result) => {
                //updateFactura(result.texto._id);
                const oPagosIds = [];
            
                if(pagosIDs.length>0){
                    for(const pago of pagosIDs){
                        oPagosIds.push(pago);
                    }
                
                }

                oPagosIds.push(result.texto._id);
                console.log('ID_PAGO: ',result.texto._id);

                setPagosIDs(oPagosIds);
                console.log('PAGOS result -> ',result);
            
            }).catch((error) => console.error(error));


        } catch (e) {
            console.log('Error al agregar cliente: ', e);
        }
    };*/

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

    const doSync = async() => {

        const userId = await AsyncStorage.getItem('@KeyUserId');

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
                        "foto": cliente.foto,
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

    };

    useEffect(() => {
        getDataSync();
    }, [isFocused]);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFF', justifyContent: 'center', alignItems: 'center' }}>
            {
                isSync ?
                    <ScrollView style={{ backgroundColor: '#FFF' }}>
                        
                        <View style={{ marginHorizontal: 40, marginTop: 25 }}>
                            <Text style={{ fontSize: 16, color: '#5a121c', fontWeight: '600', textAlign: 'center' }}>
                                {'¡Tienes información pendiente por sincronizar!\n\n'}
                                {'IMPORTANTE:\n\n'}
                                {'Asegurate de tener una conexión estable a internet para este proceso.\n'}
                            </Text>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <AnimatedCircularProgress
                                size={180}
                                width={15}
                                fill={count}
                                tintColor="#5a121c"
                                backgroundColor="#f0cdd1"
                                rotation={0}
                                onAnimationComplete={() => console.log('Listo!')}
                                style={{ alignSelf: 'center' }}
                            >
                                {
                                    () => (
                                        <Text style={styles.percentageText}>
                                            {count}%
                                        </Text>
                                    )
                                }
                            </AnimatedCircularProgress>
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

                    </ScrollView> 
                    :<View>
                        <Text>No tienes información pendiente por sincronizar</Text>
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
});