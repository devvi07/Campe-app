import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { launchCamera } from 'react-native-image-picker';
import { ActivityIndicator, Button, Card, Divider, IconButton, TextInput } from 'react-native-paper';
import { CAMPE_CONTS } from '../utils/Constantes';
import { AlertNotification } from '../../components/AlertNotification';
import { requestAllPermissions } from '../utils/Utils';
import { useClientesLocal } from '../../../hooks/database/clientes/useClientesLocal';

export const AddClienteScreen = ({ route, navigation }: any) => {


    const { ruta } = route.params;
    const [nombre, setNombre] = useState('');
    const [apellidoP, setApellidoP] = useState('');
    const [apellidoM, setApellidoM] = useState('');
    const [direccion, setDireccion] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [tel, setTel] = useState('');
    const [latitud, setLatitud] = useState(0);
    const [longitud, setLongitud] = useState(0);
    //const [ruta, setRuta] = useState('');
    //const [cobrador, setCobrador] = useState('');
    const [foto, setFoto] = useState('');
    const [loading, setLoading] = useState(true);

    const [titleAlert, setTitleAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');
    const [iconAlert, setIconAlert] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const { insertCliente } = useClientesLocal({});
    
    
    const setAlert = (title: string, message: string, icon: string) => {
        setTitleAlert(title);
        setMessageAlert(message);
        setIconAlert(icon);
        setShowAlert(true);
    }
    
    const toggleAlert = () => setShowAlert(!showAlert);

    const addCliente = async() => {
        console.log('addCliente');
        const cobrador = await AsyncStorage.getItem('@KeyUserId');
        if(
            nombre.trim().length == 0 ||
            apellidoP.trim().length == 0 ||
            apellidoM.trim().length == 0 ||
            direccion.trim().length == 0 ||
            municipio.trim().length == 0 ||
            !tel ||
            foto.trim().length == 0
        ){
            setAlert('Alerta', '¡Todos los campos son obligatorios!', 'warning');
            return;
        }
        
        setLoading(false);
        
        /*const cliente = {
            "nombre": nombre.trim(),
            "apellidoP": apellidoP.trim(),
            "apellidoM": apellidoM.trim(),
            "direccion": direccion.trim(),
            "municipio": municipio.trim(),
            "tel": tel,
            "password": "",
            "latitud": Number(latitud),
            "longitud": Number(longitud),
            "ruta": ruta,
            "cobrador": cobrador,
            "foto": foto,
            "tipoUsuario": CAMPE_CONTS.ID_CLIENTE,
            "facturas": [],
        };*/

        const cliente: any = [{
            _id: Date.now().toString(),
            nombre: nombre.trim(),
            apellidoP: apellidoP.trim(),
            apellidoM: apellidoM.trim(),
            direccion: direccion.trim(),
            municipio: municipio.trim(),
            tel: tel,
            latitud: latitud,
            longitud: longitud,
            cobrador: cobrador,
            ruta: ruta,
            foto: foto,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            action: 'INSERT'
        }];

        console.log('AGREGAR CLIENTE: ',cliente);

        const doCliente = await insertCliente(cliente);

        if(doCliente == 1){
            setLoading(true);
            navigation.goBack();
        }else{
            setLoading(true);
            setAlert('Error', '¡Ocurrió un error al registrar al cliente!', 'error');
            return;
        }

        //await createCliente(cliente);
    };

    const createCliente = async (cliente: any) => {
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
          }).then((result) => {
            console.log('result: ', result);
            //Goback
            setLoading(true);
            navigation.goBack();
          }).catch((error) => console.error(error));
    
    
        } catch (e) {
          console.log('Error al agregar cliente: ', e);
        }
    }

    const cancelar = () => navigation.goBack();

    useEffect(() => {
        requestAllPermissions();
    }, []);

    return (
        <ScrollView style={{ backgroundColor: '#FFF' }}>
            <View style={{ paddingTop: 0, marginHorizontal: 10, backgroundColor: '#FFF' }}>

                {
                    loading ? <>
                        <TextInput
                            mode='outlined'
                            label="Nombre *"
                            value={nombre}
                            onChangeText={text => setNombre(text)}
                            style={{ backgroundColor: '#FFF' }}
                            theme={{ colors: { primary: '#5a121c' } }}
                            textColor='#000'
                        />

                        <TextInput
                            mode='outlined'
                            label="Apellido paterno *"
                            value={apellidoP}
                            onChangeText={text => setApellidoP(text)}
                            style={{ backgroundColor: '#FFF' }}
                            theme={{ colors: { primary: '#5a121c' } }}
                            textColor='#000'
                        />

                        <TextInput
                            mode='outlined'
                            label="Apellido materno *"
                            value={apellidoM}
                            onChangeText={text => setApellidoM(text)}
                            style={{ backgroundColor: '#FFF' }}
                            theme={{ colors: { primary: '#5a121c' } }}
                            textColor='#000'
                        />

                        <TextInput
                            mode='outlined'
                            label="Dirección *"
                            value={direccion}
                            onChangeText={text => setDireccion(text)}
                            style={{ backgroundColor: '#FFF' }}
                            theme={{ colors: { primary: '#5a121c' } }}
                            textColor='#000'
                            keyboardType='email-address'
                        />

                        <TextInput
                            mode='outlined'
                            label="Municipio *"
                            value={municipio}
                            onChangeText={text => setMunicipio(text)}
                            style={{ backgroundColor: '#FFF' }}
                            theme={{ colors: { primary: '#5a121c' } }}
                            textColor='#000'
                        />

                        <TextInput
                            mode='outlined'
                            label="Celular *"
                            value={tel}
                            onChangeText={text => setTel(text)}
                            style={{ backgroundColor: '#FFF' }}
                            theme={{ colors: { primary: '#5a121c' } }}
                            textColor='#000'
                            keyboardType='phone-pad'
                        />

                        <View style={{}}>
                            <Card
                                style={{ margin: 16 }}
                                onPress={async () => {

                                    const result = await launchCamera({
                                        mediaType: 'photo',
                                        includeBase64: true,
                                        quality: 0.7,
                                        cameraType: 'back'
                                    });

                                    //cloud name -> dyfx8jypt
                                    //preset -> campe-app
                                    console.log('result.assets: ',result.assets);
                                    if (result.assets && result.assets[0].uri) {
                                        setLoading(false);
                                        const image = result.assets[0];
                                        const data = new FormData();
                                        data.append('file', {
                                            uri: image.uri,
                                            type: image.type,
                                            name: image.fileName,
                                        });
                                        data.append('upload_preset', 'campe-app'); // lo configuras en Cloudinary

                                        const res = await fetch('https://api.cloudinary.com/v1_1/dyfx8jypt/image/upload', {
                                            method: 'POST',
                                            body: data,
                                        });

                                        const json = await res.json();
                                        console.log('json.secure_url -> ',json.secure_url)
                                        setFoto(json.secure_url ?? '');
                                        setLoading(true);
                                        //return json.secure_url; // esta es la URL para guardar

                                    }
                                }}
                            >
                                <View style={{ height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
                                    {
                                        foto.length > 0 ?
                                            <Image
                                                //source={{ uri: `data:image/png;base64,${foto}` }}
                                                source={{ uri: `${foto}` }}
                                                style={{ width: 250, height: 125, borderRadius: 5 }}
                                            />
                                            :
                                            <IconButton icon="camera" size={100} style={{ backgroundColor: '#fFFF' }} />
                                    }
                                </View>
                                <Card.Title
                                    title="Tomar foto *"
                                    titleStyle={{ textAlign: 'center', color: '#000', fontWeight: '700' }}
                                    style={{
                                        backgroundColor: '#f0cdd1',
                                        borderBottomEndRadius: 7,
                                        borderBottomLeftRadius: 7
                                    }}
                                />

                            </Card>
                        </View>

                        <View style={{ marginTop: 15 }}>
                            <Button
                                icon={'plus-circle'}
                                mode="contained"
                                onPress={addCliente}
                                buttonColor='#5a121c'
                                labelStyle={{ color: '#FFF' }}
                                style={{ borderRadius: 7 }}
                            >
                                {'Registrar'}
                            </Button>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Button
                                icon={'account-cancel'}
                                mode="contained"
                                onPress={cancelar}
                                buttonColor='#DEDEDE'
                                labelStyle={{ color: '#000' }}
                                style={{ borderRadius: 7 }}
                            >
                                Cancelar
                            </Button>
                        </View>
                    </> : <>
                        <View style={{ marginTop: 150 }}>
                            <ActivityIndicator animating={true} color={'#871a29'} size={50} />
                        </View>
                    </>
                }

            </View>

            <AlertNotification
                title={titleAlert}
                message={messageAlert}
                icon={iconAlert}
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                cancelar={false}
                toggleAlert={toggleAlert}
                fnAlert={toggleAlert}
            />

        </ScrollView>
    )
}
