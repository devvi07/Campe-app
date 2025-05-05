import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Navigation } from "./src/presentation/screens/routes/Navigations";
import { StackNavigator } from "./src/presentation/screens/routes/StackNavigator";
import { RealmProvider } from '@realm/react';
import { ClientesModel } from "./src/core/models/ClientesModel";
import { FacturasModel } from "./src/core/models/FacturasModel";
import { PagosModel } from "./src/core/models/PagosModel";

const App = () => {

  return (
    <RealmProvider
      schema={[
        ClientesModel,
        FacturasModel,
        PagosModel
      ]}
    >
      <PaperProvider>
        <NavigationContainer>
          {/*<Navigation />*/}
          <StackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </RealmProvider>
  );
}

export default App;