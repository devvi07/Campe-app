import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Avatar, Card, IconButton } from 'react-native-paper';
import { Header } from '../../components/Header';

export const RutasScreen = ({ route, navigation }: any) => {

  const [ loading, setLoading ] = useState(true);

  const RUTAS = [
    {
      "_id": "6813e2aaeb726df6df605119",
      "nombre": "Ruta 1",
      "dia": "Lunes",
      "__v": 0
    },
    {
      "_id": "6813e2b6eb726df6df60511b",
      "nombre": "Ruta 2",
      "dia": "Martes",
      "__v": 0
    },
    {
      "_id": "6813e2c4eb726df6df60511d",
      "nombre": "Ruta 3",
      "dia": "Miércoles",
      "__v": 0
    },
    {
      "_id": "6813e2ddeb726df6df60511f",
      "nombre": "Ruta 4",
      "dia": "Jueves",
      "__v": 0
    },
    {
      "_id": "6813e2e8eb726df6df605121",
      "nombre": "Ruta 5",
      "dia": "Viernes",
      "__v": 0
    },
    {
      "_id": "6813e2f5eb726df6df605123",
      "nombre": "Ruta 6",
      "dia": "Sábado",
      "__v": 0
    },
    {
      "_id": "6813e2ffeb726df6df605125",
      "nombre": "Ruta 7",
      "dia": "Domingo",
      "__v": 0
    }
  ];

  const Item = ({ item, index }: { item: any; index: number }) =>(
      <TouchableOpacity
        onPress={()=>{
          console.log('Ruta seleccionada -> ',item.dia);
          navigation.navigate('RegistrarPagosScreen',{ dia:  item.dia, recargar: true})
        }}
      >
        <Card.Title
          title={`${item.nombre}`}
          titleStyle={{ color: '#000', fontWeight: '700', textAlign: 'center' }}
          subtitle={`${item.dia}`}
          subtitleStyle={{ color: '#000', fontWeight: '700', textAlign: 'center' }}
          left={(props) => <Avatar.Icon {...props} icon="source-branch" size={60} color='#FFF' style={{ backgroundColor: '#5a121c'}} />}
          //right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
          style={{ 
            borderColor: '#DEDEDE', 
            borderWidth: 1.3, 
            marginHorizontal: 20, 
            marginTop: 5, 
            marginBottom: 5, 
            borderRadius: 7,
            padding: 20
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
          RUTAS.length>0 ?
          <FlatList
            data={RUTAS}
            renderItem={({ item, index }) => <Item item={item} index={index} />}
            keyExtractor={(item: any) => item._id}
          />
          :
          <View style={{ marginTop: 150 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>No se encontraron registros</Text>
          </View>
          
        }
        </>:<View style={{ marginTop: 150 }}>
          <ActivityIndicator animating={true} color={'#871a29'} size={50} />
        </View>
      }
    </View>
  )
}
