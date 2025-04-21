import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';

export const HistorialPagosScreen = ({ route, navigation }: any) => {

  const { oFactura } = route.params;

  useEffect(()=>{
    console.log('oFactura -> ',oFactura);
  },[]);

  return (
    <View 
      style={{ 
        flex: 1, 
        backgroundColor: '#FFF', 
        //justifyContent: 'center', 
        alignContent: 'center', 
        alignItems: 'center' 
        }}
      >
      {
        oFactura.map((factura: any) =>(
          <View key={factura._id}>
            <Text>{`Articulo:${factura.articulo}`}</Text>
            <Text>{`Piezas: ${factura.cantidad}`}</Text>
            <Text>{`Precio: ${factura.total}`}</Text>

            <Text>{`\n\nPagos realizados\n`}</Text>
            {
              factura.pagos.length>0 ?
              <View>
                {
                  factura.pagos.map((pago: any) =>(
                    <>
                    <View key={ pago._id }>
                      <Text>{`Fecha de pago: ${pago.fecha}`}</Text>
                      <Text>{`Monto: ${pago.monto}`}</Text>
                      <Text>{`Metódo de pago: ${pago.metodo}`}</Text>
                    </View>
                    <Divider />
                    </>
                  ))
                }
              </View>:
              <View>
                <Text>No se han realizado pagos.</Text>
              </View>
            }
          </View>
        ))
      }
    </View>
  )
}
