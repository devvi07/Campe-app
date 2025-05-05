import { CAMPE_CONTS } from "../../presentation/screens/utils/Constantes";

type useUsuariosProps = {
    cliente?: string;
    idTipoUsuario?: string;
};

export const useUsuariosService = ({ cliente, idTipoUsuario }: useUsuariosProps) => {

    const getClientes = async () => {
        console.log('getting users by type: ',idTipoUsuario);

        try {

            const URI = `https://campews.onrender.com/api/usuario/tipoUsuario/${idTipoUsuario}`;
            const response = await fetch(URI, {
                method: 'GET',
                headers: {
                    contentType: "application/json; charset=ISO-8859-1",
                }
            })

            const data = await response.json();
            return data;

        } catch (e) {
            return null;
        }
    }

    const createCliente = async () => {
        try {
            //const URI = `https://campews.onrender.com/api/usuario/`;
            const URI = `https://campews.onrender.com/api/usuario/`;
            const response = await fetch(URI, {
                method: 'POST',
                headers: {
                    contentType: "application/json; charset=ISO-8859-1",
                },
                body: cliente
            })

            const data = await response.json();
            return data;

        } catch (e) {
            return null;
        }
    }


    return { getClientes, createCliente }

}
