

import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { Avatar, Card } from 'react-native-paper';
import { CAMPE_CONTS } from '../utils/Constantes';

export const RegistroUsuarios = ({ route, navigation }: any) => {

    const data = [{
        "id": "67f964ba14b19d709df579aa",
        "modulo":"Cobradores"
    },{
        "id": "67f964ce14b19d709df579ac",
        "modulo":"Clientes"
    },{
        "id": "680e3234676ab1f4717e3ee5",
        "modulo":"Administradores"
    },{
        "id": "67f9649a14b19d709df579a8",
        "modulo":"Directores"
    }];

    const Item = ({ item, index }: { item: any; index: number }) => (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('AdmonClientesScreen',{tipoUsuario: item.id});
            }}
        >
            <Card.Title
                title={`${item.modulo}`}
                titleStyle={{ color: '#000', fontWeight: '700', textAlign: 'center' }}
                //subtitle={`${item.municipio}`}
                subtitleStyle={{ color: '#000', fontWeight: '700', textAlign: 'center' }}
                left={(props) => <Avatar.Icon {...props} icon="account" size={60} color='#FFF' style={{ backgroundColor: '#5a121c' }} />}
                style={{
                    borderColor: '#DEDEDE',
                    borderWidth: 1.3,
                    marginHorizontal: 20,
                    marginTop: 15,
                    //marginBottom: 5,
                    borderRadius: 7,
                    padding: 20
                }}
                key={item.id}
            />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header title={ 'Registro de usuarios' } />
            <FlatList
                data={data}
                renderItem={({ item, index }) => <Item item={item} index={index} />}
                keyExtractor={(item: any) => item.id}
            />
        </View>
    )
};