const FacturasSchema: Realm.ObjectSchema = {
    name: "Facturas",
    primaryKey: "_id",
    properties: {
        _id: 'string',
        articulo: 'string',
        cantidad: 'int',
        total: 'int',
        abono: 'int',
        resta: 'string',
        status: 'string',
        cliente: 'string',
        createdAt: 'string',
        updatedAt: 'string',
        pagos: 'string',
        action: 'string'
    },
};

export default FacturasSchema;
