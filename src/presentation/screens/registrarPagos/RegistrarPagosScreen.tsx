import React, { useEffect, useState } from 'react'
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { ActivityIndicator, Button, Card, TextInput } from 'react-native-paper';
import { useUsuariosService } from '../../../hooks/usuarios/useUsuariosService';
import { formatMiles, getInfoNetWork } from '../utils/Utils';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

import Geolocation from 'react-native-geolocation-service';

export const RegistrarPagosScreen = ({ route, navigation }: any) => {

  const { municipio } = route.params;
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const [ oCliente, setOcliente ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ montos, setMontos ] = useState<any>([]);
  const { getClientes } = useUsuariosService({});
  const [itemActivo, setItemActivo] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  const toggleTarjeta = (index: number) => setItemActivo(prev => (prev === index ? null : index));

  const setClientes = async () => {
    
    setLoading(false);
    const oCliente = await getClientes();
    
    if(oCliente){
      if(oCliente.length>0){

        const clienteRuta = oCliente.filter((item: any)=> item.municipio === municipio);
        console.log("🚀 ~ setClientes ~ clienteRuta:", clienteRuta)

        let totalAbonado = 0;
        let saldoTotal = 0;
        let abono = 0;
        let cliente = '';
        const oMontos = [];
  
        for(const tarjeta of clienteRuta){
          
          cliente = tarjeta._id;

          if(tarjeta.facturas.length>0){
            
            for(const oPago of tarjeta.facturas){
              
              saldoTotal+=oPago.total;
              abono+=oPago.abono;

              if(oPago.pagos.length>0){
                for(const total of oPago.pagos){
                  totalAbonado+= total.monto;
                }
              }
            }
  
            oMontos.push({
              'cliente':cliente,
              'totalAbonado':totalAbonado,
              'saldoTotal':saldoTotal,
              'abono':abono,
              'resta':Number((saldoTotal-totalAbonado))
            });
  
            totalAbonado = 0;
            saldoTotal = 0;
            abono = 0;
  
          }
        }

        setOcliente(clienteRuta);
        setMontos(oMontos);
  
      }
      
    }
    setLoading(true);
  };

  useEffect(()=>{

    navigation.setOptions({ title: `Clientes ruta ${municipio}` });
    setClientes();
  
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();

  },[route]);

  const goToCliente = (item: any, tel: string, id: string) => {
    navigation.navigate('ClienteScreen',{item: item, telCliente:tel, idCliente:id});
  }

  const Item = ({ item, index }: { item: any; index: number }): React.ReactElement => (

    <Card 
      style={[
        styles.card,
        { 
          backgroundColor: item.facturas.length == 0 ? "#F7F7F7" : "#FFF", 
          borderRadius: 0
        }
      ]}
    >

      <Card.Content>

        {
          item.facturas.length == 0 && 
            <Text style={{ textAlign: 'center', fontWeight: '800', fontSize: 16 }}>
              {'CLIENTE SIN TARJETA\n'}
            </Text>
          }

        <View style={{ backgroundColor: item.facturas.length == 0 ? "#F7F7F7" : "#FFF", flexDirection: 'row' }}>

          <View style={{ right: 15, top: 6 }}>
            <TouchableOpacity 
              onPress={()=>{
                navigation.navigate('ImagenClienteScreen',{ imagen: item.foto });
              }}
            >
              <Image
                source={{ uri: `data:image/png;base64,${item.foto}` }}
                style={{ width: 90, height: 90, borderRadius: 5 }}
              />
            </TouchableOpacity>
          </View>

          <View style={{  }}>
              
            <View style={{ flexDirection: 'row' }}>
              <Text style={[ styles.label, { width: width*0.23 } ]}>Cliente: </Text>
              <Text style={ styles.value }>{`${item.nombre} ${item.apellidoP} ${item.apellidoM}`}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={[ styles.label, { width: width*0.23 } ]}>Saldo total:</Text>
              <Text style={ styles.value }>{
                item.facturas.length>0 ?
                <>
                {formatMiles(montos.filter((value: any) => value.cliente === item._id)[0].saldoTotal,true )}
                </>:<>{formatMiles('0', true)}</>
              }</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={[ styles.label, { width: width*0.23 } ]}>Abono:</Text>
              <Text style={ styles.value }>{
              
              item.facturas.length>0 ?
              <>
              {formatMiles(montos.filter((value: any) => value.cliente === item._id)[0].abono,true )}
              </>:
              <>
                {formatMiles('0', true)}
              </>

              }</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={ [ styles.label, { width: width*0.23 } ]}>Abono total:</Text>
              <Text style={ styles.value }>{
              
              item.facturas.length>0 ?
              <>
              {formatMiles(montos.filter((value: any) => value.cliente === item._id)[0].totalAbonado,true )}
              </>:
              <>
                {formatMiles('0', true)}
              </>

            }</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={ [ styles.label, { width: width*0.23 } ] }>Resta:</Text>
              <Text style={ styles.value }>{
              
              item.facturas.length>0 ?
              <>
              {formatMiles(montos.filter((value: any) => value.cliente === item._id)[0].resta,true )}
              </>:
              <>
                {formatMiles('0', true)}
              </>

              }</Text>
            </View>

          </View>

        </View>

        {
            item.facturas.length>0 &&
            <View style={{ left: width*0.85, top: -60 }}>
              <TextInput.Icon
                icon={ itemActivo === index ?'chevron-up-circle' : 'chevron-right-circle'  }
                size={27}
                color={itemActivo === index ? '#871a29' :'#CFD8DC'}
                onPress={() => {
                  toggleTarjeta(index);
                }}
              />
            </View>
        }

        {
          (itemActivo === index) &&
          <View style={{ paddingTop: 10 }}>
            <View style={{ flex: 1, backgroundColor: '#871a291A', padding: 10, borderRadius: 5 }}>
              <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 16 }}>
                {`Tarjeta(s) de ${item.nombre}`}
              </Text>

              <View style={{ marginHorizontal: 20 }}>
              {
                item.facturas.map((val:any) =>(
                  <>
                    <View style={{ marginBottom: 15, marginTop: 15 }}>
                      <Button
                        icon="card-account-details"
                        mode="contained"
                        style={{ borderRadius: 5 }}
                        buttonColor={'#adbc5b'}
                        textColor='#FFF'
                        onPress={() => {
                          goToCliente(val, item.tel, item._id);
                        }}
                      >
                        {`Ver tarjeta de articulo: ${val.articulo}`}
                      </Button>
                    </View>
                  </>
                ))
                
              }

              <Button 
                icon="briefcase-eye" 
                mode="contained" 
                style={{ borderRadius: 5 }}
                buttonColor={'#986400'}
                textColor='#FFF'
                onPress={() => {
                  navigation.navigate('HistorialPagosScreen', { oFactura: item.facturas, item: item });
                }}
              >
                Ver historial de pagos
              </Button>

              </View>

            </View>
          </View>
        }

      </Card.Content>

    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      {
        loading ?
          <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            {
              oCliente.length>0 ?
                <FlatList
                  data={oCliente}
                  renderItem={({ item, index }) => <Item item={item} index={index} />}
                  keyExtractor={(item: any) => item._id}
                />:
                <View style={{ marginTop: 150 }}>
                  <Text style={{ textAlign: 'center', color: '#4B4B4B', fontWeight: '800', fontSize: 16 }}>No existen registros.</Text>
                </View>
            }
          </View>
          :<View style={{ marginTop: 150 }}>
            <ActivityIndicator animating={true} color={'#871a29'} size={50} />
          </View>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    color: "#333",
    //width: 90,
  },
  value: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#4B4B4B",
  },
  card: {
    //marginBottom: 5,
  },
});