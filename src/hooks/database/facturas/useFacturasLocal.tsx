import { useRealm } from '@realm/react';
import React, { useMemo } from 'react'
import { FacturasModel } from '../../../core/models/FacturasModel';

export const useFacturasLocal = () => {

    const realm = useRealm();

    const insertFactura = async (data: []) => {
        try {
            realm.write(() => {
                for (const factura of data)
                    realm.create(FacturasModel, factura);
            });
            console.log(`[developerMode] facturas insertados correctamente.`);
            return 1;

        } catch (e) {
            console.log('[developerMode] Error al insertar facturas -> ', e);
            return 0;
        }
    }

    const updateFactura = async (data: []) => {
        try {
            realm.write(() => {
                for (const factura of data)
                    realm.create(FacturasModel, factura, true);
            });
            console.log(`[developerMode] factura actualizada correctamente.`);
            return 1;

        } catch (e) {
            console.log('[developerMode] Error al actualizar factura -> ', e);
            return 0;
        }
    }
    
    return { insertFactura, updateFactura };

}
