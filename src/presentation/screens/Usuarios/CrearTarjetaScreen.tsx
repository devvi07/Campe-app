import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Header } from '../../components/Header';
import { Button, TextInput } from 'react-native-paper';

export const CrearTarjetaScreen = ({ route, navigation }: any) => {

    const { oCliente } = route.params;
    const [articulo, setArticulo] = useState('');
    const [monto, setMonto] = useState('');
    const [abono, setAbono] = useState('0');
    const [cantidad, setCantidad] = useState('');
    
    const addTarjeta = async() => {
        console.log('addTarjeta');
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
      
            //await fetch("https://campews.onrender.com/api/facturas/", {
            await fetch("https://campews.onrender.com/api/facturas/", {
              method: "POST",
              headers: myHeaders,
              body: JSON.stringify({
                "usuario":oCliente._id,
                "pagos":[],
                "articulo": articulo,
                "cantidad": Number(cantidad),
                "total": Number(monto),
                "abono": Number(abono),
                "resta": (Number(monto)-Number(abono == '' ? 0 : abono)),
                "status":"Nuevo"
              }),
              redirect: "follow"
            }).then(async (response) => {
              const codigo = response.status;
              const texto = await response.json();
              return { codigo, texto };
            }).then((result) => {
              console.log('result: ', result);
            
              actualizaCliente(result.texto._id);
              navigation.goBack();
            }).catch((error) => console.error(error));
      
          } catch (e) {
            console.log('Error al agregar cliente: ', e);
          }
    };

    const actualizaCliente = async(idFactura: any) => {

        const facturasIds = [];

        if(oCliente.facturas.length>0){
            for(const idFactura of oCliente.facturas)
                facturasIds.push(idFactura);
        }

        facturasIds.push(idFactura);
        console.log('facturasIds --> ',facturasIds);

        const cliente = {
            "nombre": oCliente.nombre,
            "apellidoP": oCliente.apellidoP,
            "apellidoM": oCliente.apellidoM,
            "direccion": oCliente.direccion,
            "municipio": oCliente.municipio,
            "tel": oCliente.tel,
            "password": "Campe2025",
            "latitud": oCliente.latitud,
            "longitud": oCliente.longitud,
            "dia": oCliente.visita,
            "foto": oCliente.foto,
            "tipoUsuario": "67f964ce14b19d709df579ac",
            "facturas": facturasIds
        };
        
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
      
            console.log('raw -> ', cliente);
            //await fetch("https://campews.onrender.com/api/usuario/", {
            await fetch(`https://campews.onrender.com/api/usuario/${oCliente._id}`, {
              method: "PUT",
              headers: myHeaders,
              body: JSON.stringify(cliente),
              redirect: "follow"
            }).then(async (response) => {
              const codigo = response.status;
              const texto = await response.text();
              return { codigo, texto };
            }).then((result) => {
              console.log('result: ', result);
            }).catch((error) => console.error(error));
      
          } catch (e) {
            console.log('Error al agregar cliente: ', e);
          }
        
    }
    
    useEffect(()=>{
        console.log('tarjeta para idCliente: ',oCliente);
    },[]);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            
            <Header title={`${oCliente.nombre} ${oCliente.apellidoP} ${oCliente.apellidoM}`} color={'#DEDEDE'} textColor={'#000'}/>

            <View style={{ marginHorizontal: 20, marginTop: 20 }}>

                <TextInput
                    mode='outlined'
                    label="Articulo"
                    value={articulo}
                    onChangeText={text => setArticulo(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                />

            </View>

            <View style={{ marginHorizontal: 20, marginTop: 20 }}>

                <TextInput
                    mode='outlined'
                    label="Piezas"
                    value={cantidad}
                    onChangeText={text => setCantidad(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                    keyboardType='numeric'
                />

            </View>

            <View style={{ marginHorizontal: 20, marginTop: 20 }}>

                <TextInput
                    mode='outlined'
                    label="Monto"
                    value={monto}
                    onChangeText={text => setMonto(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                    keyboardType='numeric'
                />

            </View>

            {/*<View style={{ marginHorizontal: 20, marginTop: 20 }}>

                <TextInput
                    mode='outlined'
                    label="Abono"
                    value={abono}
                    onChangeText={text => setAbono(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                    keyboardType='numeric'
                />

            </View>*/}

            <View style={{ marginTop: 40, marginHorizontal: 20 }}>
                <Button
                    mode="contained"
                    onPress={addTarjeta}
                    buttonColor='#871a29'
                    labelStyle={{ color: '#FFF' }}
                    style={{ borderRadius: 7 }}
                >
                    Craer tarjeta
                </Button>
            </View>

        </View>
    )
}
