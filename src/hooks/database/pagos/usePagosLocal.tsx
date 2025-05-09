import { useRealm } from '@realm/react';
import React from 'react';
import { PagosModel } from '../../../core/models/PagosModel';
import { copyRealmDB } from '../../../config/helpers/RealmFile';

export const usePagosLocal = () => {
    const realm = useRealm();

    const insertPago = async (data: []) => {
        try {
            
            realm.write(() => {
                for (const pago of data)
                    realm.create(PagosModel, pago);
            });
            
            //copyRealmDB(realm.path);
            console.log(`[developerMode] pagos insertados correctamente.`);
            return 1;

        } catch (e) {
            console.log('[developerMode] Error al insertar pagos -> ', e);
            return 0;
        }
    }

    return { insertPago };
}
