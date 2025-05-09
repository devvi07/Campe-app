import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { ActivityIndicator, Avatar, Button, Card } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

export const ConsultarPagosScreen = ({ navigation }: any) => {

    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [pagos, setPagos] = useState([]);
    const [cobradores, setCobradores] = useState<any>([]);

    const getPagos = async () => {
        try {
            setLoading(false);
            const URI = `https://campews.onrender.com/api/pagos/`;
            const response = await fetch(URI, {
                method: 'GET',
                headers: {
                    contentType: "application/json; charset=ISO-8859-1",
                }
            })

            const data = await response.json();
            console.log("🚀 ~ getPagos ~ data:", data)
            setPagos(data);
            addCobradores(data);

        } catch (e) {
            setPagos([]);
            setLoading(true);
        }
    }

    const addCobradores = (data: any) => {
        
        const oCobradores = [];
        if(data){
            if(data.length>0){
                for(const cobrador of data){
                    oCobradores.push(cobrador.usuario);
                }

                const uniqueData = Array.from(
                    new Map(oCobradores.map(item => [item._id, item])).values()
                );

                setCobradores(uniqueData);
                console.log('uniqueData -> ',uniqueData);
            }
        }
        setLoading(true); 

    }

    useEffect(()=>{
        getPagos();
    },[isFocused]);

    const Item = ({ item, index }: { item: any; index: number }) => (
        <TouchableOpacity
            onPress={() => {
                //console.log('Ruta seleccionada -> ', item.municipio);
                const cobrador = `${item.nombre} ${item.apellidoP} ${item.apellidoM}`
                navigation.navigate('DetallePago', { 
                    pagos: pagos, 
                    idCobrador: item._id, 
                    cobrador: cobrador 
                });
            }}
        >
            <Card.Title
                title={`${item.nombre}`}
                titleStyle={{ color: '#000', fontWeight: '700', textAlign: 'center' }}
                subtitle={`${item.apellidoP} ${item.apellidoM}`}
                subtitleStyle={{ color: '#000', fontWeight: '700', textAlign: 'center' }}
                left={(props) => <Avatar.Icon {...props} icon="account-tie" size={66} color='#FFF' style={{ backgroundColor: '#5a121c' }} />}
                //right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
                style={{
                    borderColor: '#DEDEDE',
                    borderWidth: 1.3,
                    marginHorizontal: 20,
                    marginTop: 10,
                    borderRadius: 7,
                    padding: 40
                }}
            />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header title={'Consulta de cobros'} />
            {
                loading ? <>
                    {
                        cobradores.length > 0 ?
                        <FlatList
                            data={cobradores}
                            renderItem={({ item, index }) => <Item item={item} index={index} />}
                            keyExtractor={(item: any) => item._id}
                        />
                        :
                        <View style={{ marginTop: 150 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>No se encontraron registros</Text>
                        </View>

                    }
                </> : <View style={{ marginTop: 200 }}>
                    <ActivityIndicator animating={true} color={'#871a29'} size={50} />
                </View>
            }
        </View>
    )
}
