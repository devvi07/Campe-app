
import NetInfo from '@react-native-community/netinfo';
import { requestMultiple, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { Alert, Platform } from 'react-native';

export const formatMiles = (number: string, conSimbolo: boolean) => {

    var negativo = parseFloat(number) < 0;
    let iNumber = Number(number);
    var currencySymbol = '$';
    var decimals = 2;
    var thousandsSeparator = ',';
  
    var numberStr, numberFormatted;
  
    if (!conSimbolo)
      decimals = 0
  
    if (negativo)
      iNumber = ((iNumber) * -1);
  
    iNumber = isNaN(iNumber) ? 0.00 : iNumber;
  
    if (Number(decimals) <= 0) {
      numberStr = parseFloat(number).toFixed(0).toString();
      numberFormatted = new Array(0);
    } else {
      numberStr = parseFloat(number).toFixed(decimals).toString();
      numberFormatted = new Array(numberStr.slice(-(Number(decimals) + 1)));
      numberStr = numberStr.substring(0, numberStr.length - (Number(decimals) + 1));
    }
  
    while (numberStr.length > 3) {
      numberFormatted.unshift(numberStr.slice(-3));
      numberFormatted.unshift(thousandsSeparator);
      numberStr = numberStr.substring(0, numberStr.length - 3);
    }
  
    numberFormatted.unshift(numberStr);
  
    if (conSimbolo)
      numberFormatted.unshift(currencySymbol + (negativo ? '-' : ''));
    else
      numberFormatted.unshift((negativo ? '-' : ''));
  
    return numberFormatted.join('');
}

export const getCurrentDate = () => {
    const fecha = new Date();

    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    let horas: any= fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    
    const ampm = Number(horas) >= 12 ? 'PM' : 'AM';
    horas = Number(horas) % 12;
    horas = horas === 0 ? 12 : horas; // si es 0, mostrar 12
    const horasStr = horas.toString().padStart(2, '0');

    return `${dia} - ${mes} - ${anio} - ${horasStr}:${minutos} ${ampm}`;

};

export const getInfoNetWork = async()=> {

  /*{
    type: 'wifi' | 'cellular' | 'none' | 'unknown' | ...
    isConnected: true,
    isInternetReachable: true,
    details: {
      isConnectionExpensive: false,
      cellularGeneration: '4g', // <- Esto te dice la calidad de red móvil
      ssid: 'TuWifi',
      strength: 80,             // <- Solo disponible en algunos Android
      ...
    }
  }*/

  const netInfo = await NetInfo.fetch();
  console.log('Utils Conectado:', netInfo.isConnected);
  return netInfo.isConnected;
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
  hours = hours % 12 || 12; // 0 => 12

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

export const formatDateDDMMMYYY = (isoString: string) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
  hours = hours % 12 || 12; // 0 => 12

  return `${day}/${month}/${year}`;
};

export const getCurrentDateDDMMYYYY = () => {
  const fecha = new Date();

  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const diaSemana = dias[fecha.getDay()];
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();

  let horas: any= fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  
  const ampm = Number(horas) >= 12 ? 'PM' : 'AM';
  horas = Number(horas) % 12;
  horas = horas === 0 ? 12 : horas; // si es 0, mostrar 12
  const horasStr = horas.toString().padStart(2, '0');

  return `${dia}/${mes}/${anio}`;

};

export const requestAllPermissions = async () => {
  const permissions = Platform.select({
    ios: [
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    ],
    android: [
      PERMISSIONS.ANDROID.CAMERA,
      //PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      //PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      //PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ],
  });

  if (!permissions) return;

  const statuses = await requestMultiple(permissions);

  console.log('Permisos solicitados:', statuses);

  if (
    statuses[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED
    //statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] === RESULTS.GRANTED &&
    //statuses[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === RESULTS.GRANTED &&
    //statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
  ) {
    console.log('Todo bien, todos los permisos otorgados');
  } else {

    /*if (statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'blocked') {
      handleBlockedLocationPermission();
    }*/
    console.log('Algunos permisos fueron denegados');
  }
};

const handleBlockedLocationPermission = () => {
  Alert.alert(
    'Permiso de ubicación bloqueado',
    'Necesitamos acceso a tu ubicación para que la app funcione correctamente. Ve a la configuración para activarlo.',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Ir a configuración',
        onPress: () => openSettings(),
      },
    ]
  );
};