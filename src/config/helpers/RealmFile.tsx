import RNFS from "react-native-fs";

export const copyRealmDB = async (path: string) => {
    const sourcePath = path; // Ruta original de la BD
    console.log('path: ',path)
    const destinationPath = `${RNFS.DownloadDirectoryPath}/default.realm`; // Nueva ruta accesible

    try {
        await RNFS.copyFile(sourcePath, destinationPath);
        console.log("[developerMode] Base de datos copiada a:", destinationPath);
    } catch (error) {
        console.log("[developerMode] Error copiando la BD:", error);
    }
};

export const deleteSchema = async (path: string) => {
    const realmPath = path;
    try{
        console.log("[developerMode] ~ deleteSchema ~ realmPath:", realmPath)
        // Elimina la base de datos actual
        RNFS.unlink(realmPath)
            .then(() => console.log("[developerMode] Base de datos eliminada"))
            .catch((err) => console.log("[developerMode] Error eliminando la base de datos:", err));
    }catch(e){
        console.log('[developerMode] Error al eliminar la BD Realm -> ',e);
    }
};
