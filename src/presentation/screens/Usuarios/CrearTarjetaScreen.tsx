import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Header } from '../../components/Header';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { AlertNotification } from '../../components/AlertNotification';
import { useFacturasLocal } from '../../../hooks/database/facturas/useFacturasLocal';

export const CrearTarjetaScreen = ({ route, navigation }: any) => {

  const { oCliente } = route.params;
  const [articulo, setArticulo] = useState('');
  const [monto, setMonto] = useState('');
  const [abono, setAbono] = useState('0');
  const [cantidad, setCantidad] = useState('');

  const [loading, setLoading] = useState(true);

  const [titleAlert, setTitleAlert] = useState('');
  const [messageAlert, setMessageAlert] = useState('');
  const [iconAlert, setIconAlert] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const { insertFactura } = useFacturasLocal();

  const setAlert = (title: string, message: string, icon: string) => {
    setTitleAlert(title);
    setMessageAlert(message);
    setIconAlert(icon);
    setShowAlert(true);
  }

  const toggleAlert = () => setShowAlert(!showAlert);
  const fnAlert = () => toggleAlert();

  const addTarjeta = async () => {
    console.log('addTarjeta');
    try {

      console.log('Number(cantidad): ', Number(cantidad));
      console.log('Number(monto): ', Number(monto));

      if (articulo.trim().length === 0 || Number(cantidad) === 0 || Number(monto) === 0) {
        setAlert('Alert', '¡Todos los campos son obligatorios!', 'warning');
        return;
      }

      setLoading(false);

      const FACTURA: any = [{
        _id: new Date().toISOString(),
        articulo: articulo.trim(),
        cantidad: Number(cantidad),
        total: Number(monto),
        abono: Number(0),
        resta: (Number(monto)-Number(abono == '' ? 0 : abono)),
        status: "Nuevo",
        cliente: oCliente._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pagos: '',
        action: 'INSERT',
      }];
      
      const doFactura = await insertFactura(FACTURA); 
      if(doFactura == 1){
        setLoading(true);
        navigation.goBack();
      }else{
        setLoading(true);
        setAlert('Error', '¡Error al crear la tarjeta!', 'error');
        return;
      }

    } catch (e) {
      console.log('Error al agregar cliente: ', e);
    }
  };
  
  /*const addTarjeta = async () => {
    console.log('addTarjeta');
    try {

      console.log('Number(cantidad): ', Number(cantidad));
      console.log('Number(monto): ', Number(monto));

      if (articulo.trim().length === 0 || Number(cantidad) === 0 || Number(monto) === 0) {
        setAlert('Alert', '¡Todos los campos son obligatorios!', 'warning');
        return;
      }

      setLoading(false);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      await fetch("https://campews.onrender.com/api/facturas/", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          "usuario":oCliente._id,
          "pagos":[],
          "articulo": articulo.trim(),
          "cantidad": Number(cantidad),
          "total": Number(monto),
          "abono": Number(0),
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
        setLoading(true);
        navigation.goBack();
      }).catch((error) => console.error(error));

    } catch (e) {
      console.log('Error al agregar cliente: ', e);
    }
  };*/

  const actualizaCliente = async (idFactura: any) => {

    const facturasIds = [];

    if (oCliente.facturas.length > 0) {
      for (const idFactura of oCliente.facturas)
        facturasIds.push(idFactura);
    }

    facturasIds.push(idFactura);
    console.log('facturasIds --> ', facturasIds);
    const cliente = { "facturas": facturasIds };

    try {

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      console.log('raw -> ', cliente);
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

  useEffect(() => {
    console.log('tarjeta para idCliente: ', oCliente);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>

      {
        loading ?
          <>
            <Header title={`${oCliente.nombre} ${oCliente.apellidoP} ${oCliente.apellidoM}`} color={'#DEDEDE'} textColor={'#000'} />

            <View style={{ marginHorizontal: 20, marginTop: 20 }}>

              <TextInput
                mode='outlined'
                label="Articulo *"
                value={articulo}
                onChangeText={text => setArticulo(text)}
                style={{ backgroundColor: '#FFF' }}
                theme={{ colors: { primary: '#D6D6D6', outline: '#D6D6D6' } }}
                textColor='#000'
              />

            </View>

            <View style={{ marginHorizontal: 20, marginTop: 20 }}>

              <TextInput
                mode='outlined'
                label="Piezas *"
                value={cantidad}
                onChangeText={text => setCantidad(text)}
                style={{ backgroundColor: '#FFF' }}
                theme={{ colors: { primary: '#D6D6D6', outline: '#D6D6D6' } }}
                textColor='#000'
                keyboardType='numeric'
              />

            </View>

            <View style={{ marginHorizontal: 20, marginTop: 20 }}>

              <TextInput
                mode='outlined'
                label="Monto *"
                value={monto}
                onChangeText={text => setMonto(text)}
                style={{ backgroundColor: '#FFF' }}
                theme={{ colors: { primary: '#D6D6D6', outline: '#D6D6D6' } }}
                textColor='#000'
                keyboardType='numeric'
              />

            </View>

            <View style={{ marginTop: 40, marginHorizontal: 20 }}>
              <Button
                mode="contained"
                onPress={addTarjeta}
                buttonColor='#5a121c'
                labelStyle={{ color: '#FFF' }}
                style={{ borderRadius: 7 }}
              >
                Crear tarjeta
              </Button>
            </View>

            <AlertNotification
              title={titleAlert}
              message={messageAlert}
              icon={iconAlert}
              showAlert={showAlert}
              setShowAlert={setShowAlert}
              cancelar={false}
              toggleAlert={toggleAlert}
              fnAlert={fnAlert}
            />
          </> :
          <View style={{ marginTop: 200 }}>
            <ActivityIndicator animating={true} color={'#871a29'} size={50} />
          </View>
      }

    </View>
  )
}
