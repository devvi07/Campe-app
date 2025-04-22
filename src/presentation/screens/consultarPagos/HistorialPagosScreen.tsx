import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { formatDate, formatMiles } from '../utils/Utils';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { LOGO } from '../utils/ImgWaterMark';

export const HistorialPagosScreen = ({ route, navigation }: any) => {

  const { oFactura, item } = route.params;
  const { width, height } = useWindowDimensions();

  const [ pagos, setPagos ] = useState([]);

  const generarPDF = async () => {

    /*const filas = oFactura.map(prod => {
      const total = prod.precioUnitario * prod.cantidad;
      return `
        <tr>
          <td>${prod.cantidad}</td>
          <td>${prod.descripcion}</td>
          <td>$${prod.precioUnitario.toFixed(2)}</td>
          <td>$${total.toFixed(2)}</td>
        </tr>
      `;
    }).join('');*/

    const articulos = oFactura.map((factura: any) => {
      return `
        <p><strong>Articulo:</strong> ${factura.articulo}</p>
        <p><strong>Piezas:</strong> ${factura.cantidad}</p>
        <p><strong>Precio:</strong> ${formatMiles(factura.total, true)}</p>
      `;
    }).join('');

    let abonoTotal = 0;
    let totalFactura = 0;
    for(let v=0; v<oFactura.length; v++){
      totalFactura+=oFactura[v].total;
    }

    /*const totales = `
      <p><strong>Saldo total:</strong> ${formatMiles(totalFactura.toString(), true)}</p>
      <p><strong>Abono total:</strong> </p>
      <p><strong>Resta:</strong> <strong>$29,870.00</strong></p>
    `;*/

    let sPago = ``;
    const facturasPagos = pagos.map((pago: any, index: number) => {
      
      return sPago += `
        <tr>
          <td>${formatDate(pago[index].fecha)}</td>
          <td>${formatMiles(pago[index].monto, true)}</td>
          <td>${formatMiles((totalFactura - pago[index].monto).toString(), true)}</td>
          <td>${pago[index].metodo}</td>
        </tr>
      `;  
    }).join('');

    console.log('facturasPagos -> ',facturasPagos);

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
      <h1>Estatus de pagos</h1>

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
        <p><strong>Saldo total:</strong> $25,750.00</p>
        <p><strong>Abono total:</strong> $4,120.00</p>
        <p><strong>Resta:</strong> <strong>$29,870.00</strong></p>
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
    const pagos = oFactura.map((factura: any) => factura.pagos);
    setPagos(pagos);

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
