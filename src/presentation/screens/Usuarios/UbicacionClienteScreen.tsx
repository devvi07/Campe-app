import React from 'react';
import MapaUbicacion from '../../components/MapaUbicacion';

export const UbicacionClienteScreen = ({ route }: any) => {
    
    const { latitud, longitud } = route.params;

    return (
        <MapaUbicacion 
            latitud={latitud} 
            longitud={longitud} 
        />
    );
};