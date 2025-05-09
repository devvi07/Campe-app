import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';
import { List } from 'react-native-paper';
import { PerfilScreen } from '../perfil/PerfilScreen';
import { AdmonClientesScreen } from '../Usuarios/AdmonClientesScreen';
import { RutasScreen } from '../rutas/RutasScreen';
import { ConsultarPagosScreen } from '../consultarPagos/ConsultarPagosScreen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegistroUsuarios } from '../Usuarios/RegistroUsuarios';
import { DownLoadDataScreen } from '../DownLoad/DownLoadDataScreen';
import { SyncronizerScreen } from '../Syncronizer/SyncronizerScreen';

export type RootStackParams = {
  AdmonClientesScreen: undefined;
  RutasScreen: undefined;
  ConsultarPagosScreen: undefined;
  RegistroUsuarios: undefined;
  SyncronizerScreen: undefined;
}

const Drawer = createDrawerNavigator<RootStackParams>();

// 🔹 Componente Personalizado del Drawer
const CustomDrawerContent = (props: any) => {

  const state = props.navigation.getState();
  const currentRoute = state.routes[state.index].name;
  const [ tipoUsuario, setTipoUsuario ] = useState<any>('');
  const [ usuario, setUsuario ] = useState<any>('');

  const getTipoUser = async () => {
    const tipoUsuario = await AsyncStorage.getItem('@KeyTipoUser');
    const usuario = await AsyncStorage.getItem('@KeyUser');
    console.log("🚀 ~ getTipoUser ~ tipoUsuario:", tipoUsuario, 'tipo de dato: ',typeof(tipoUsuario))
    setTipoUsuario(tipoUsuario);
    setUsuario(usuario);
  };

  useEffect(()=>{
    getTipoUser();
  },[]);

  return (
    <DrawerContentScrollView {...props}>
      {/* Header del Drawer */}
      <View style={[styles.headerContainer, { paddingBottom: 20, backgroundColor: '#FFF' }]}>
          <Image source={require("../../../assets/img/campe.png")} style={[styles.logo]} />
      </View>

      {/*Opciones del Drawer */}
      <DrawerItem
        label={() => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginLeft: -20,
              marginRight: -40,
              marginVertical: -15,
              padding: 15,
              backgroundColor: "#FFF",
              borderRadius: 0
            }}
          >
            <List.Icon
              style={{ flex: 1, paddingLeft: 5 }}
              icon={"face-man-profile"}
              color={"#5a121c"}
            />
            <Text style={{ flex: 10, color: "#5a121c", fontSize: 18, textAlignVertical: "center", marginLeft: 20, fontWeight: 'bold' }}>
              {usuario}
            </Text>
          </View>
        )}
        onPress={() => {}}
      />


      <DrawerItem
        label={() => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginLeft: -20,
              marginRight: -40,
              marginVertical: -15,
              padding: 15,
              backgroundColor: currentRoute === "RutasScreen" ? "#5a121c" : "#FFF"
            }}
          >
            <List.Icon
              style={{ flex: 1, paddingLeft: 5 }}
              icon={"source-branch-sync"}
              color={currentRoute === "RutasScreen" ? "#FFF" :"#5a121c"}
            />
            <Text style={{ flex: 10, color: currentRoute === "RutasScreen" ? "#FFF" :"#5a121c", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>
              Rutas
            </Text>
          </View>
        )}
        onPress={() => props.navigation.navigate("RutasScreen")}
      />

      {
        (tipoUsuario == '2') &&
        <DrawerItem
          label={() => (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginLeft: -20,
                marginRight: -40,
                marginVertical: -15,
                padding: 15,
                backgroundColor: currentRoute === "SyncronizerScreen" ? "#5a121c" : "#FFF"
              }}
            >
              <List.Icon
                style={{ flex: 1, paddingLeft: 5 }}
                //icon={"database-sync"}
                //icon={"web-sync"}
                icon={"wifi-sync"}
                color={ currentRoute === "SyncronizerScreen" ? "#FFF" :"#5a121c" }
              />
              <Text style={{ flex: 10, color: currentRoute === "SyncronizerScreen" ? "#FFF" :"#5a121c", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>
                Sincronizar
              </Text>
            </View>
          )}
          onPress={() => props.navigation.navigate("SyncronizerScreen")}
        />
      }

      {
        (tipoUsuario == '4' || tipoUsuario == '1') &&
        <DrawerItem
          label={() => (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginLeft: -20,
                marginRight: -40,
                marginVertical: -15,
                padding: 15,
                backgroundColor: currentRoute === "RegistroUsuarios" ? "#5a121c" : "#FFF"
              }}
            >
              <List.Icon
                style={{ flex: 1, paddingLeft: 5 }}
                icon={"account-multiple-plus"}
                color={ currentRoute === "RegistroUsuarios" ? "#FFF" :"#5a121c" }
              />
              <Text style={{ flex: 10, color: currentRoute === "RegistroUsuarios" ? "#FFF" :"#5a121c", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>
                Registro de usuarios
              </Text>
            </View>
          )}
          onPress={() => props.navigation.navigate("RegistroUsuarios")}
        />
      }

      {/*<DrawerItem
        label={() => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginLeft: -20,
              marginRight: -40,
              marginVertical: -15,
              padding: 15,
              backgroundColor: currentRoute === "AdmonClientesScreen" ? "#5a121c" : "#FFF"
            }}
          >
            <List.Icon
              style={{ flex: 1, paddingLeft: 5 }}
              icon={"card-account-details"}
              color={ currentRoute === "AdmonClientesScreen" ? "#FFF" :"#5a121c" }
            />
            <Text style={{ flex: 10, color: currentRoute === "AdmonClientesScreen" ? "#FFF" :"#5a121c", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>
              Agregar tarjetas
            </Text>
          </View>
        )}
        onPress={() => props.navigation.navigate("AdmonClientesScreen",{tipousuario: "tarjeta"})}
      />*/}

      {
      (tipoUsuario == '4' || tipoUsuario == '1') &&
        <DrawerItem
        label={() => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginLeft: -20,
              marginRight: -40,
              marginVertical: -15,
              padding: 15,
              backgroundColor: currentRoute === "ConsultarPagosScreen" ? "#5a121c" : "#FFF"
            }}
          >
            <List.Icon
              style={{ flex: 1, paddingLeft: 5 }}
              icon={"cash-register"}
              color={ currentRoute === "ConsultarPagosScreen" ? "#FFF" :"#5a121c" }
            />
            <Text style={{ flex: 10, color: currentRoute === "ConsultarPagosScreen" ? "#FFF" :"#5a121c", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>
              Consultar cobros
            </Text>
          </View>
        )}
        onPress={() => props.navigation.navigate("ConsultarPagosScreen")}
      />
      }

      <DrawerItem
        label={() => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginLeft: -20,
              marginRight: -40,
              marginVertical: -15,
              padding: 15,
              backgroundColor: "#FFF"
            }}
          >
            <List.Icon
              style={{ flex: 1, paddingLeft: 5 }}
              icon={"logout"}
              color={ "#5a121c" }
            />
            <Text style={{ flex: 10, color: "#5a121c", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>Salir</Text>
          </View>
        )}
        onPress={() => props.navigation.navigate("Login")}
      />

    </DrawerContentScrollView>
  );
}

