import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { ActivityIndicator, Appbar, Button, Card, TextInput } from 'react-native-paper';
import { useUsuariosService } from '../../../hooks/usuarios/useUsuariosService';
import { formatDateDDMMMYYY, formatMiles, getCurrentDateDDMMYYYY, getInfoNetWork } from '../utils/Utils';
import { CommonActions, useFocusEffect, useIsFocused, useRoute } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Geolocation from 'react-native-geolocation-service';
import { CAMPE_CONTS } from '../utils/Constantes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useClientesLocal } from '../../../hooks/database/clientes/useClientesLocal';
import { useQuery } from '@realm/react';
import { FacturasModel } from '../../../core/models/FacturasModel';
import { PagosModel } from '../../../core/models/PagosModel';
import { ClientesModel } from '../../../core/models/ClientesModel';

export const RegistrarPagosScreen = ({ route, navigation }: any) => {

  const { dia } = route.params;
  const routeHook = useRoute();
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const [ oCliente, setOcliente ] = useState<any>([]);
  const [ oClienteAux, setOclienteAux ] = useState<any>([]);
  const [ loading, setLoading ] = useState(false);
  const [ montos, setMontos ] = useState<any>([]);
  const [itemActivo, setItemActivo] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  //const { clientesByRuta } = useClientesLocal({ ruta: dia });
  const FACTURAS_LOCAL = useQuery(FacturasModel);
  const PAGOS_LOCAL = useQuery(PagosModel);
  const clientes = useQuery(ClientesModel);


  const toggleTarjeta = (index: number) => setItemActivo(prev => (prev === index ? null : index));

  const [modoBusqueda, setModoBusqueda] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const _handleSearch = () => setModoBusqueda(true);

  const _handleCloseSearch = () => {
    setModoBusqueda(false);
    setTextoBusqueda('');
    setOcliente(oClienteAux); // Limpia el filtro al cerrar
  };

  const _onChangeText = (text: string) => {
    setTextoBusqueda(text);
    onSearchCte(text); // Notifica búsqueda al padre
  };

  const onSearchCte = (text: string) => {
    if(text.length>0){
      const result = oClienteAux.filter((item:any) => (
        item.nombre.toLowerCase().includes(text.toLowerCase()) || 
        item.apellidoP.toLowerCase().includes(text.toLowerCase()) || 
        item.apellidoM.toLowerCase().includes(text.toLowerCase())
      ));
      console.log("🚀 ~ onSearchCte ~ result:", result)
      setOcliente(result);
    }else{
      setOcliente(oClienteAux);
    }
  }; 

  const ordenarClientes = (clientes: any[]): any[] => {
    const fechaHoy = getCurrentDateDDMMYYYY();
  
    return clientes.sort((a, b) => {
      const facturaA = a.facturas[0];
      const facturaB = b.facturas[0];
  
      const fechaA = a.facturas.length > 0 ? formatDateDDMMMYYY(facturaA.updatedAt) : '';
      const fechaB = b.facturas.length > 0 ? formatDateDDMMMYYY(facturaB.updatedAt) : '';
  
      const statusA = facturaA?.status || '';
      const statusB = facturaB?.status || '';
  
      // 1. Si alguno es "Pagado", se va al final siempre
      if (statusA === 'Pagado' && statusB !== 'Pagado') return 1;
      if (statusB === 'Pagado' && statusA !== 'Pagado') return -1;
  
      // 2. Si alguno es 'abono' con fecha de hoy, se va después
      const esHoyAbonoA = fechaA === fechaHoy && statusA === 'abono';
      const esHoyAbonoB = fechaB === fechaHoy && statusB === 'abono';
  
      if (esHoyAbonoA && !esHoyAbonoB) return 1;
      if (!esHoyAbonoA && esHoyAbonoB) return -1;
  
      // 3. Ordenar el resto por prioridad de status
      const statusPriority = (status: string): number => {
        switch (status) {
          case 'abono': return 1;
          case '': return 2;
          case 'Sin abono': return 99; // va al final, pero antes que 'Pagado'
          default: return 3;
        }
      };
  
      return statusPriority(statusA) - statusPriority(statusB);
    });
  };

  const getClientes = async () => {
    try {
      const userId = await AsyncStorage.getItem('@KeyUserId');
      const URI = `https://campews.onrender.com/api/usuario/byCobrador?ruta=${dia}&cobrador=${userId}`; //idDeCobrador
      console.log("🚀 ~ getClientes ~ URI:", URI);
      const response = await fetch(URI, {
        method: 'GET',
        headers: {
          contentType: "application/json; charset=ISO-8859-1",
        }
      })

      const data = await response.json();
      return data;

    } catch (e) {
        return [];
    }
  }
  
  const setClientes = async () => {
    
    setOcliente([]);
    setOclienteAux([]);
    setMontos([]);
    setLoading(false);

    const oClientesByRuta = () => {
      if (!clientes || !dia) return [];
  
      const filtrados = clientes.filtered('ruta == $0', dia);
      return Array.from(filtrados);
    };

    const facturasByCliente = (cliente: string) => {
      const filtrados = FACTURAS_LOCAL.filtered('cliente == $0', cliente);
      return Array.from(filtrados);
    }

    const pagosByClienteFactura = (factura: string) => {
      console.log('FILTRAR POR FACTURA -> ',factura);
      const filtrados = PAGOS_LOCAL.filtered('factura == $0', factura);
      return Array.from(filtrados); 
    }
    
    const clientesByRuta = oClientesByRuta();

    console.log('ESTOS SON LOS CLIENTES POR RUTA -> ',clientesByRuta);
    
    if(clientesByRuta){
      if(clientesByRuta.length>0){

        let totalAbonado = 0;
        let saldoTotal = 0;
        let abono = 0;
        let cliente = '';
        const oMontos = [];

        const oFactura: any[] = [];
        for(const cliente of clientesByRuta){
          const facturas = facturasByCliente(cliente._id);
          console.log("🚀 ~ setClientes ~ facturas:", facturas)
          for(const tarjeta of facturas)
            oFactura.push(tarjeta);
        }

        console.log("🚀 ~ setClientes ~ FACTURAS:", oFactura);
        
        const oPagos: any[] = [];
        for(const factura of oFactura){
          const pagos = pagosByClienteFactura(factura._id);
          for(const abono of pagos)
            oPagos.push(abono);
        }
        console.log("🚀 ~ setClientes ~ FACTURAS:", oPagos);
        //
        const oCliente = clientesByRuta.map(cliente => {
          const facturasCliente = oFactura
            .filter(factura => factura.cliente === cliente._id)
            .map(factura => {
              const pagosFactura = oPagos.filter(p => p.factura === factura._id);
              return {
                articulo: factura.articulo,
                cantidad: factura.cantidad,
                total: factura.total,
                abono: factura.abono,
                resta: factura.resta,
                status: factura.status,
                createdAt: factura.createdAt,
                updatedAt: factura.updatedAt,
                _id: factura._id,
                pagos: pagosFactura
              };
            });
        
          return {
            _id: cliente._id,
            nombre: cliente.nombre,
            apellidoP: cliente.apellidoP,
            apellidoM: cliente.apellidoM,
            direccion: cliente.direccion,
            municipio: cliente.municipio,
            tel: cliente.tel,
            latitud: cliente.latitud,
            longitud: cliente.longitud,
            cobrador: cliente.cobrador,
            ruta: cliente.ruta,
            foto: cliente.foto,
            facturas: facturasCliente
          };
        });
        
        console.log('OBJETO ARMADO -> ',oCliente);

        for(const tarjeta of oCliente){
          
          cliente = tarjeta._id;

          if(tarjeta.facturas.length>0){
            
            for(const oPago of tarjeta.facturas){
              console.log("🚀 ~ setClientes ~ oPago:", oPago)
              
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

        console.log('oMontos --->>> ',oMontos);
        const oClientesSort = ordenarClientes(oCliente);
        console.log("🚀 ~ setClientes ~ oClientesSort:", oClientesSort)
    
        setOcliente(oClientesSort);
        setOclienteAux(oClientesSort);
        setMontos(oMontos);

      }
    }

    setLoading(true);
  };

  /*const setClientes = async () => {
    
    setLoading(false);
    const oCliente = await getClientes();
    
    if(oCliente){
      if(oCliente.length>0){

        let totalAbonado = 0;
        let saldoTotal = 0;
        let abono = 0;
        let cliente = '';
        const oMontos = [];
  
        for(const tarjeta of oCliente){
          
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

        const oClientesSort = ordenarClientes(oCliente);
        console.log("🚀 ~ setClientes ~ oClientesSort:", oClientesSort)
    
        setOcliente(oClientesSort);
        setOclienteAux(oClientesSort);
        setMontos(oMontos);
  
      }
      
    }
    setLoading(true);
  };*/

  useEffect(()=>{

    navigation.setOptions({ title: `Clientes ruta ${dia}` });
    setClientes();
  
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();

  },[isFocused]);

  const goToCliente = (item: any, tel: string, id: string) => {
    navigation.navigate('ClienteScreen',{item: item, telCliente:tel, idCliente:id, dia: dia});
  }

  //const Item = ({ item, index, drag }: { item: any; index: number, drag: any }): React.ReactElement => (
  {/*<TouchableOpacity onLongPress={drag}> */}
  const Item = ({ item, index /*drag*/ }: { item: any; index: number/*, drag: any*/ }): React.ReactElement => (

    <Card 
      style={[
        styles.card,
        { 
          backgroundColor: item.facturas.length == 0 
            ? "#F7F7F7" : (item.facturas[0].status == "abono" && formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) ? '#bfd7ed' :
            (item.facturas[0].status == "Sin abono" &&formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) ? '#fffba4' :
            item.facturas[0].status == "Pagado" ? '#ebfbd8' : '#FFF',  
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

        {
          (item.facturas[0].status == "abono" && formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) && 
            <Text style={{ textAlign: 'center', fontWeight: '800', fontSize: 16 }}>
              {'Abono puntual\n'}
            </Text>
        }

        {
          (item.facturas[0].status == "Pagado") && 
            <Text style={{ textAlign: 'center', fontWeight: '800', fontSize: 16 }}>
              {'Articulo pagado\n'}
            </Text>
        }

        {
          (item.facturas[0].status == "Sin abono" &&formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) && 
            <Text style={{ textAlign: 'center', fontWeight: '800', fontSize: 16 }}>
              {'Visita sin abono\n'}
            </Text>
        }

        <View 
          style={{ 
            backgroundColor: item.facturas.length == 0 
            ? "#F7F7F7" : (item.facturas[0].status == "abono" && formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) ? '#bfd7ed' :
            (item.facturas[0].status == "Sin abono" &&formatDateDDMMMYYY(item.facturas[0].updatedAt) == getCurrentDateDDMMYYYY()) ? '#fffba4' :
            item.facturas[0].status == "Pagado" ? '#ebfbd8' : '#FFF', 
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
                  source={{ uri: `${item.foto}` }}
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
            <View style={{ left: width*0.85, top: -60 }} >
              <TextInput.Icon
                icon={ itemActivo === index ?'chevron-up-circle' : 'chevron-right-circle'  }
                size={27}
                color={itemActivo === index ? '#5a121c' :'#707070'}
                onPress={() => {
                  toggleTarjeta(index);
                }}
              />
            </View>
        }

        {
          (itemActivo === index) &&
          <View style={{ paddingTop: 10 }} >
            <View style={{ flex: 1, backgroundColor: '#871a291A', padding: 10, borderRadius: 5 }}>
              <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 16 }}>
                {`Tarjeta(s) de ${item.nombre} \n`}
              </Text>

              <View style={{ marginHorizontal: 20 }}>
              {
                item.facturas.map((val:any, index: number) =>(
                  
                  <View style={{ marginBottom: 10 }} key={index.toString()}>
                    <Button
                      icon="card-account-details"
                      mode="contained"
                      style={{ borderRadius: 5 }}
                      buttonColor={'#5a121c'}
                      textColor='#FFF'
                      onPress={() => {
                        setItemActivo(null);
                        goToCliente(val, item.tel, item._id);
                      }}
                    >
                      {`Ver tarjeta de articulo: ${val.articulo}`}
                    </Button>
                  </View>
                  
                ))
                
              }

              <Button 
                icon="briefcase-eye" 
                mode="contained" 
                style={{ borderRadius: 5 }}
                buttonColor={'#DEDEDE'}
                textColor='#000'
                onPress={() => {
                  setItemActivo(null);
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

            <TouchableOpacity onPress={()=>{ navigation.navigate('AddClienteScreen', { ruta: dia }) }}>

              <View style={{ backgroundColor: '#DEDEDE', height: 50, flexDirection: 'row', justifyContent: 'center' }}>

                <View style={{ justifyContent: 'center' }}>
                  <TextInput.Icon
                    icon={'account-plus'}
                    size={40}
                    color={'#5a121c'}
                    onPress={()=>{
                      navigation.navigate('AddClienteScreen', { ruta: dia })
                    }}
                  />
                </View>

                <View style={{ justifyContent: 'center', paddingLeft: width * 0.14 }}>
                  <Text style={{ color: '#5a121c', fontSize: 15, fontWeight: '900' }}>Agregar</Text>
                </View>

              </View>

            </TouchableOpacity>

            {
              oClienteAux.length>0 ?
              <>
                <Appbar.Header style={{ backgroundColor: '#fbeff0', height: 50 }}>
                {modoBusqueda ? (
                <>
                <Appbar.Action icon="close" color='#5a121c' onPress={_handleCloseSearch} />
                <TextInput
                  placeholder="Buscar cliente"
                  placeholderTextColor={"#5a121c"}
                  value={textoBusqueda}
                  onChangeText={_onChangeText}
                  style={{ flex: 1, backgroundColor: 'transparent' }}
                  underlineColor="transparent"
                  activeUnderlineColor="#5a121c"
                  autoFocus
                  textColor='#000'
                  onSubmitEditing={()=>{
                    console.log('activo la busqueda');
                  }}
                />
              </>
              ) : (
              <>
              <Appbar.Content 
                title="            Buscar cliente"
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
                
                {/*<FlatList
                  data={oCliente}
                  renderItem={({ item, index }) => <Item item={item} index={index} />}
                  keyExtractor={(item: any) => item._id}
                />*/}

                <SwipeListView
                  data={oCliente}
                  renderItem={({ item, index }) => <View style={{ width: '100%' }}><Item item={item} index={index} /></View>}
                  keyExtractor={(item: any) => item._id}
                  renderHiddenItem={({ item }, rowMap) => (
                    <View style={[ styles.rowBack, { height: '100%' } ]}>
                  
                      <TouchableOpacity
                        style={[styles.backButton, styles.tarjetaButton]}
                        onPress={() => {

                          console.log('rowMap keys:', Object.keys(rowMap));
                          
                          console.log('item._id:', item._id);

                          console.log('item: ', item);

                          if (rowMap && rowMap[item._id]) {
                            rowMap[item._id].closeRow();
                          }

                          navigation.navigate('CrearTarjetaScreen', { oCliente: item });
                        }}
                      >
                        <Text style={styles.textoAccion}>Crear</Text>
                        <Text style={styles.textoAccion}>tarjeta</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  rightOpenValue={-80}
                  disableRightSwipe
                  //closeOnRowOpen={false}
                />

              </>
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
          :<View style={{ marginTop: 200 }}>
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
  rowBack: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: '#CCC',
    backgroundColor: '#FFF',
    paddingRight: 0,
    width: '100%'
  },
  backButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarjetaButton: {
    backgroundColor: '#4CAF50',
  },
  textoAccion: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});