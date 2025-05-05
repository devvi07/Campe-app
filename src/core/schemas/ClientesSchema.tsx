const ClientesSchema: Realm.ObjectSchema = {
    name: "Clientes",
    primaryKey: "_id",
    properties: {
        _id: 'string',
        nombre: 'string',
        apellidoP: 'string',
        apellidoM: 'string',
        direccion: 'string',
        municipio: 'string',
        tel: 'string',
        latitud: 'double',
        longitud: 'double',
        cobrador: 'string',
        ruta: 'string',
        foto: 'string',
        createdAt: 'string',
        updatedAt: 'string',
        action: 'string'
    },
};

export default ClientesSchema;
