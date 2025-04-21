import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';

export const AlertNotification = (props: any) => {

    return (
        <View style={styles.container}>

            <Modal isVisible={props.showAlert} animationIn="zoomIn" animationOut="zoomOut">
                <View style={styles.modalContent}>
                    {props.icon == 'success' && <Image source={require('../../assets/icons/success.png')} style={styles.icon} />}
                    {props.icon == 'info' && <Image source={require('../../assets/icons/info.png')} style={styles.icon} />}
                    {props.icon == 'warning' && <Image source={require('../../assets/icons/warning.png')} style={styles.icon} />}
                    {props.icon == 'error' && <Image source={require('../../assets/icons/error.png')} style={styles.icon} />}
                    <Text style={styles.modalTitle}>{props.title}</Text>
                    <Text style={styles.modalMessage}>{props.message}</Text>

                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        
                        <Button style={{ borderRadius: 12, backgroundColor: '#4CAF50', borderColor:'#4CAF50' }} onPress={props.fnAlert}>
                            <Text style={{ color:"#FFF" }}>Aceptar</Text>
                        </Button>
                        {
                            props.cancelar &&
                            <>
                                <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                                <Button style={{ borderRadius: 12, backgroundColor: '#C62828', borderColor:'#C62828' }} onPress={props.toggleAlert}>
                                    Cancelar
                                </Button>
                            </>
                        }

                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8 },
    buttonText: { color: '#FFF', fontSize: 16 },

    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    icon: { width: 60, height: 60, marginBottom: 10 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    modalMessage: { fontSize: 16, textAlign: 'center', marginVertical: 10, color: '#666' },

    confirmButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 8, marginTop: 10 },
    confirmButtonText: { color: '#FFF', fontSize: 16 }
});
