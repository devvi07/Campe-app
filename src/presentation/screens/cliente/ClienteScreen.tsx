import React, { useEffect, useState } from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { formatMiles, getCurrentDate } from '../utils/Utils';
import { AlertNotification } from '../../components/AlertNotification';
import SendIntentAndroid from 'react-native-send-intent';

export const ClienteScreen = ({route,navigation}: any) => {

    const { item, telCliente, idCliente } = route.params;
    const [ montoTotal, setMontoTotal ] = useState(item.total);
    const [ abono, setAbono ] = useState(0);
    const [ resta, setResta ] = useState(item.resta);
    const [ pagosIds, setPagosIds ] = useState<any>([]);

    const [titleAlert, setTitleAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');
    const [iconAlert, setIconAlert] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const FECHA = getCurrentDate();

    const toggleAlert = () => setShowAlert(!showAlert);

    const setAlert = (title: string, message: string, icon: string) => {
        setTitleAlert(title);
        setMessageAlert(message);
        setIconAlert(icon);
        setShowAlert(true);
    }

    const fnAlert = () => {
        toggleAlert();
        if (iconAlert === 'success'){
            sendWhatsAppMessage(`521${telCliente}`, `Su abono se realizó exitosamente por la cantidad de *${formatMiles(abono.toString().trim(), true)}*. \n *Mubles Campe* agradece su preferencia.`);
        }
        
    };

    const calculaMontosAcumulados = () => {
        const resta = (item.resta - abono);
        setResta(resta);
    };

    const sendWhatsAppMessage = async(phone: string, message: string) => {
        Linking.openURL(`whatsapp://send?text=${message}&phone=${phone}`);
        navigation.goBack();
    };

    const addPagosIds = () => {
        console.log('item.pagos --> ',item.pagos);
        if(item.pagos){

            const oIdPago = [];
            for(const idPago of item.pagos){
                console.log('idPago: ', idPago);
                oIdPago.push(idPago)
            }
            console.log('oIdPago -> ',oIdPago);
            setPagosIds(oIdPago);
        }
    };

    useEffect(()=>{
        console.log('Abonar item: ',item);
        //calculaMontos();
        addPagosIds();
    },[]);

    const creaPago = async () => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            //await fetch(`https://campews.onrender.com/api/pagos/`, {
            await fetch(`https://campews.onrender.com/api/pagos/`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    "factura": item._id,
                    "monto": abono,
                    "metodo": "EFECTIVO",
                    "fecha": Date.now()
                }),
                redirect: "follow"
            }).then(async (response) => {
                const codigo = response.status;
                const texto = await response.json();
                return { codigo, texto };
            }).then((result) => {
                console.log('result: ', result);
                updateFactura(result.texto._id);
            }).catch((error) => console.error(error));


        } catch (e) {
            console.log('Error al agregar cliente: ', e);
        }
    }

    const updateFactura = async (idPago: string) => {
        try {

            console.log('Actualizando factura !!!');
            console.log('idPago: ',idPago);

            const oPagosIds = [];
            
            if(pagosIds.length>0){
                for(const pago of pagosIds){
                    oPagosIds.push(pago);
                }
                
            }

            oPagosIds.push(idPago);
            console.log("🚀 ~ updateFactura ~ oPagosIds:", oPagosIds)
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            await fetch(`https://campews.onrender.com/api/facturas/${item._id}`, {
                method: "PUT",
                headers: myHeaders,
                body: JSON.stringify({
                    "usuario":idCliente,
                    "pagos":oPagosIds,
                    "articulo": item.articulo,
                    "cantidad": item.cantidad,
                    "total": item.total,
                    "abono": Number(abono),
                    "resta": resta,
                    "status":"abono"
                }),
                redirect: "follow"
            }).then(async (response) => {
                const codigo = response.status;
                const texto = await response.text();
                return { codigo, texto };
            }).then((result) => {
                console.log('result Factura: ', result);
                setAlert('Pago registrado', '¡Su abono se realizó exitosamente!\nFavor de realizar la confirmación vía whatsapp.', 'success');
            }).catch((error) => console.error(error));


        } catch (e) {
            console.log('Error al agregar cliente: ', e);
        }
    
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>

            <ScrollView>
                <View style={{ justifyContent: 'center', marginHorizontal: 25, marginTop: 80, alignItems: 'center', marginBottom: 66 }}>
                    <TextInput.Icon
                        //icon={'cash-check'}
                        icon={'hand-coin'}
                        size={160}
                        //color={'#DEDEDE'}
                    />
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                    <TextInput
                        mode='outlined'
                        label="Fecha"
                        value={FECHA}
                        style={{ backgroundColor: '#FFF' }}
                        theme={{ colors: { primary: '#871a29' } }}
                        textColor='#000'
                        editable={false}
                    />
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                    <TextInput
                        mode='outlined'
                        label="Monto total"
                        value={formatMiles(montoTotal.toString(), true)}
                        style={{ backgroundColor: '#FFF' }}
                        theme={{ colors: { primary: '#871a29' } }}
                        textColor='#000'
                        editable={false}
                    />
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                    <TextInput
                        mode='outlined'
                        label="Abono"
                        value={abono.toString()}
                        style={{ backgroundColor: '#FFF' }}
                        theme={{ colors: { primary: '#871a29' } }}
                        textColor='#000'
                        keyboardType='number-pad'
                        onChangeText={text => setAbono(Number(text))}
                        onSubmitEditing={calculaMontosAcumulados}
                    />
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                    <TextInput
                        mode='outlined'
                        label="Resta"
                        value={formatMiles(resta.toString(), true)}
                        style={{ backgroundColor: '#FFF' }}
                        theme={{ colors: { primary: '#871a29' } }}
                        textColor='#000'
                        editable={false}
                    />

                </View>

                {/*<View style={{ marginHorizontal: 20, marginTop: 30 }}>
                    <Button
                        mode="contained"
                        onPress={async () => {
                            console.log('Consultar historial de pagos');
                            navigation.navigate('HistorialPagosScreen');
                        }}
                        buttonColor='#b05f00'
                        labelStyle={{ color: '#FFF' }}
                        style={{ borderRadius: 7 }}
                    >
                        Historial de pagos
                    </Button>
                </View>*/}

                {/*<View style={{ marginHorizontal: 20, marginTop: 30 }}>
                    <Button
                        mode="contained"
                        onPress={async () => {

                            const result = await launchCamera({
                                mediaType: 'photo',
                                includeBase64: true,
                                quality: 0.7,
                                cameraType: 'back'
                            });

                            if (result.assets && result.assets[0].uri) {
                                console.log('Base64 -> ',result.assets[0].base64);
                                //setLoading(false);
                                //setPhoto(result.assets[0].uri);
                                //saveEvidencia(result.assets[0].base64 ?? '');
                            }
                        }}
                        buttonColor='#000'
                        labelStyle={{ color: '#FFF' }}
                        style={{ borderRadius: 7 }}
                    >
                        Capturar evidencia
                    </Button>
                </View>*/}

                <View style={{ marginHorizontal: 20, marginTop: 50 }}>
                    <Button
                        mode="contained"
                        onPress={() => {
                            console.log('Confirmar pago!');
                            console.log('abono: ',abono);
                            if(abono == 0)
                                setAlert('Alerta', '¡Debes indicar la cantidad del abono!', 'warning');
                            else
                                creaPago();    
                                
                        }}
                        buttonColor='#871a29'
                        labelStyle={{ color: '#FFF' }}
                        style={{ borderRadius: 7 }}
                    >
                        Confirmar pago
                    </Button>
                </View>

            </ScrollView>

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

        </View>
    )
}
