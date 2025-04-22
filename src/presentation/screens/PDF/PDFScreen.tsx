import React, { useState } from 'react';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Pdf from 'react-native-pdf';
import Share, { ShareOptions } from 'react-native-share';


export const PDFScreen = ({ route, navigation }: any) => {
    const { rutaPDF } = route.params;
    const { width, height } = useWindowDimensions();

    const compartirPDF = async (rutaPDF: string): Promise<void> => {
        try {
            const opciones: ShareOptions = {
                title: 'Compartir PDF',
                url: `file://${rutaPDF}`,
                type: 'application/pdf',
                message: 'Te comparto el PDF del cliente 📎',
                failOnCancel: false,
            };

            await (Share as any).open(opciones);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error al compartir PDF:', error.message, error.stack);
              } else {
                console.error('Error al compartir PDF (desconocido):', error);
              }
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            {rutaPDF && (
                <Pdf
                    source={{ uri: rutaPDF }}
                    style={{ flex: 1, width: width, height: height, backgroundColor: '#DEDEDE'}}
                />
            )}

            <View style={{ marginBottom: height*0.17, marginHorizontal: 20, top:50 }}>
                <Button
                    icon="share-circle"
                    mode="contained"
                    onPress={() => {
                        compartirPDF(rutaPDF);
                        console.log('Genera PDF');
                    }}
                    buttonColor='#FFFF'
                    textColor='#871a29'
                    style={{ borderRadius: 7, borderColor: '#CFD8DC', borderWidth: 1 }}
                >
                    Compartir PDF
                </Button>
            </View>
        </View>
    )
}
