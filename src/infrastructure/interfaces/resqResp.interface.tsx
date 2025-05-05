export interface ReqResUserResponse {
    _id:         string;
    nombre:      string;
    apellidoP:   string;
    apellidoM:   string;
    direccion:   string;
    municipio:   string;
    tel:         string;
    password:    string;
    latitud:     number;
    longitud:    number;
    cobrador:    string;
    ruta:        string;
    foto:        string;
    createdAt:   Date;
    updatedAt:   Date;
}

export interface Factura {
    _id:       string;
    articulo:  string;
    cantidad:  number;
    total:     number;
    abono:     number;
    resta:     number;
    status:    string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Pago {
    _id:     string;
    monto:   number;
    metodo:  string;
    status:  string;
    fecha:   Date;
    usuario: string;
}

export interface TipoUsuario {
    _id:         string;
    tipo:        number;
    descripcion: string;
    __v:         number;
}
