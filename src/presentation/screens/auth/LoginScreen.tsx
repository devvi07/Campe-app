import React, { useEffect, useState } from 'react';
import { Image, Keyboard, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { AlertNotification } from '../../components/AlertNotification';

export const LoginScreen = ({ navigation }: any) => {

    const { width, height } = useWindowDimensions();
    const [user, setUser] = useState("");
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
            }).then(async(response) => {
                const codigo = response.status;
                const data = await response.json();
                return { codigo, data };
            }).then(async(result) => {
                console.log(result);
                if(result){
                    if(result.codigo === 401){
                        setAlert('Alerta', result.data.mensaje, 'warning');
                        return;
                    }

                    if(result.codigo == 200){
                        navigation.navigate('Navigation');
                    }else{
                        setAlert('Error', '¡Ocurrio un error al iniciar sesesión!\nIntentar más tarde.', 'Error');
                    }
                    
                }else{
                    setAlert('Error', '¡Ocurrio un error al iniciar sesesión!\nIntentar más tarde.', 'Error');        
                }
            }).catch((error) => {
                console.error(error)
            });

        } catch (e) {
            console.log(`Error en login ${e}`)
            return null;
        }
    }
            
    const singIn = async() => {

        const raw = JSON.stringify({
            "nombre": user,
            "password": pass
        });

        if(user.length===0 || pass.length===0){
            setAlert('Alerta', '¡Todos los campos son obligatorios!', 'warning');
            return;
        }

        getAcceso(raw);
        
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

    useEffect(()=>{
        keyBoardListener();
    },[]);

    return (
        <View style={[ styles.constainer, { paddingTop: keyboardVisible ? 0: height*0.14 } ]}>

            <View style={{ alignItems: 'center', }}>
                <Image source={require("../../../assets/img/campe.png")} style={{ width: 250, height: 230, resizeMode: "contain" }} />
            </View>

            <View style={{ marginHorizontal: 30, paddingTop: 20 }}>

                <View style={{ paddingBottom: 20 }}>
                    <TextInput
                        label="Usuario"
                        value={user}
                        onChangeText={text => setUser(text)}
                        theme={{ colors: { primary: '#871a29' } }}
                        style={{ borderRadius: 7, backgroundColor: '#FFF', borderColor: '#871a29' }}
                        textColor='#000'
                    />
                </View>
                <TextInput
                    label="Contraseña"
                    value={pass}
                    onChangeText={text => setPass(text)}
                    theme={{ colors: { primary: '#871a29' } }}
                    style={{ borderRadius: 7, backgroundColor: '#FFF', borderColor: '#871a29' }}
                    textColor='#000'
                    secureTextEntry={secureTextEntry}
                    right={
                        <TextInput.Icon
                            icon={secureTextEntry ? 'eye-off' : 'eye'}
                            color={'#871a29'} 
                            onPress={() => {
                                setSecureTextEntry(!secureTextEntry);
                            }}
                        />
                    }
                    onSubmitEditing={singIn}
                />
            </View>

            <View style={{ marginHorizontal: 30, paddingTop: 50 }}>
                <Button
                    mode="contained"
                    onPress={singIn}
                    buttonColor='#871a29'
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

        </View>
    )
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        //alignContent: 'center',
        //justifyContent: 'center',
        //backgroundColor: '#871a29',
        backgroundColor: '#FFF',
    }
});