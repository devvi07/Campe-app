import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { formatDate, formatMiles } from '../utils/Utils';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { LOGO } from '../utils/ImgWaterMark';
import { ScrollView } from 'react-native-gesture-handler';

export const HistorialPagosScreen = ({ route, navigation }: any) => {

  const { oFactura, item } = route.params;
  const { width, height } = useWindowDimensions();

  const [ saldoTotal, setSaldoTotal ] = useState(0);
  const [ abonoTotal, setAbonoTotal ] = useState(0);
  const [ restaTotal, setRestaTotal ] = useState(0);

  const calculaSaldos = () => {
    
    let abonoTotal = 0;
    let totalFactura = 0;

    for(let v=0; v<oFactura.length; v++){
      totalFactura+=oFactura[v].total;
    }

    for(let v=0; v<oFactura.length; v++){

      let totalFacturaAux = totalFactura;
      for(let y=0; y<oFactura[v].pagos.length; y++){
        
        abonoTotal+= oFactura[v].pagos[y].monto;
        totalFacturaAux = (totalFacturaAux - oFactura[v].pagos[y].monto);
      }

    }

    const resta = (totalFactura-abonoTotal);

    setSaldoTotal(totalFactura);
    setAbonoTotal(abonoTotal);
    setRestaTotal(resta);

  };

  const generarPDF = async () => {

    const articulos = oFactura.map((factura: any) => {
      return `
        <p><strong>Articulo:</strong> ${factura.articulo}</p>
        <p><strong>Piezas:</strong> ${factura.cantidad}</p>
        <p><strong>Precio:</strong> ${formatMiles(factura.total, true)}</p>
      `;
    }).join('');

    let abonoTotal = 0;
    let totalFactura = 0;
    let sPago = ``;

    for(let v=0; v<oFactura.length; v++){
      totalFactura+=oFactura[v].total;
    }

    for(let v=0; v<oFactura.length; v++){

      let totalFacturaAux = totalFactura;
      for(let y=0; y<oFactura[v].pagos.length; y++){
        
        abonoTotal+= oFactura[v].pagos[y].monto;
        
        sPago+= `
          <tr>
            <td>${formatDate(oFactura[v].pagos[y].fecha)}</td>
            <td>${formatMiles(oFactura[v].pagos[y].monto, true)}</td>
            <td>${formatMiles((totalFacturaAux - oFactura[v].pagos[y].monto).toString(), true)}</td>
            <td>${oFactura[v].pagos[y].metodo}</td>
          </tr>
        `;
        totalFacturaAux = (totalFacturaAux - oFactura[v].pagos[y].monto);
      }

    }

    const resta = (totalFactura-abonoTotal);
    const totales = `
      <p><strong>Saldo total:</strong> ${formatMiles(totalFactura.toString(), true)}</p>
      <p><strong>Abono total:</strong> ${formatMiles(abonoTotal.toString(), true)}</p>
      <p><strong>Resta:</strong> <strong>${formatMiles(resta.toString(), true)}</strong></p>
    `;

    const html = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        text-align: center;
      }

      .contenedor {
        max-width: 700px;
        margin: 0 auto;
        text-align: left;
      }

      h1 {
        text-align: center;
        margin-bottom: 40px;
      }

      .encabezado {
        margin-bottom: 30px;
      }

      .encabezado p {
        margin: 5px 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: center;
      }

      th {
        background-color: #f2f2f2;
      }

      .totales {
        text-align: right;
        font-size: 16px;
      }
      
      .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.07;
        z-index: 0;
        width: 80%;
      }
    </style>
  </head>
  <body>
    <img src="${LOGO}" class="watermark" />
    <div class="contenedor">
      <h1>Historico de pagos</h1>

      <div class="encabezado">
        <p><strong>Cliente:</strong> ${item.nombre} ${item.apellidoP} ${item.apellidoM}</p>
        ${articulos}
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Abono</th>
            <th>Resta</th>
            <th>Metódo de pago</th>
          </tr>
        </thead>
        <tbody>
          ${sPago}
        </tbody>
      </table>

      <div class="totales">
        ${totales}
      </div>
    </div>
  </body>
