import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../auth/LoginScreen';
import { Navigation } from './Navigations';
import { ClienteScreen } from '../cliente/ClienteScreen';
import { HistorialPagosScreen } from '../consultarPagos/HistorialPagosScreen';
import { OlvideContraseniaScreen } from '../Usuarios/OlvideContraseniaScreen';
import { CrearTarjetaScreen } from '../Usuarios/CrearTarjetaScreen';
import { UbicacionClienteScreen } from '../Usuarios/UbicacionClienteScreen';
import { ImagenClienteScreen } from '../Usuarios/ImagenClienteScreen';
import { RegistrarPagosScreen } from '../registrarPagos/RegistrarPagosScreen';
import { PDFScreen } from '../PDF/PDFScreen';
import { DetallePago } from '../consultarPagos/DetallePago';
import { RutasScreen } from '../rutas/RutasScreen';
import { EditarUsuario } from '../Usuarios/EditarUsuario';
import { AddClienteScreen } from '../registrarPagos/AddClienteScreen';
import { DownLoadDataScreen } from '../DownLoad/DownLoadDataScreen';


const Stack = createStackNavigator();
export const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Navigation"
                component={Navigation}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ClienteScreen"
                component={ClienteScreen}
                options={{ 
                    headerShown: true,
                    title:'Registrar pago',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#fff',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="HistorialPagosScreen"
                component={HistorialPagosScreen}
                options={{ 
                    headerShown: true,
                    title:'Historial de pagos',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#fff',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="OlvideContraseniaScreen"
                component={OlvideContraseniaScreen}
                options={{ 
                    headerShown: true,
                    title:'Recuperar contraseña',
                    headerStyle:{
                        backgroundColor: '#5a121c ',
                    },
                    headerTintColor: '#fff',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="CrearTarjetaScreen"
                component={CrearTarjetaScreen}
                options={{ 
                    headerShown: true,
                    title:'Crear tarjeta',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#FFF',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="UbicacionClienteScreen"
                component={UbicacionClienteScreen}
                options={{ 
                    headerShown: true,
                    title:'Ubicación del cliente',
                    headerStyle:{
                        backgroundColor: '#5a121c ',
                    },
                    headerTintColor: '#FFF',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="ImagenClienteScreen"
                component={ImagenClienteScreen}
                options={{ 
                    headerShown: true,
                    title:'Foto / Imagen del clientre',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#FFF',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="RegistrarPagosScreen"
                component={RegistrarPagosScreen}
                options={{ 
                    headerShown: true,
                    title:'',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#FFF',
                    //headerTitleAlign: 'center',
                }}
            />
            
            <Stack.Screen
                name="PDFScreen"
                component={PDFScreen}
                options={{ 
                    headerShown: true,
                    title:'Historial de pagos PDF',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#FFF',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="DetallePago"
                component={DetallePago}
                options={{ 
                    headerShown: true,
                    title:'Detalle de cobros',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#FFF',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="EditarUsuario"
                component={EditarUsuario}
                options={{ 
                    headerShown: true,
                    title:'Editar usuario',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#FFF',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="AddClienteScreen"
                component={AddClienteScreen}
                options={{ 
                    headerShown: true,
                    title:'Agregar usuario',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#FFF',
                    //headerTitleAlign: 'center',
                }}
            />

            <Stack.Screen
                name="DownLoadDataScreen"
                component={DownLoadDataScreen}
                options={{ 
                    headerShown: false,
                    title:'DownLoadDataScreen',
                    headerStyle:{
                        backgroundColor: '#5a121c',
                    },
                    headerTintColor: '#FFF',
                    //headerTitleAlign: 'center',
                }}
            />

        </Stack.Navigator>
    )
}
