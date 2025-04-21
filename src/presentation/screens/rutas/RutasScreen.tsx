import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Avatar, Card, IconButton } from 'react-native-paper';
import { Header } from '../../components/Header';

export const RutasScreen = ({ route, navigation }: any) => {

  const isFocused = useIsFocused();
  const [ loading, setLoading ] = useState(false);
  const [ rutas, setRutas ] = useState([]);

  const getRutas = async () => {
    try {
      setLoading(false);
      //const URI = `https://campews.onrender.com/api/usuario/`;
      const URI = `http://192.168.0.103:3000/api/rutas/`;
      const response = await fetch(URI, {
        method: 'GET',
        headers: {
          contentType: "application/json; charset=ISO-8859-1",
        }
      })

      const data = await response.json();
      setRutas(data);
      setLoading(true);

    } catch (e) {
      setRutas([]);
      setLoading(true);
    }
  }

  useEffect(()=>{
    getRutas();
  },[isFocused]);

  const Item = ({ item, index }: { item: any; index: number }) =>(
      <TouchableOpacity
        onPress={()=>{
          console.log('Ruta seleccionada -> ',item.municipio);
          navigation.navigate('RegistrarPagosScreen',{ municipio:  item.municipio})
        }}
      >
        <Card.Title
          title={`${item.nombre}`}
          titleStyle={{ color: '#000', fontWeight: '700', textAlign: 'center' }}
          subtitle={`${item.municipio}`}
          subtitleStyle={{ color: '#000', fontWeight: '700', textAlign: 'center' }}
          left={(props) => <Avatar.Icon {...props} icon="map-marker-radius" size={60} color='#FFF' style={{ backgroundColor: '#871a29'}} />}
          //right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
          style={{ 
            borderColor: '#DEDEDE', 
            borderWidth: 1.3, 
            marginHorizontal: 20, 
            marginTop: 10, 
            borderRadius: 7,
            padding: 25
          }}
        />
      </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header title={ 'Seleccionar ruta' } />
      {
        loading?<>
        {
          rutas.length>0 ?
          <FlatList
            data={rutas}
            renderItem={({ item, index }) => <Item item={item} index={index} />}
            keyExtractor={(item: any) => item._id}
          />:
          <View><Text>No se encontraron registros</Text></View>
          
        }
        </>:<View style={{ marginTop: 150 }}>
          <ActivityIndicator animating={true} color={'#871a29'} size={50} />
        </View>
      }
    </View>
  )
}
