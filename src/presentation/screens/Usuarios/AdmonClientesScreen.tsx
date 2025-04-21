import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { Header } from '../../components/Header';
import { useUsuariosService } from '../../../hooks/usuarios/useUsuariosService';
import { FormAddCliente } from '../../components/FormAddCliente';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ScrollView } from 'react-native-gesture-handler';

export const AdmonClientesScreen = ({ route, navigation }: any) => {

  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const [oCliente, setOcliente] = useState([]);
  const [isAddUser, setIsAddUser] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellidoP, setApellidoP] = useState('');
  const [apellidoM, setApellidoM] = useState('');
  const [direccion, setDireccion] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [tel, setTel] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [visita, setVisita] = useState('');
  const [foto, setFoto] = useState('');
  const [loading, setLoading] = useState(false);
  const { getClientes } = useUsuariosService({});

  const ActivateAddCliente = () => setIsAddUser(true);

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
    setVisita('');
    setFoto('');
    setClientes();
  }

  const setClientes = async () => {
    const oCliente = await getClientes();
    console.log('isAddUser: ', isAddUser);
    console.log('Gettin clientes: ', oCliente);
    setOcliente(oCliente);
    setLoading(true);
  };

  const createCliente = async (cliente: any) => {
    try {

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      console.log('raw -> ', cliente);
      //await fetch("https://campews.onrender.com/api/usuario/", {
      await fetch("http://192.168.0.103:3000/api/usuario/", {
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
      //await fetch(`https://campews.onrender.com/api/usuario/${id}`, {
      await fetch(`http://192.168.0.103:3000/api/usuario/${id}`, {
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
      }).catch((error) => console.error(error));


    } catch (e) {
      console.log('Error al agregar cliente: ', e);
    }
  }

  const creaTarjeta = (item: any) => {
    navigation.navigate('CrearTarjetaScreen', { oCliente: item });
  };

  const addCliente = async () => {

    console.log('Tamaño en base64:', foto.length);
    setIsAddUser(false);
    setLoading(false);
    const cliente = {
      "nombre": nombre,
      "apellidoP": apellidoP,
      "apellidoM": apellidoM,
      "direccion": direccion,
      "municipio": municipio,
      "tel": tel,
      "password": "Campe2025",
      "latitud": Number(latitud),
      "longitud": Number(longitud),
      "dia": visita,
      "foto": foto,
      "tipoUsuario": "67f964ce14b19d709df579ac",
      "facturas": [],
    };

    await createCliente(cliente);

  };

  useEffect(() => {
    setClientes();
  }, [isFocused]);

  /*useFocusEffect(useCallback(() => {
    setClientes();
      return () => {
        console.log('out alta clientes');
      };
    }, [])
  );*/

  type ItemProps = { title: string };

  const Item = ({ title }: any) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const eliminarItem = (id: string) => {
    Alert.alert('Eliminar', '¿Estás seguro que deseas eliminar esto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: () => {
          deleteCliente(id);
        },
        style: 'destructive'
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header title={'Alta de clientes'} />

      <TouchableOpacity onPress={ActivateAddCliente}>

        <View style={{ backgroundColor: '#DEDEDE', height: 50, flexDirection: 'row', justifyContent: 'center' }}>

          <View style={{ justifyContent: 'center' }}>
            <TextInput.Icon
              icon={'account-plus'}
              size={40}
              color={'#871a29'}
              onPress={ActivateAddCliente}
            />
          </View>

          <View style={{ justifyContent: 'center', paddingLeft: width * 0.14 }}>
            <Text style={{ color: '#871a29', fontSize: 15, fontWeight: '900' }}>Agregar cliente</Text>
          </View>

        </View>

      </TouchableOpacity>

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

                        <View style={{ backgroundColor: "#FFF", flexDirection: 'row', justifyContent: 'space-between', maxWidth: width * 0.8 }}>
                          <Text style={{ color: '#4B4B4B', fontSize: 15 }}>
                            {`Nombre: `}<Text style={{ fontWeight: '800' }}>{`${item.nombre} ${item.apellidoP} ${item.apellidoM}`}</Text>
                          </Text>
                        </View>

                        <View style={{ backgroundColor: "#FFF", flexDirection: 'row', justifyContent: 'space-between', maxWidth: width * 0.8 }}>
                          <Text style={{ color: '#4B4B4B', fontSize: 15 }}>
                            {`Dirección: `}<Text style={{ fontWeight: '800' }}>{`${item.direccion}`}</Text>
                          </Text>
                        </View>

                        <View style={{ backgroundColor: "#FFF", flexDirection: 'row', justifyContent: 'space-between', maxWidth: width * 0.8 }}>
                          <Text style={{ color: '#4B4B4B', fontSize: 15 }}>
                            {`Celular: `}<Text style={{ fontWeight: '800' }}>{`${item.tel}`}</Text>
                          </Text>
                        </View>

                        <View style={{ backgroundColor: "#FFF", flexDirection: 'row', justifyContent: 'space-between', maxWidth: width * 0.8 }}>
                          <Text style={{ color: '#4B4B4B', fontSize: 15 }}>
                            {`Día de visita: `}<Text style={{ fontWeight: '800' }}>{`${item.dia}`}</Text>
                          </Text>
                        </View>

                      </View>

                    )}
                    renderHiddenItem={({ item }) => (
                      <View style={styles.rowBack}>

                        <TouchableOpacity
                          style={[styles.backButton, styles.tarjetaButton]}
                          onPress={() => {
                            creaTarjeta(item);
                          }}
                        >
                          <Text style={styles.textoAccion}>Crear</Text>
                          <Text style={styles.textoAccion}>tarjeta</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.backButton, styles.editButton]}
                          onPress={() => {
                            console.log('Editar');
                          }}
                        >
                          <Text style={styles.textoAccion}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.backButton, styles.deleteButton]}
                          onPress={() => {
                            eliminarItem(item._id);
                          }}
                        >
                          <Text style={styles.textoAccion}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    rightOpenValue={-240}
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
              setVisita={setVisita}
              foto={foto}
              setFoto={setFoto}
              addCliente={addCliente}
              cancelar={reload}
            />
          }
        </View>
      </ScrollView>
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