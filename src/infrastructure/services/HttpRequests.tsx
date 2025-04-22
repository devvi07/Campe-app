


export const createCliente = async (cliente: any) => {
    try {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        console.log('raw -> ',cliente);
        //await fetch("https://campews.onrender.com/api/usuario/", {
        await fetch("https://campews.onrender.com/api/usuario/", {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(cliente),
            redirect: "follow"
        }).then(async(response) => {
            const codigo = response.status;
            const texto = await response.text();
            console.log('Código de respuesta:', codigo);
            console.log('Respuesta:', texto);
            return { codigo, texto };
        }).then((result) => {
            console.log('result: ',result)
            return result;
        }).catch((error) => console.error(error));
        

    } catch (e) {
        console.log('Error al agregar cliente: ',e);
    }
}