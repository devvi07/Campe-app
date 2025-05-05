import React, { useEffect, useState } from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { formatDate, formatMiles, getCurrentDate, getCurrentDateDDMMYYYY } from '../utils/Utils';
import { AlertNotification } from '../../components/AlertNotification';
import SendIntentAndroid from 'react-native-send-intent';
import { Dropdown } from 'react-native-paper-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePagosLocal } from '../../../hooks/database/pagos/usePagosLocal';
import { useFacturasLocal } from '../../../hooks/database/facturas/useFacturasLocal';
import { FacturasModel } from '../../../core/models/FacturasModel';
import { useQuery } from '@realm/react';

export const ClienteScreen = ({route,navigation}: any) => {

    const { item, telCliente, idCliente, municipio } = route.params;
    const [ montoTotal, setMontoTotal ] = useState(item.total);
    const [ abono, setAbono ] = useState(0);
    const [ resta, setResta ] = useState(item.resta);
    const [ pagosIds, setPagosIds ] = useState<any>([]);
    const [metodoPago, setMetodoPago] = useState<string>();

    const [userId, setUserId] = useState<any>('');
    const [titleAlert, setTitleAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');
    const [iconAlert, setIconAlert] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const FECHA = getCurrentDate();

    const { insertPago } = usePagosLocal();
    const { updateFactura } = useFacturasLocal();

    const FACTURAS_LOCAL = useQuery(FacturasModel);
    const getFacturas = (_id: string) => {
        const filtrados = FACTURAS_LOCAL.filtered('_id == $0', _id);
        return Array.from(filtrados);
    };

    const toggleAlert = () => setShowAlert(!showAlert);

    const PAGOS = [
        { label: 'Efectivo', value: 'Efectivo' },
        { label: 'Transferencia', value: 'Transferencia' },
        { label: 'Sin abono', value: 'Sin abono' },
    ];

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
        }else if (iconAlert === 'info'){
            navigation.goBack();
        }
        
    };

    const calculaMontosAcumulados = () => {
        const resta = (item.resta - abono);
        setResta(resta);
    };

    const sendWhatsAppMessage = async(phone: string, message: string) => {
        Linking.openURL(`whatsapp://send?text=${message}&phone=${phone}`);
        //navigation.navigate('RegistrarPagosScreen',{ municipio:municipio, recargar: true});
        navigation.goBack();
    };

    const addPagosIds = () => {
        if(item.pagos){

            const oIdPago = [];
            for(const idPago of item.pagos){
                oIdPago.push(idPago)
            }
            console.log(oIdPago);
            setPagosIds(oIdPago);
        }
    };

    const getUserId = async() => {
        const userId = await AsyncStorage.getItem('@KeyUserId');
        setUserId(userId);
    }

    useEffect(()=>{
        console.log('Abonar item: ',item);
        //calculaMontos();
        getUserId();
        addPagosIds();
    },[]);

    const creaPago = async() =>{
        
        setLoading(false);

        const PAGO: any = [{
            _id: Date.now().toString(),
            monto: abono,
            metodo: abono == 0 ? 'Sin abono' : metodoPago,
            status: abono == 0 ? 'Sin abono' : 'abono',
            fecha: new Date().toISOString(),
            usuario: userId,
            factura: item._id,
            action: 'INSERT'
        }];

        const doPago = await insertPago(PAGO);

        if (doPago == 1) {

            setLoading(true);
            console.log('idCliente: ',idCliente)
            let status = abono == 0 ? 'Sin abono' : 'abono';
            
            if(resta === 0)
                status = 'Pagado';

            const oFacturas = getFacturas(item._id);
            console.log("🚀 ~ creaPago ~ oFacturas:", oFacturas)
            console.log("🚀 ~ creaPago ~ oFacturas:", oFacturas[0].action)
            const action = oFacturas[0].action == 'INSERT' ? 'INSERT' : 'UPDATE';
            const FACTURA: any = [{
                _id: item._id,
                articulo: item.articulo,
                cantidad: item.cantidad,
                total: item.total,
                abono: abono,
                resta: resta,
                status: status,
                cliente: idCliente,
                createdAt: item.createdAt,
                updatedAt: new Date().toISOString(),
                action: action,
            }];

            const doUpdateFactura =  await updateFactura(FACTURA);
            
            if(doUpdateFactura == 1){
                if (abono == 0) {
                    setAlert('Sin abono', '¡Su visita al cliente a sido registrada en el sistema!', 'info');
                } else {
                    setAlert('Pago registrado', '¡Su abono se realizó exitosamente!\nFavor de realizar la confirmación vía whatsapp.', 'success');
                }
            }else{
                setAlert('Error', '¡Ocurrió un error al registrar el pago!', 'error');
                setLoading(true);
                return;
            }
            
        }else{
            setAlert('Error', '¡Ocurrió un error al registrar el pago!', 'error');
            setLoading(true);
            return;
        }

    }

    /*const creaPago = async () => {
        try {
            setLoading(false);
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            //await fetch(`https://campews.onrender.com/api/pagos/`, {
            await fetch(`https://campews.onrender.com/api/pagos/`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    "monto": abono,
                    "metodo": abono == 0 ? 'Sin abono' : metodoPago,
                    "status": abono == 0 ? 'Sin abono' : 'abono',
                    "fecha": Date.now(),
                    "usuario": userId
                }),
                redirect: "follow"
            }).then(async (response) => {
                const codigo = response.status;
                const texto = await response.json();
                return { codigo, texto };
            }).then((result) => {
                updateFactura(result.texto._id);
            }).catch((error) => console.error(error));


        } catch (e) {
            console.log('Error al agregar cliente: ', e);
        }
    }*/

    const updateFacturaOnline = async (idPago: string) => {
        try {

            const oPagosIds = [];
            
            if(pagosIds.length>0){
                for(const pago of pagosIds){
                    oPagosIds.push(pago);
                }
                
            }

            let status = abono == 0 ? 'Sin abono' : 'abono';

            if(resta === 0)
                status = 'Pagado';

            oPagosIds.push(idPago);
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
                    "status": status
                }),
                redirect: "follow"
            }).then(async (response) => {
                const codigo = response.status;
                const texto = await response.text();
                return { codigo, texto };
            }).then((result) => {
                setLoading(true);
                if(abono == 0){
                    setAlert('Sin abono', '¡Su visita al cliente a sido registrada en el sistema!', 'info');
                }else{
                    setAlert('Pago registrado', '¡Su abono se realizó exitosamente!\nFavor de realizar la confirmación vía whatsapp.', 'success');
                }
                
            }).catch((error) => console.error(error));


        } catch (e) {
            console.log('Error al agregar cliente: ', e);
        }
    
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        {
            loading ? 
            <>
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
                        theme={{ colors: { primary: '#5a121c' } }}
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
                        theme={{ colors: { primary: '#5a121c' } }}
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
                        theme={{ colors: { primary: '#5a121c' } }}
                        textColor='#000'
                        keyboardType='number-pad'
                        onChangeText={text => setAbono(Number(text))}
                        onSubmitEditing={calculaMontosAcumulados}
                        onBlur={calculaMontosAcumulados}
                    />
                </View>
                
                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                    <Dropdown
                        label={"Metódo de pago"}
                        placeholder={"Selecciona método de pago"}
                        options={PAGOS}
                        value={metodoPago}
                        onSelect={(val: any) => {
                            
                            if(val === 'Sin abono')
                                setAbono(0);

                            setMetodoPago(val);

                        }}
                        menuContentStyle={{ backgroundColor: '#000' }}
                    />
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                    <TextInput
                        mode='outlined'
                        label="Resta"
                        value={formatMiles(resta.toString(), true)}
                        style={{ backgroundColor: '#FFF' }}
                        theme={{ colors: { primary: '#5a121c' } }}
                        textColor='#000'
                        editable={false}
                    />

                </View>
                
                {
                item.status !== 'Pagado' &&
                <View style={{ marginHorizontal: 20, marginTop: 50 }}>
                    <Button
                        mode="contained"
                        onPress={() => {

                            if(!metodoPago){
                                setAlert('Alerta', '¡Debes indicar un metódo de pago!', 'warning');
                                return; 
                            }

                            if(metodoPago == 'Sin abono' && abono>0){
                                setAlert('Alerta', '¡Metódo de pago no valido!', 'warning');
                                return; 
                            }

                            ///if(abono>resta){
                            if(resta<0){
                                setAlert('Alerta', '¡El abono no es válido!', 'warning');
                                return; 
                            }
                            
                            if(abono == 0 && metodoPago !== 'Sin abono'){
                                setAlert('Alerta', '¡Debes indicar la cantidad del abono!', 'warning');
                            } else{
                                creaPago();
                            }
                            
                        }}
                        buttonColor='#5a121c'
                        labelStyle={{ color: '#FFF' }}
                        style={{ borderRadius: 7 }}
                    >
                        Confirmar pago
                    </Button>
                </View>
                }

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
            </>:
            <View style={{ marginTop: 150 }}>
                <ActivityIndicator animating={true} color={'#871a29'} size={50} />
            </View>
        }
        </View>
    )
}
