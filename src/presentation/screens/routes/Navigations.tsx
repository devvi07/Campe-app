import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';
import { List } from 'react-native-paper';
import { PerfilScreen } from '../perfil/PerfilScreen';
import { AdmonClientesScreen } from '../Usuarios/AdmonClientesScreen';
import { RutasScreen } from '../rutas/RutasScreen';
import { ConsultarPagosScreen } from '../consultarPagos/ConsultarPagosScreen';

export type RootStackParams = {
  AdmonClientesScreen: undefined;
  RutasScreen: undefined;
  ConsultarPagosScreen: undefined;
}

const Drawer = createDrawerNavigator<RootStackParams>();

// 🔹 Componente Personalizado del Drawer
const CustomDrawerContent = (props: any) => {

  const state = props.navigation.getState();
  const currentRoute = state.routes[state.index].name;

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
              backgroundColor: currentRoute === "RutasScreen" ? "#871a29" : "#FFF"
            }}
          >
            <List.Icon
              style={{ flex: 1, paddingLeft: 5 }}
              icon={"source-branch-sync"}
              color={currentRoute === "RutasScreen" ? "#FFF" :"#871a29"}
            />
            <Text style={{ flex: 10, color: currentRoute === "RutasScreen" ? "#FFF" :"#871a29", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>Rutas</Text>
          </View>
        )}
        onPress={() => props.navigation.navigate("RutasScreen")}
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
              backgroundColor: currentRoute === "AdmonClientesScreen" ? "#871a29" : "#FFF"
            }}
          >
            <List.Icon
              style={{ flex: 1, paddingLeft: 5 }}
              icon={"account-multiple-plus"}
              color={ currentRoute === "AdmonClientesScreen" ? "#FFF" :"#871a29" }
            />
            <Text style={{ flex: 10, color: currentRoute === "AdmonClientesScreen" ? "#FFF" :"#871a29", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>
              Alta de clientes
            </Text>
          </View>
        )}
        onPress={() => props.navigation.navigate("AdmonClientesScreen")}
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
              backgroundColor: currentRoute === "ConsultarPagosScreen" ? "#871a29" : "#FFF"
            }}
          >
            <List.Icon
              style={{ flex: 1, paddingLeft: 5 }}
              icon={"cash-register"}
              color={ currentRoute === "ConsultarPagosScreen" ? "#FFF" :"#871a29" }
            />
            <Text style={{ flex: 10, color: currentRoute === "ConsultarPagosScreen" ? "#FFF" :"#871a29", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>
              Consultar pagos
            </Text>
          </View>
        )}
        onPress={() => props.navigation.navigate("ConsultarPagosScreen")}
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
              backgroundColor: "#FFF"
            }}
          >
            <List.Icon
              style={{ flex: 1, paddingLeft: 5 }}
              icon={"logout"}
              color={ "#871a29" }
            />
            <Text style={{ flex: 10, color: "#871a29", fontSize: 16, textAlignVertical: "center", marginLeft: 20 }}>Salir</Text>
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
          headerTintColor: '#871a29',
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
          headerTintColor: '#871a29',
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
          headerTintColor: '#871a29',
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