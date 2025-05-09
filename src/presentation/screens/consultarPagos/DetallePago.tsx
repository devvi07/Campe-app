import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Button, Card, Modal } from 'react-native-paper';
import { Header } from '../../components/Header';
import { formatDate, formatDateDDMMMYYY, formatMiles, getCurrentDateDDMMYYYY } from '../utils/Utils';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export const DetallePago = ({ route, navigation }: any) => {

    const { width, height } = useWindowDimensions();
    const { pagos, idCobrador, cobrador } = route.params;
    const [ loading, setLoading ] = useState(false);
    const [ showCalendar, setShowCalendar ] = useState(false);
    const [ pagosCobrador, setPagosCobrador ] = useState([]);
    const [ total, setTotal ] = useState(0);
    const [ comision, setComision ] = useState(0);
    const [ fechaConsulta, setFechaConsulta ] = useState('');

    const getPagosByCobrador = (fecha: string) => {

        setLoading(false);
        const pagosCobrador = pagos.filter((item: any) => item.usuario._id == idCobrador);
        const pagosToday = pagosCobrador.filter((item: any) => formatDateDDMMMYYY(item.fecha) == fecha);

        if(pagosToday){
            if (pagosToday.length > 0) {
                let total = 0;
                for (const pago of pagosToday) {
                    total += pago.monto;
                }
                const comision = (total * 0.05);
                setComision(comision);
                setTotal(total);
            }
        }
        
        setPagosCobrador(pagosToday);
        setLoading(true);
    };

    useEffect(()=>{
        const today = getCurrentDateDDMMYYYY();
        setFechaConsulta(today);
        getPagosByCobrador(today);
    },[]);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header title={`Cobros realizados por: ${cobrador}`} color={'#CFD8DC'} textColor={'#000'} textSize={16} />
            <Header title={`Fecha de consulta: ${fechaConsulta}`} color={'#f0cdd1'} textColor={'#000'} textSize={16}/>
            {
                loading ? <>
                    {
                        pagosCobrador.length > 0 ?
                        <ScrollView>
                            {
                                pagosCobrador.map((pago: any) =>(
                                    <>
                                    
                                      <Card key={ pago._id } style={{ borderRadius: 4, backgroundColor: '#FFF' }}>
                                        <Card.Content>
                                          
                                          <View style={{ marginHorizontal: width *0.05}}>
                
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                              <Text style={ styles.label }>{`Fecha de pago:`}</Text>
                                              <Text style={ styles.value }>{`${formatDate(pago.fecha)}`}</Text>
                                            </View>
                
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                              <Text style={ styles.label }>{`Monto:`}</Text>
                                              <Text style={ styles.value }>{`${formatMiles(pago.monto, true)}`}</Text>
                                            </View>
                
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                              <Text style={ styles.label }>{`Metódo de pago:`}</Text>
                                              <Text style={ styles.value }>{`${pago.metodo}`}</Text>
                                            </View>
                
                                          </View>
        
                                        </Card.Content>
                                      </Card>
                
                                    </>
                                ))
                            }

                            <View style={{ marginBottom: 50 }}>
                            <View style={{ marginTop: 5 }}>
                                <View style={{ backgroundColor: '#5a121c', height: 35, justifyContent: 'center' }}>
                                    <Text style={{ color: '#FFF', fontWeight: '900', textAlign: 'center', fontSize: 17 }}>
                                        {`Total cobrado`}
                                    </Text>
                                </View>
                            </View>

                            <Card style={{ borderRadius: 4, backgroundColor: '#FFF' }}>
                                <Card.Content>

                                    <View style={{ marginHorizontal: width * 0.2 }}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.label}>{`Total:`}</Text>
                                            <Text style={styles.value}>{`${formatMiles(total.toString(), true)}`}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.label}>{`Comisión:`}</Text>
                                            <Text style={styles.value}>{`${formatMiles(comision.toString(), true)}`}</Text>
                                        </View>

                                    </View>

                                </Card.Content>
                            </Card>
                            </View>

                        </ScrollView> 
                        :<>
                        <View style={{ marginTop: 150 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>No se encontraron registros.</Text>
                        </View>
                        
                        <View style={{ bottom: 0, position: 'absolute',  width: '100%' }}> 
                            <View style={{ }}>
                                <Button
                                    icon={'calendar-month'}
                                    buttonColor={'#e4aab2'}
                                    textColor={'#000'}
                                    style={{ borderRadius: 0, padding: 5 }}
                                    onPress={()=>{    
                                        setShowCalendar(true);
                                    }}
                                >
                                    <Text style={{ fontSize: 16 }}>Consultar cobros por fecha</Text>
                                </Button>
                            </View>
                        </View>
                        </>

                    }
                </> : <View style={{ marginTop: 200 }}>
                    <ActivityIndicator animating={true} color={'#871a29'} size={50} />
                </View>
            }

            {
                pagosCobrador.length>0 &&
                <View style={{ bottom: 0, position: 'absolute',  width: '100%' }}> 
                    <View style={{ }}>
                        <Button
                            icon={'calendar-month'}
                            buttonColor={'#e4aab2'}
                            textColor={'#000'}
                            style={{ borderRadius: 0, padding: 5 }}
                            onPress={()=>{    
                                setShowCalendar(true);
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>Consultar cobros por fecha</Text>
                        </Button>
                    </View>
                </View>
            }
            <Modal
                visible={showCalendar}
                //onDismiss={hideModal} 
                contentContainerStyle={{
                    marginHorizontal: 10,
                    marginTop: -(height*0.1),
                }}
            >
                <View>
                    <Calendar
                        onDayPress={day => {
                            console.log('selected day', day);
                            console.log('getCurrentDateDDMMYYYY', getCurrentDateDDMMYYYY());
                            console.log('day.month', day.month);
                            const dia = day.day<10 ? `0${day.day}`: day.day;
                            const month = day.month<10 ? `0${day.month}`: day.month;
                            const fecha = `${dia}/${month}/${day.year}`;
                            console.log('fecha: '+fecha);
                            setFechaConsulta(fecha);
                            setShowCalendar(false);
                            getPagosByCobrador(fecha);
                        }}
                    />
                </View>
            </Modal>
        </View>
    )
};

const styles = StyleSheet.create({
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
});