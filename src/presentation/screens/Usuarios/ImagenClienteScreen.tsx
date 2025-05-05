import React from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

export const ImagenClienteScreen = ({ route }: any) => {

    const { imagen } = route.params;
    const { width, height } = useWindowDimensions();

    return (
        <View style={styles.container}>
            <Image
                //source={{ uri: `data:image/png;base64,${imagen}` }}
                source={{ uri: `${imagen}` }}
                style={{ width, height }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
});