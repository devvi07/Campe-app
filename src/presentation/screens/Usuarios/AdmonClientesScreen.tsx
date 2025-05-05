import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Appbar, TextInput } from 'react-native-paper';
import { Header } from '../../components/Header';
import { useUsuariosService } from '../../../hooks/usuarios/useUsuariosService';
import { FormAddCliente } from '../../components/FormAddCliente';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ScrollView } from 'react-native-gesture-handler';
import { requestAllPermissions } from '../utils/Utils';
import { AlertNotification } from '../../components/AlertNotification';
import { CAMPE_CONTS } from '../utils/Constantes';

export const AdmonClientesScreen = ({ route, navigation }: any) => {

  const { tipoUsuario } = route.params;
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const [oCliente, setOcliente] = useState([]);
  const [oClienteAux, setOclienteAux] = useState([]);
  const [isAddUser, setIsAddUser] = useState(false);
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
  const { getClientes } = useUsuariosService({ idTipoUsuario: tipoUsuario });

  const ActivateAddCliente = () => setIsAddUser(true);

  const [modoBusqueda, setModoBusqueda] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const _handleSearch = () => setModoBusqueda(true);

  const [titleAlert, setTitleAlert] = useState('');
  const [messageAlert, setMessageAlert] = useState('');
  const [iconAlert, setIconAlert] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [ deleteUser, setDeleteUser ] = useState(false);
  const [ itemDelete, setItemDelete ] = useState('');

  const setAlert = (title: string, message: string, icon: string) => {
    setTitleAlert(title);
    setMessageAlert(message);
    setIconAlert(icon);
    setShowAlert(true);
  }

  const toggleAlert = () => setShowAlert(!showAlert);
  
  const fnAlert = () => {
    if(deleteUser){
      toggleAlert();
      setLoading(false);
      deleteCliente(itemDelete);
    }else{
      toggleAlert();
    }
      
  }
  
  const _handleCloseSearch = () => {
    setModoBusqueda(false);
    setTextoBusqueda('');
    setOcliente(oClienteAux);
  };
  
  const _onChangeText = (text: string) => {
    setTextoBusqueda(text);
    onSearchCte(text);
  };
  
  const onSearchCte = (text: string) => {
    if(text.length>0){
      const result = oClienteAux.filter((item:any) => (
        item.nombre.toLowerCase().includes(text.toLowerCase()) || 
        item.apellidoP.toLowerCase().includes(text.toLowerCase()) || 
        item.apellidoM.toLowerCase().includes(text.toLowerCase()) ||
        item.direccion.toLowerCase().includes(text.toLowerCase()) || 
        item.municipio.toLowerCase().includes(text.toLowerCase())
      ));
      console.log("🚀 ~ onSearchCte ~ result:", result)
      setOcliente(result);
    }else{
      setOcliente(oClienteAux);
    }
  };

  const reload = () => {
    setIsAddUser(false);
    setNombre('');
    setApellidoP('');
    setApellidoM('');
    setDireccion('');
    setMunicipio('');
    setTel('');
    setLatitud('');
    setLongitud('');
    setRuta('');
    setCobrador('');
    setFoto('');
    setDeleteUser(false);
    setItemDelete('');
    setClientes();
  }

  const setClientes = async () => {
    
    setLoading(false);
    const oCliente = await getClientes();
    console.log('Gettin clientes: ', oCliente);
    
    if(oCliente){
      if(oCliente.length>0){ 
        setOcliente(oCliente);  
        setOclienteAux(oCliente);
      }else{
        setOcliente([]);  
        setOclienteAux([]);
      }
    }

    setLoading(true);
    requestAllPermissions();
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
        reload();
      }).catch((error) => console.error(error));


    } catch (e) {
      console.log('Error al agregar cliente: ', e);
    }
  }

  const deleteCliente = async (id: string) => {
    try {

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      console.log('raw -> ', id);
      await fetch(`https://campews.onrender.com/api/usuario/${id}`, {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      }).then(async (response) => {
        const codigo = response.status;
        const texto = await response.text();
        return { codigo, texto };
      }).then((result) => {
        console.log('result: ', result);
        reload();
        setLoading(true);
      }).catch((error) => console.error(error));


    } catch (e) {
      console.log('Error al agregar cliente: ', e);
    }
  }

  const creaTarjeta = (item: any) => {
    navigation.navigate('CrearTarjetaScreen', { oCliente: item });
  };

  const addCliente = async () => {

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

    if(tipoUsuario === CAMPE_CONTS.ID_CLIENTE){
      if(cobrador.trim().length == 0 || ruta.trim().length == 0){
        setAlert('Alerta', '¡Todos los campos son obligatorios!', 'warning');
        return;
      }
    }
    
    setIsAddUser(false);
    setLoading(false);

    const cliente = {
      "nombre": nombre.trim(),
      "apellidoP": apellidoP.trim(),
      "apellidoM": apellidoM.trim(),
      "direccion": direccion.trim(),
      "municipio": municipio.trim(),
      "tel": tel,
      "password": "Campe2025",
      "latitud": Number(latitud),
      "longitud": Number(longitud),
      "ruta": ruta,
      "cobrador": cobrador,
      "foto": foto,
      "tipoUsuario": tipoUsuario,
      "facturas": [],
    };

    await createCliente(cliente);

  };

  const goToRegistroUsuarios = () => {
    setIsAddUser(false);
    navigation.navigate('RegistroUsuarios');
  }

  useEffect(() => {
    setClientes();
  }, [isFocused]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header 
        title={
          tipoUsuario == CAMPE_CONTS.ID_ADMINISTRADOR ? 'Alta de administradores':
          tipoUsuario == CAMPE_CONTS.ID_CLIENTE ? 'Alta de clientes':
          tipoUsuario == CAMPE_CONTS.ID_COBRADOR ? 'Alta de cobradores':
          tipoUsuario == CAMPE_CONTS.ID_DIRECTOR ? 'Alta de directores': 'Agregar tarjeta'
        }
        iconBack={true}
        fnBack={goToRegistroUsuarios} 
      />

      <TouchableOpacity onPress={ActivateAddCliente}>

        <View style={{ backgroundColor: '#DEDEDE', height: 50, flexDirection: 'row', justifyContent: 'center' }}>

          <View style={{ justifyContent: 'center' }}>
            <TextInput.Icon
              icon={'account-plus'}
              size={40}
              color={'#5a121c'}
              onPress={ActivateAddCliente}
            />
          </View>

          <View style={{ justifyContent: 'center', paddingLeft: width * 0.14 }}>
            <Text style={{ color: '#5a121c', fontSize: 15, fontWeight: '900' }}>Agregar</Text>
          </View>

        </View>

      </TouchableOpacity>

      <View>
        {
          (oCliente.length > 0 && !isAddUser) &&
          <Appbar.Header style={{ backgroundColor: '#fbeff0', height: 50 }}>
          {modoBusqueda ? (
            <>
              <Appbar.Action icon="close" color='#5a121c' onPress={_handleCloseSearch} />
              <TextInput
                placeholder="Buscar"
                placeholderTextColor={"#5a121c"}
                value={textoBusqueda}
                onChangeText={_onChangeText}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                underlineColor="transparent"
                activeUnderlineColor="#5a121c"
                autoFocus
                textColor='#000'
                onSubmitEditing={() => {
                  console.log('activo la busqueda');
                }}
              />
            </>
          ) : (
            <>
              <Appbar.Content
                title="Buscar"
                titleStyle={{
                  fontSize: 17,
                  textAlign: 'center',
                  color: '#5a121c'
                }}
                style={{ backgroundColor: '#fbeff0' }}
              />
              <Appbar.Action icon="magnify" color='#5a121c' onPress={_handleSearch} />
            </>
          )}
        </Appbar.Header>
        }
      </View>

      <ScrollView>
        <View style={{}}>

          {
            (loading && oCliente.length > 0 && !isAddUser) ?
              <>
                <View>

                  <SwipeListView
                    data={oCliente}
                    keyExtractor={(item: any) => item._id}
                    renderItem={({ item }) => (

                      <View style={styles.rowFront}>

                        <View style={{ backgroundColor: "#FFF", flexDirection: 'row', justifyContent: 'space-between', width: width*0.6, alignSelf: 'center' }}>
                          <Text style={{ color: '#4B4B4B', fontSize: 15 }}>{`Nombre: `}</Text>
                          <Text style={{ fontWeight: '800' }}>{`${item.nombre} ${item.apellidoP} ${item.apellidoM}`}</Text>
                        </View>

                        <View style={{ backgroundColor: "#FFF", flexDirection: 'row', justifyContent: 'space-between', width: width*0.6, alignSelf: 'center' }}>
                          <Text style={{ color: '#4B4B4B', fontSize: 15 }}>{`Dirección: `}</Text>
                          <Text style={{ fontWeight: '800' }}>{`${item.direccion}`}</Text>
                        </View>

                        {/*<View style={{ backgroundColor: "#FFF", flexDirection: 'row', justifyContent: 'space-between', width: width*0.6, alignSelf: 'center' }}>
                          <Text style={{ color: '#4B4B4B', fontSize: 15 }}>{`Celular: `}</Text>
                          <Text style={{ fontWeight: '800' }}>{`${item.tel}`}</Text>
                        </View>*/}

                        <View style={{ backgroundColor: "#FFF", flexDirection: 'row', justifyContent: 'space-between', width: width*0.6, alignSelf: 'center' }}>
                          <Text style={{ color: '#4B4B4B', fontSize: 15 }}>{`Municipio: `}</Text>
                          <Text style={{ fontWeight: '800' }}>{`${item.municipio}`}</Text>
                        </View>
                        
                      </View>

                    )}
                    renderHiddenItem={({ item }) => (
                      <View style={styles.rowBack}>

                        {/*<TouchableOpacity
                          style={[styles.backButton, styles.tarjetaButton]}
                          onPress={() => {
                            creaTarjeta(item);
                          }}
                        >
                          <Text style={styles.textoAccion}>Crear</Text>
                          <Text style={styles.textoAccion}>tarjeta</Text>
                        </TouchableOpacity>*/}

                        <TouchableOpacity
                          style={[styles.backButton, styles.editButton]}
                          onPress={() => {
                            console.log('Editar');
                            navigation.navigate('EditarUsuario',{ idUser: item._id, tipoUsuario: tipoUsuario });
                          }}
                        >
                          <Text style={styles.textoAccion}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.backButton, styles.deleteButton]}
                          onPress={() => {
                            setItemDelete(item._id);
                            setDeleteUser(true);
                            setAlert('Alerta', '¿Estas seguro de eliminar este usuario?', 'warning');
                            //eliminarItem(item._id);

                          }}
                        >
                          <Text style={styles.textoAccion}>Eliminar</Text>
                        </TouchableOpacity>

                      </View>
                    )}
                    //rightOpenValue={-240} 3 items
                    rightOpenValue={-160}
                    disableRightSwipe
                  />

                </View>

              </>
              :
              <>
                {
                  (loading && !isAddUser) ?
                    <View style={{ backgroundColor: '#FFF', marginTop: height * 0.3, }}>
                      <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#4B4B4B' }}>
                        No existen usuarios registrados
                      </Text>
                    </View>
                    :
                    <>
                      {
                        !isAddUser &&
                        <View style={{ marginTop: 150 }}>
                          <ActivityIndicator animating={true} color={'#871a29'} size={50} />
                        </View>
                      }
                    </>
                }
              </>
          }

          {
            isAddUser &&
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
              addCliente={addCliente}
              cancelar={reload}
              update={false}
              tipoUsuario={tipoUsuario}
            />
          }
        </View>
      </ScrollView>
      <AlertNotification
        title={titleAlert}
        message={messageAlert}
        icon={iconAlert}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        cancelar={deleteUser}
        toggleAlert={toggleAlert}
        fnAlert={fnAlert}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 110,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#CCC',
    paddingRight: 0,
    height: 105
  },
  backButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3A85DC',
  },
  deleteButton: {
    backgroundColor: '#C62828',
  },
  tarjetaButton: {
    backgroundColor: '#4CAF50',
  },
  textoAccion: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});