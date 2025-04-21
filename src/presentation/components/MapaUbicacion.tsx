import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapaUbicacion = ({ latitud, longitud }: { latitud: number, longitud: number }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapa}
        initialRegion={{
          latitude: latitud,
          longitude: longitud,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: latitud, longitude: longitud }} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mapa: {
    width: '100%',
    height: '100%'
  }
});

export default MapaUbicacion;