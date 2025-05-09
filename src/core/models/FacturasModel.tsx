import Realm from "realm";

export class FacturasModel extends Realm.Object<FacturasModel> {

    _id!: string;
    articulo!: string;
    cantidad!: number;
    total!: number;
    abono!: number;
    resta!: number;
    status!: string;
    cliente!: string;
    createdAt!: string;
    updatedAt!: string;
    sincronizar!: boolean;
    pagos!: string;
    action!: string;

    static schema: Realm.ObjectSchema = {
        name: "Facturas",
        primaryKey: "_id",
        properties: {
            _id: 'string',
            articulo: 'string',
            cantidad: 'int',
            total: 'double',
            abono: 'double',
            resta: 'double',
            status: 'string',
            cliente: 'string',
            createdAt: 'string',
            updatedAt: 'string',
            pagos: 'string',
            action: 'string',
        },
    };

}