import Realm from "realm";

export class PagosModel extends Realm.Object<PagosModel> {

    _id!: string;
    monto!: number;
    metodo!: string;
    status!: string;
    fecha!: string;
    usuario!: string;
    factura!: string;
    sincronizar!: boolean;
    action!: string;

    static schema: Realm.ObjectSchema = {
        name: "Pagos",
        primaryKey: "_id",
        properties: {
            _id: 'string',
            monto: 'double',
            metodo: 'string',
            status: 'string',
            fecha: 'string',
            usuario: 'string',
            factura: 'string',
            action: 'string',
        },
    };

}