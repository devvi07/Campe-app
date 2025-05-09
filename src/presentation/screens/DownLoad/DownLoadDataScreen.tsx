import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useClientesLocal } from '../../../hooks/database/clientes/useClientesLocal';
import { useFacturasLocal } from '../../../hooks/database/facturas/useFacturasLocal';
import { usePagosLocal } from '../../../hooks/database/pagos/usePagosLocal';
import { Button } from 'react-native-paper';

export const DownLoadDataScreen = ({ route, navigation }: any) => {

    const { idUser } = route.params;
    const { insertCliente } = useClientesLocal({});
    const { insertFactura } = useFacturasLocal();
    const { insertPago } = usePagosLocal();
    const [ count, setCount ] = useState(0);
    const total = 5;

    const getDataClientes = async() => {
        let ponderacion = ((1 / total) * 100);
        setCount(ponderacion);
        try{
            const URI = `https://campews.onrender.com/api/usuario/byCobrador?cobrador=${idUser}`;
            const data = await axios.get(URI);
            ponderacion = ((2 / total) * 100);
            setCount(ponderacion);
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

        let cont = 2;
        let ponderacion = 0;
        
        const clientes = await insertCliente(oDataCte);
        cont+=clientes;
        ponderacion = ((cont / total) * 100);
        setCount(ponderacion);

        const facturas = await insertFactura(oDataFacturas);
        cont+=facturas;
        ponderacion = ((cont / total) * 100);
        setCount(ponderacion);
        const pagos = await insertPago(oDataPagos);
        cont+=pagos;
        ponderacion = ((cont / total) * 100);
        setCount(ponderacion);

    }

    const singIn = () => navigation.navigate('Navigation');

    useEffect(()=>{
        getDataClientes();
    },[]);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFF', justifyContent: 'center' }}>

            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#5a121c' }}>
                {`Iniciando el proceso de descarga.\n`}
            </Text>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#5a121c' }}>
                {`Esto puede tardar unos minutos dependiendo de tu conexión a internet.\n`}
            </Text>
            
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
                
            {
                count == 100 &&
                <>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#5a121c' }}>
                    {`\n\n ¡La información se descargó de manera exitosa!`}
                </Text>
                <View style={{ marginHorizontal: 50, paddingTop: 50 }}>
                    <Button
                        mode="contained"
                        onPress={singIn}
                        buttonColor='#5a121c'
                        labelStyle={{ color: '#FFF' }}
                        style={{ borderRadius: 7 }}
                    >
                        Aceptar
                    </Button>
                </View>
                </>
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