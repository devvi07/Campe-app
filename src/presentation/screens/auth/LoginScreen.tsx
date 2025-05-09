import React, { useEffect, useState } from 'react';
import { Image, Keyboard, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { AlertNotification } from '../../components/AlertNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginScreen = ({ navigation }: any) => {

    const { width, height } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState("");
    const [sessionUser, setSessionUser] = useState("");
    const [pass, setPass] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [titleAlert, setTitleAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');
    const [iconAlert, setIconAlert] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const goToForgetPass = () => navigation.navigate('OlvideContraseniaScreen');
    const toggleAlert = () => setShowAlert(!showAlert);
    const fnAlert = () => toggleAlert();

    const setAlert = (title: string, message: string, icon: string) => {
        setTitleAlert(title);
        setMessageAlert(message);
        setIconAlert(icon);
        setShowAlert(true);
    }

    const getAcceso = async (raw: any) => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            await fetch("https://campews.onrender.com/api/usuario/login", {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            }).then(async (response) => {
                const codigo = response.status;
                const data = await response.json();
                return { codigo, data };
            }).then(async (result) => {
                console.log(result);
                if (result) {
                    if (result.codigo === 401) {
                        setLoading(true);
                        setAlert('Alerta', result.data.mensaje, 'warning');
                        return;
                    }

                    if (result.codigo == 200) {
                        await AsyncStorage.setItem('@KeyUserId', result.data.usuario._id);
                        await AsyncStorage.setItem('@KeyUser', result.data.usuario.nombre);
                        await AsyncStorage.setItem('@KeyPass', result.data.usuario.password);
                        await AsyncStorage.setItem('@KeyTipoUser', result.data.usuario.tipoUsuario.tipo+"");
                        console.log('result.data.usuario.tipoUsuario.tipo: ',result.data.usuario.tipoUsuario.tipo)
                        //Este navigation se va a recolocar para realizar el proceso
                        //de descarga de info local
                        //navigation.navigate('Navigation');
                        navigation.navigate('DownLoadDataScreen', { idUser:  result.data.usuario._id});
                    } else {
                        setLoading(true);
                        setAlert('Error', '¡Ocurrio un error al iniciar sesión!\nIntentar más tarde.', 'Error');
                    }

                } else {
                    setLoading(true);
                    setAlert('Error', '¡Ocurrio un error al iniciar sesión!\nIntentar más tarde.', 'Error');
                }
            }).catch((error) => {
                setLoading(true);
                console.error(error);
                setAlert('Error', '¡Ocurrio un error al iniciar sesión!\nIntentar más tarde.', 'Error');
            });

        } catch (e) {
            console.log(`Error en login ${e}`)
            return null;
        }
    }

    const singIn = async () => {

        const raw = JSON.stringify({
            "nombre": user,
            "password": pass
        });

        if (user.length === 0 || pass.length === 0) {
            setAlert('Alerta', '¡Todos los campos son obligatorios!', 'warning');
            return;
        }

        setLoading(false);

        const userName = await AsyncStorage.getItem('@KeyUser');

        if(userName){
            const userPass = await AsyncStorage.getItem('@KeyPass');
            console.log("🚀 ~ singIn ~ pass:", pass);
            console.log("🚀 ~ singIn ~ userPass:", userPass);
            console.log('NAVEGACION LOCAL');
            if(pass == userPass){
                navigation.navigate('Navigation');
            }else{
                console.log('ENTRO AL ELSE');
                setAlert('Alerta', '¡Contraseña incorrecta!', 'warning');
                setLoading(true);
                return;
            }
                
            
        }else{
            getAcceso(raw);
        }
        
    }

    const keyBoardListener = () => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }

    const getSessionUser = async ()=> {
        const sessionUser = await AsyncStorage.getItem('@KeyUser');
        if(sessionUser !== null)
            setUser(sessionUser);
            
    }

    useEffect(() => {
        getSessionUser();
        keyBoardListener();
    }, []);

    return (
        <View style={[styles.constainer, { paddingTop: keyboardVisible ? 0 : height * 0.16, bottom: keyboardVisible ? 40 : 0 }]}>
            {
                loading ?
                    <>
                        <View style={{ alignItems: 'center', }}>
                            <Image source={require("../../../assets/img/campe.png")} style={{ width: 250, height: 230, resizeMode: "contain" }} />
                        </View>

                        <View style={{ marginHorizontal: 30, paddingTop: 20 }}>

                            <View style={{ paddingBottom: 20 }}>
                                <TextInput
                                    label="Usuario"
                                    value={user}
                                    onChangeText={text => setUser(text)}
                                    theme={{ colors: { primary: '#5a121c' } }}
                                    style={{ borderRadius: 7, backgroundColor: '#FFF', borderColor: '#5a121c' }}
                                    textColor='#000'
                                    autoCapitalize='none'
                                />
                            </View>
                            <TextInput
                                label="Contraseña"
                                value={pass}
                                onChangeText={text => setPass(text)}
                                theme={{ colors: { primary: '#5a121c' } }}
                                style={{ borderRadius: 7, backgroundColor: '#FFF', borderColor: '#5a121c' }}
                                textColor='#000'
                                secureTextEntry={secureTextEntry}
                                right={
                                    <TextInput.Icon
                                        icon={secureTextEntry ? 'eye-off' : 'eye'}
                                        color={'#5a121c'}
                                        onPress={() => {
                                            setSecureTextEntry(!secureTextEntry);
                                        }}
                                    />
                                }
                                onSubmitEditing={singIn}
                                autoCapitalize='none'
                            />
                        </View>

                        <View style={{ marginHorizontal: 30, paddingTop: 50 }}>
                            <Button
                                mode="contained"
                                onPress={singIn}
                                buttonColor='#5a121c'
                                labelStyle={{ color: '#FFF' }}
                                style={{ borderRadius: 7 }}
                            >
                                Entrar
                            </Button>
                        </View>

                        {/*<View style={{ paddingTop: 30, paddingBottom: 20 }}>
                <TouchableOpacity onPress={goToForgetPass}>
                    <Text style={{ textAlign: 'center', fontSize: 14, textDecorationLine: 'underline' }}>Olvide mi contraseña</Text>
                </TouchableOpacity>
            </View>*/}

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

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        backgroundColor: '#FFF',
    }
});