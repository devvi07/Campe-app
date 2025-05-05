import Realm from "realm";
import ClientesSchema from "../schemas/ClientesSchema";
import FacturasSchema from "../schemas/FacturasSchema";
import PagosSchema from "../schemas/PagosSchema";

if (Realm.defaultPath) {
  try {
    
    const existingRealm = new Realm({ 
      schema: [
        ClientesSchema, 
        FacturasSchema,
        PagosSchema
      ], 
      schemaVersion: 1 
    });

    existingRealm.close();
    Realm.deleteFile({ path: Realm.defaultPath });

  } catch (error) {
    console.log("developerMode Error cerrando Realm:", error);
  }
}

const realm = new Realm({
  schema: [
    ClientesSchema,
    FacturasSchema,
    PagosSchema 
  ],
  schemaVersion: 1
});

export default realm;