</html>
`;

    
    const options = {
      //html: htmlContent,
      html: html,
      fileName: `EstatusDePago`,
      directory: 'Documents',
    };
  
    try {
      const file = await RNHTMLtoPDF.convert(options);
      return file.filePath;
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  const generarYMostrar = async () => {
    const filePath = await generarPDF();
    if (filePath) {
      navigation.navigate('PDFScreen',{rutaPDF: filePath});
    }
  };

  useEffect(()=>{
    console.log('item -> ',item);
    console.log('oFactura -> ',oFactura);
    calculaSaldos();

  },[]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', }} >
      {
        oFactura.map((factura: any) =>(

          <View key={factura._id} style={{ backgroundColor: '#FFF', marginHorizontal: 10, marginTop: 10 }}>

            <Card style={{ borderRadius: 4, backgroundColor: '#FFF' }}>
              <Card.Content>
                
                <View style={{ marginHorizontal: width *0.20 }}>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 200 }}>
                    <Text style={ styles.label }>{`Articulo:`}</Text>
                    <Text style={ styles.value }>{`${factura.articulo}`}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 200 }}>
                    <Text style={ styles.label }>{`Piezas:`}</Text>
                    <Text style={ styles.value }>{`${factura.cantidad}`}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 200 }}>
                    <Text style={ styles.label }>{`Precio:`}</Text>
                    <Text style={ styles.value }>{`${formatMiles(factura.total, true)}`}</Text>
                  </View>
                  
                </View>

              </Card.Content>
            </Card>

            <View style={{ backgroundColor: '#adbc5b', height: 35, borderRadius: 4, justifyContent: 'center' }}>
              <Text style={{ color: '#FFF', fontWeight: '900', textAlign: 'center', fontSize: 15 }}>Pagos realizados</Text>
            </View>            
            
            {
              factura.pagos.length>0 ?
              <>
                <ScrollView>
                {
                  factura.pagos.map((pago: any) =>(
                    <>
                    <View key={ pago._id }>
                    
                      <Card style={{ borderRadius: 4, backgroundColor: '#FFF' }}>
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

                    </View>
                    </>
                  ))

                }

                <View style={{ backgroundColor: '#000', height: 35, borderRadius: 4, justifyContent: 'center' }}>
                  <Text style={{ color: '#FFF', fontWeight: '900', textAlign: 'center', fontSize: 15 }}>Resumen de pagos</Text>
                </View>

                    <Card style={{ borderRadius: 4, backgroundColor: '#FFF' }}>
                      <Card.Content>

                        <View style={{ marginHorizontal: width * 0.05 }}>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.label}>{`Saldo total:`}</Text>
                            <Text style={styles.value}>{`${formatMiles(saldoTotal.toString(), true)}`}</Text>
                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.label}>{`Abono total:`}</Text>
                            <Text style={styles.value}>{`${formatMiles(abonoTotal.toString(), true)}`}</Text>
                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.label}>{`Resta:`}</Text>
                            <Text style={styles.value}>{`${formatMiles(restaTotal.toString(), true)}`}</Text>
                          </View>

                        </View>


                      </Card.Content>
                    </Card>


                <View style={{ marginTop: 20 }}>
                  <Button 
                    icon="file-document" 
                    mode="contained" 
                    onPress={() => {
                      generarYMostrar();
                      console.log('Genera PDF');
                    }}
                    buttonColor='#FFFF'
                    textColor='#871a29'
                    style={{ borderRadius: 7, borderColor: '#CFD8DC', borderWidth: 1 }}
                  >
                    Generar PDF
                  </Button>
                </View>
                </ScrollView>
              </>:
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
