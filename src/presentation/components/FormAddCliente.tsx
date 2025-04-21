import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ActivityIndicator, Button, Divider, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';


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
    setVisita: (visita: string) => void, 
    foto: string,
    setFoto: (foto: string) => void, 
    addCliente: any, 
    cancelar: any 
}

const DIAS = [
    { label: 'Lunes', value: 'Lunes' },
    { label: 'Martes', value: 'Martes' },
    { label: 'Miércoles', value: 'Miércoles' },
    { label: 'Jueves', value: 'Jueves' },
    { label: 'Viernes', value: 'Viernes' },
    { label: 'Sábado', value: 'Sábado' },
    { label: 'Domingo', value: 'Domingo' },
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
    setVisita,
    foto, setFoto,
    addCliente,
    cancelar
} : addClienteProps) => {

    const [dia, setDia] = useState<string>();
    const [ loading, setLoading ] = useState(true);

    const selectDia = (dia: string) => {
        setVisita(dia);
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

    return (
        <View style={{ padding: 13 }}>

            {
                loading ? <>
                <TextInput
                    mode='outlined'
                    label="Nombre"
                    value={nombre}
                    onChangeText={text => setNombre(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                />

                <TextInput
                    mode='outlined'
                    label="Apellido paterno"
                    value={apellidoP}
                    onChangeText={text => setApellidoP(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                />

                <TextInput
                    mode='outlined'
                    label="Apellido materno"
                    value={apellidoM}
                    onChangeText={text => setApellidoM(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                />

                <TextInput
                    mode='outlined'
                    label="Dirección"
                    value={direccion}
                    onChangeText={text => setDireccion(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                    keyboardType='email-address'
                />

                <TextInput
                    mode='outlined'
                    label="Municipio"
                    value={municipio}
                    onChangeText={text => setMunicipio(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                />

                <TextInput
                    mode='outlined'
                    label="Celular"
                    value={tel}
                    onChangeText={text => setTel(text)}
                    style={{ backgroundColor: '#FFF' }}
                    theme={{ colors: { primary: '#871a29' } }}
                    textColor='#000'
                    keyboardType= 'phone-pad'
                />

                <View style={{ marginTop: 7 }}>
                    <Dropdown
                        label={"Día de visita"}
                        placeholder={"Selecciona día de visita"}
                        options={DIAS}
                        value={dia}
                        onSelect={(val: any) => {
                            selectDia(val);
                        }}
                        menuContentStyle={{ backgroundColor: '#871a29' }}
                        /*CustomDropdownInput={(props) => (
                            <TextInput
                              {...props}
                              theme={customTheme}
                              style={{ backgroundColor: customTheme.colors.background }}
                            />
                        )}*/
                    />
                </View>
                
                        <View style={{ marginTop: 7 }}>

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
                                        console.log('Base64 -> ', result.assets[0].base64);
                                        setFoto(result.assets[0].base64 ?? '');
                                        //setFoto('test');
                                    }
                                }}
                                buttonColor='#000'
                                labelStyle={{ color: '#FFF' }}
                                style={{ borderRadius: 7 }}
                            >
                                Tomar foto
                            </Button>

                        </View>

                {/*<View style={{ marginTop: 7 }}>
                    <Button
                        icon="map-marker-plus"
                        mode="contained"
                        onPress={ getLocation }
                        buttonColor='#FFF'
                        labelStyle={{ color: '#C62828' }}
                        style={{ borderRadius: 7, borderColor: '#871a29', borderWidth: 0.5 }}
                    >
                        Obtener ubicación
                    </Button>
                </View>*/}

                <View style={{ marginTop: 20 }}>
                    <Divider style={{ borderColor: '#DEDEDE', borderWidth: 0.35 }} />
                </View>

                <View style={{ marginTop: 15 }}>
                    <Button
                        mode="contained"
                        onPress={ addCliente }
                        buttonColor='#871a29'
                        labelStyle={{ color: '#FFF' }}
                        style={{ borderRadius: 7 }}
                    >
                        Registrar cliente
                    </Button>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Button
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