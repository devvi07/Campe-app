import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { ActivityIndicator, Button, Card, TextInput } from 'react-native-paper';
import { useUsuariosService } from '../../../hooks/usuarios/useUsuariosService';
import { formatDateDDMMMYYY, formatMiles, getCurrentDateDDMMYYYY, getInfoNetWork } from '../utils/Utils';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import DraggableFlatList from 'react-native-draggable-flatlist';

import Geolocation from 'react-native-geolocation-service';

export const RegistrarPagosScreen = ({ route, navigation }: any) => {

  const { municipio } = route.params;
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const [ oCliente, setOcliente ] = useState<any>([]);
  const [ loading, setLoading ] = useState(false);
  const [ montos, setMontos ] = useState<any>([]);
  const { getClientes } = useUsuariosService({});
  const [itemActivo, setItemActivo] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  const toggleTarjeta = (index: number) => setItemActivo(prev => (prev === index ? null : index));

  const ordenarClientes = (clientes: any[]): any[] => {
    const fechaHoy = getCurrentDateDDMMYYYY();
  
    return clientes.sort((a, b) => {
      const facturaA = a.facturas[0];
      const facturaB = b.facturas[0];
  
      const fechaA = a.facturas.length > 0 ? formatDateDDMMMYYY(facturaA.updatedAt) : '';
      const fechaB = b.facturas.length > 0 ? formatDateDDMMMYYY(facturaB.updatedAt) : '';
  
      const statusA = facturaA?.status || '';
      const statusB = facturaB?.status || '';
  
      // 1. Si alguno es "Pagado", se va al final
      if (statusA === 'Pagado' && statusB !== 'Pagado') return 1;
      if (statusB === 'Pagado' && statusA !== 'Pagado') return -1;
  
      // 2. Si alguno es 'abono' y con fecha de hoy, se va después
      const esHoyAbonoA = fechaA === fechaHoy && statusA === 'abono';
      const esHoyAbonoB = fechaB === fechaHoy && statusB === 'abono';
  
      if (esHoyAbonoA && !esHoyAbonoB) return 1;
      if (!esHoyAbonoA && esHoyAbonoB) return -1;
  
      // 3. Ordenar el resto por prioridad de status
      const statusPriority = (status: string): number => {
        switch (status) {
          case 'Sin abono': return 1;
          case 'abono': return 2;
          default: return 3;
        }
      };
  
      return statusPriority(statusA) - statusPriority(statusB);
    });
  };  
  
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

        const oClientesSort = ordenarClientes(clienteRuta);
        console.log("🚀 ~ setClientes ~ oClientesSort:", oClientesSort)
        //setOcliente(clienteRuta);
        setOcliente(oClientesSort);
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

  },[isFocused]);

  const goToCliente = (item: any, tel: string, id: string) => {
    navigation.navigate('ClienteScreen',{item: item, telCliente:tel, idCliente:id});
  }

  //const Item = ({ item, index, drag }: { item: any; index: number, drag: any }): React.ReactElement => (
  {/*<TouchableOpacity onLongPress={drag}> */}
  const Item = ({ item, index /*drag*/ }: { item: any; index: number/*, drag: any*/ }): React.ReactElement => (

    <Card 
      style={[
        styles.card,
        { 
          backgroundColor: item.facturas.length == 0 
            ? "#F7F7F7" : (item.facturas[0].status == "abono" && formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) ? '#ebfbd8' :
            (item.facturas[0].status == "Sin abono" &&formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) ? '#fffba4' :
            item.facturas[0].status == "Pagado" ? '#1a7f2f' : '#FFF',  
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

        <View 
          style={{ 
            backgroundColor: item.facturas.length == 0 
            ? "#F7F7F7" : (item.facturas[0].status == "abono" && formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) ? '#ebfbd8' :
            (item.facturas[0].status == "Sin abono" &&formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) ? '#fffba4' :
            item.facturas[0].status == "Pagado" ? '#1a7f2f' : '#FFF', 
            flexDirection: 'row' 
          }}
        >

          <View style={{ right: 15, top: 6 }}>
            <TouchableOpacity 
              onPress={()=>{
                if(item.foto !== "")
                  navigation.navigate('ImagenClienteScreen',{ imagen: item.foto });
              }}
            >
              {
                item.foto == "" ?
                <Image
                  source={require('../../../assets/img/user.png')}
                  style={{ width: 90, height: 90, borderRadius: 5 }}
                />:
                <Image
                  source={{ uri: `data:image/png;base64,${item.foto}` }}
                  style={{ width: 90, height: 90, borderRadius: 5 }}
                />
              }
              
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
                />
                /*<DraggableFlatList
                  data={oCliente}
                  onDragEnd={({ data }:any) => setOcliente(data)}
                  keyExtractor={(item: any) => item._id}
                  renderItem={({ item, index, drag }: any) => <Item item={item} index={index} drag={drag}/>}
                />*/
                :
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