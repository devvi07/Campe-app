import Realm from "realm";

export class ClientesModel extends Realm.Object<ClientesModel> {
    //_id!: Realm.BSON.ObjectId;
    _id!: string;
    nombre!: string;
    apellidoP!: string;
    apellidoM!: string;
    direccion!: string;
    municipio!: string;
    tel!: string;
    latitud!: number;
    longitud!: number;
    cobrador!: string;
    ruta!: string;
    foto!: string;
    uri!: string;
    type!: string;
    namePhoto!: string;
    createdAt!: Date;
    updatedAt!: Date;
    action!: string;
  
    static schema: Realm.ObjectSchema = {
      name: 'Clientes',
      primaryKey: '_id',
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
        uri: 'string',
        type: 'string',
        namePhoto: 'string',
        createdAt: 'date',
        updatedAt: 'date',
        action: 'string',
      },
    };
  }
  