export const Navigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: "#FFF" }
      }}
    >

      <Drawer.Screen
        options={{
          title: '',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFF' },
          headerTitle: () => (
            <Image
              source={require('../../../assets/img/campe.png')}
              style={{ width: 140, height: 60, resizeMode: 'contain' }}
            />
          ),
          headerTitleAlign: 'center',
          headerTintColor: '#5a121c',
        }}
        name="RutasScreen"
        component={RutasScreen}
      />

      <Drawer.Screen
        options={{
          title: '',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFF' },
          headerTitle: () => (
            <Image
              source={require('../../../assets/img/campe.png')}
              style={{ width: 140, height: 60, resizeMode: 'contain' }}
            />
          ),
          headerTitleAlign: 'center',
          headerTintColor: '#5a121c',
        }}
        name="AdmonClientesScreen"
        component={AdmonClientesScreen}
      />

      <Drawer.Screen
        options={{
          title: '',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFF' },
          headerTitle: () => (
            <Image
              source={require('../../../assets/img/campe.png')}
              style={{ width: 140, height: 60, resizeMode: 'contain' }}
            />
          ),
          headerTitleAlign: 'center',
          headerTintColor: '#5a121c',
        }}
        name="SyncronizerScreen"
        component={SyncronizerScreen}
      />

      <Drawer.Screen
        options={{
          title: '',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFF' },
          headerTitle: () => (
            <Image
              source={require('../../../assets/img/campe.png')}
              style={{ width: 140, height: 60, resizeMode: 'contain' }}
            />
          ),
          headerTitleAlign: 'center',
          headerTintColor: '#5a121c',
        }}
        name="RegistroUsuarios"
        component={RegistroUsuarios}
      />

      <Drawer.Screen
        options={{
          title: '',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFF' },
          headerTitle: () => (
            <Image
              source={require('../../../assets/img/campe.png')}
              style={{ width: 140, height: 60, resizeMode: 'contain' }}
            />
          ),
          headerTitleAlign: 'center',
          headerTintColor: '#5a121c',
        }}
        name="ConsultarPagosScreen"
        component={ConsultarPagosScreen}
      />

    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 70,
    flexDirection: 'row'
  },
  logo: {
    width: 180,
    height: 60,
    resizeMode: "contain",
  },
});