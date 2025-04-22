import React, { useState } from 'react';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, IconButton, TextInput } from 'react-native-paper';
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
                <ScrollView>
                    <View>
                        <Pdf
                            source={{ uri: rutaPDF }}
                            style={{ flex: 1, width: width, height: height*0.7 }}
                        />
                    </View>
                </ScrollView>
            )}

            <View style={{ marginBottom: height * 0.17, top: 50, alignItems: 'center' }}>

                <TextInput.Icon
                    icon={'share-circle'}
                    size={60}
                    color={'#871a29'}
                    onPress={() => {
                        compartirPDF(rutaPDF);
                    }}
                />

            </View>

        </View>
    )
}
