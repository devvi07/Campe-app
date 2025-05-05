import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { FormAddCliente } from '../../components/FormAddCliente';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { AlertNotification } from '../../components/AlertNotification';

export const EditarUsuario = ({ route, navigation }: any) => {

    const { idUser, tipoUsuario } = route.params;
    const [nombre, setNombre] = useState('');
    const [apellidoP, setApellidoP] = useState('');
    const [apellidoM, setApellidoM] = useState('');
    const [direccion, setDireccion] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [tel, setTel] = useState('');
    const [latitud, setLatitud] = useState('');
    const [longitud, setLongitud] = useState('');
    const [ruta, setRuta] = useState('');
    const [cobrador, setCobrador] = useState('');
    const [foto, setFoto] = useState('');

    const [loading, setLoading] = useState(false);

    const [titleAlert, setTitleAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');
    const [iconAlert, setIconAlert] = useState('');
    const [showAlert, setShowAlert] = useState(false);


    const setAlert = (title: string, message: string, icon: string) => {
        setTitleAlert(title);
        setMessageAlert(message);
        setIconAlert(icon);
        setShowAlert(true);
    }

    const toggleAlert = () => {
        setShowAlert(!showAlert);
        setLoading(true);
    }

    const cancelar = () => navigation.goBack();
    
    const updateUser = async() => {

        console.log('ACTUALIZAR USUARIO');
        setLoading(false);

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

        const oUser = {
            "nombre": nombre.trim(),
            "apellidoP": apellidoP.trim(),
            "apellidoM": apellidoM.trim(),
            "direccion": direccion.trim(),
            "municipio": municipio.trim(),
            "tel": tel,
            "foto": foto
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(`https://campews.onrender.com/api/usuario/${idUser}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(oUser),
            redirect: "follow",
        }).then(async (response) => {
            const codigo = response.status;
            const data = await response.json();
            return { codigo, data };
        }).then((result) => {
            console.log('result: ', result);
            setLoading(true);
            setAlert('Exito', '¡Usuario actualizado exitosamente!', 'success');
        }).catch((error) => console.error(error));
    };

    const getUsuario = () => {
        
        setLoading(false);
        fetch(`https://campews.onrender.com/api/usuario/${idUser}`, {
            method: "GET",
            redirect: "follow"
        }).then(async (response) => {
            const codigo = response.status;
            const data = await response.json();
            return { codigo, data };
        }).then((result) => {
            console.log('result: ', result);
            //setData(result.data);
            setDataUser(result.data);
        }).catch((error) => console.error(error));

    }

    const setDataUser = (data: any) => {
        
        console.log("🚀 ~ setDataUser ~ setDataUser:",data.nombre);

        setNombre(data.nombre); 
        setApellidoP(data.apellidoP);
        setApellidoM(data.apellidoM);
        setDireccion(data.direccion);
        setMunicipio(data.municipio);
        setTel(data.tel);
        setFoto(data.foto);
        setLoading(true);
    }
    
    useEffect(() => {
        getUsuario();
    }, []);

    return (
        <ScrollView>
            {
                loading ?
                    <FormAddCliente
                        nombre={nombre}
                        setNombre={setNombre}
                        apellidoP={apellidoP}
                        setApellidoP={setApellidoP}
                        apellidoM={apellidoM}
                        setApellidoM={setApellidoM}
                        direccion={direccion}
                        municipio={municipio}
                        setMunicipio={setMunicipio}
                        setDireccion={setDireccion}
                        tel={tel}
                        setTel={setTel}
                        setLatitud={setLatitud}
                        setLongitud={setLongitud}
                        setRuta={setRuta}
                        setCobrador={setCobrador}
                        foto={foto}
                        setFoto={setFoto}
                        addCliente={updateUser}
                        cancelar={cancelar}
                        update={true}
                        tipoUsuario={tipoUsuario}
                    /> :
                    <View style={{ marginTop: 150 }}>
                        <ActivityIndicator animating={true} color={'#871a29'} size={50} />
                    </View>
            }
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
};