type useUsuariosProps = {
    cliente?: string;
};

export const useUsuariosService = ({ cliente }: useUsuariosProps) => {

    const getClientes = async () => {
        try {

            //const URI = `https://campews.onrender.com/api/usuario/`;
            const URI = `http://192.168.0.103:3000/api/usuario/`;
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
            const URI = `http://192.168.0.103:3000/api/usuario/`;
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
