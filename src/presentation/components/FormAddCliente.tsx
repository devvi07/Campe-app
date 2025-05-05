import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, IconButton, Paragraph, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { CAMPE_CONTS } from '../screens/utils/Constantes';
import { useUsuariosService } from '../../hooks/usuarios/useUsuariosService';


type addClienteProps = {
    nombre: string,
    setNombre: (nombre: string) => void,
    apellidoP: string,
    setApellidoP: (apellidoP: string) => void, 
    apellidoM: string,
    setApellidoM: (apellidoM: string) => void,
    direccion: string,
    setDireccion: (direccion: string) => void,
    municipio: string,
    setMunicipio: (municipio: string) => void,
    tel: string,
    setTel: (tel: string) => void,
    setLatitud: (latitud: string) => void,
    setLongitud: (latitud: string) => void,
    setRuta: (visita: string) => void, 
    setCobrador: (visita: string) => void, 
    foto: string,
    setFoto: (foto: string) => void, 
    addCliente: any, 
    cancelar: any, 
    update: boolean,
    tipoUsuario: string 
}

const DIAS = [
    { label: 'Ruta 1 (Lunes)', value: 'Lunes' },
    { label: 'Ruta 2 (Martes)', value: 'Martes' },
    { label: 'Ruta 3 (Miércoles', value: 'Miércoles' },
    { label: 'Ruta 4 (Jueves)', value: 'Jueves' },
    { label: 'Ruta 5 (Viernes)', value: 'Viernes' },
    { label: 'Ruta 6 (Sábado)', value: 'Sábado' },
    { label: 'Ruta 7 (Domingo)', value: 'Domingo' },
];

export const FormAddCliente = ({ 
    nombre, setNombre, 
    apellidoP, setApellidoP, 
    apellidoM, setApellidoM, 
    direccion, setDireccion, 
    municipio, setMunicipio, 
    tel, setTel, 
    setLatitud,
    setLongitud,
    setRuta,
    setCobrador,
    foto, setFoto,
    addCliente,
    cancelar,
    update,
    tipoUsuario
} : addClienteProps) => {

    const [dia, setDia] = useState<string>();
    const [ loading, setLoading ] = useState(true);
    const [ cobradores, setCobradores ] = useState<any>([]);
    const [ cobrador, setSCobrador ] = useState('');

    const { getClientes } = useUsuariosService({ idTipoUsuario: CAMPE_CONTS.ID_COBRADOR });

    const selectDia = (dia: string) => {
        setRuta(dia);
        setDia(dia);
    };

    const getLocation = async () => {
        
        setLoading(false);
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return;

        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatitud(latitude.toString());
                setLongitud(longitude.toString());
                console.log('Lat:',latitude, 'Long:',longitude);
                setLoading(true); 
            },
            (error) => {
                console.log('Error al obtener ubicación:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            }
        );
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') return true;

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permiso de ubicación',
                    message: 'Esta app necesita acceso a tu ubicación',
                    buttonNeutral: 'Pregúntame luego',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const customTheme = {
        colors: {
            primary: '#000', // color de foco y línea
            underlineColor: 'transparent',
            background: '#f6f6f6',
            text: '#000000',     // color del texto
            placeholder: '#aaaaaa', // color del placeholder
        },
    };

    const getCobradores = async() => {
        setLoading(false);
        const cobradores = await getClientes();
        
        const oCobrador = [];

        for(const cobrador of cobradores){
            oCobrador.push(
                { label: `${cobrador.nombre} ${cobrador.apellidoP} ${cobrador.apellidoM}`, value: cobrador._id },
            );
        }

        setCobradores(oCobrador);
        setLoading(true);
        console.log("🚀 ~ getCobradores ~ cobradores:", cobradores)
    };

    useEffect(()=>{
        
        if(tipoUsuario === CAMPE_CONTS.ID_CLIENTE)
            getCobradores();
        
    },[]);

    return (
        <View style={{ padding: 13 }}>

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
                    keyboardType= 'phone-pad'
                />

                {
                    (tipoUsuario == CAMPE_CONTS.ID_CLIENTE) &&
                    <>
                    <View style={{ marginTop: 7 }}>
                        <Dropdown
                            label={"Asignar cobrador *"}
                            placeholder={"Asignar cobrador *"}
                            options={cobradores}
                            value={cobrador}
                            onSelect={(val: any) => {
                                setCobrador(val);
                                setSCobrador(val);
                            }}
                            menuContentStyle={{ backgroundColor: '#000' }}
                        />
                    </View>
                    <View style={{ marginTop: 7 }}>
                        <Dropdown
                            label={"Asignar ruta *"}
                            placeholder={"Asignar ruta *"}
                            options={DIAS}
                            value={dia}
                            onSelect={(val: any) => {
                                selectDia(val);
                            }}
                            menuContentStyle={{ backgroundColor: '#000' }}
                        />
                    </View>
                    </>
                }
                    
                    <View style={{  }}>
                        <Card 
                            style={{ margin: 16 }}
                            onPress={async () => {

                                const result = await launchCamera({
                                    mediaType: 'photo',
                                    includeBase64: true,
                                    quality: 0.7,
                                    cameraType: 'back'
                                });

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
                                    console.log('json.secure_url -> ', json.secure_url)
                                    setFoto(json.secure_url ?? '');
                                    setLoading(true);
                                    //return json.secure_url; // esta es la URL para guardar
                                }
                            }} 
                        >
                            <View style={{ height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
                                {
                                    foto.length>0 ?
                                    <Image
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

                {/*<View style={{ marginTop: 7 }}>
                    <Button
                        icon="map-marker-plus"
                        mode="contained"
                        onPress={ getLocation }
                        buttonColor='#FFF'
                        labelStyle={{ color: '#5a121c' }}
                        style={{ borderRadius: 7, borderColor: '#5a121c', borderWidth: 0.5 }}
                    >
                        Obtener ubicación
                    </Button>
                </View>*/}

                <View style={{ marginTop: 20 }}>
                    <Divider style={{ borderColor: '#DEDEDE', borderWidth: 0.35 }} />
                </View>

                <View style={{ marginTop: 15 }}>
                    <Button
                        icon={update ? 'update':'plus-circle'}
                        mode="contained"
                        onPress={ addCliente }
                        buttonColor='#5a121c'
                        labelStyle={{ color: '#FFF' }}
                        style={{ borderRadius: 7 }}
                    >
                        { update ? 'Actualizar' : 'Registrar' }
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
                </>:<>
                <View style={{ marginTop: 150 }}>
                    <ActivityIndicator animating={true} color={'#871a29'} size={50}/>
                </View>
                </>
            }    

        </View>
    )
};