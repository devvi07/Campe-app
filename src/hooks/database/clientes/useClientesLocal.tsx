import { useQuery, useRealm } from '@realm/react';
import { ClientesModel } from '../../../core/models/ClientesModel';
import { useMemo } from 'react';

type useClientesProps = {
  ruta?: string;
};

export const useClientesLocal = ({ ruta }: useClientesProps = {}) => {

  const realm = useRealm();
  const clientes = useQuery(ClientesModel);

  const insertCliente = async (data: []) => {
    try {
      realm.write(() => {
        for (const cliente of data)
          realm.create(ClientesModel, cliente);
      });
      console.log(`[developerMode] clientes insertados correctamente.`);
      return 1;

    } catch (e) {
      console.log('[developerMode] Error al insertar clientes -> ', e);
      return 0;
    }
  }

  const clientesByRuta = useMemo(() => {
    if (!clientes || !ruta) return [];
  
    const filtrados = clientes.filtered('ruta == $0', ruta);
    return Array.from(filtrados); // así te aseguras de tener un array puro
  }, [clientes, ruta]);
  

  return { insertCliente, clientesByRuta };

}
