const PagosSchema: Realm.ObjectSchema = {
    name: "Pagos",
    primaryKey: "_id",
    properties: {
        _id: 'string',
        monto: 'number',
        metodo: 'string',
        status: 'string',
        fecha: 'string',
        usuario: 'string',
        factura: 'string',
        action: 'string'
    },
};

export default PagosSchema;
