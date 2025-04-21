import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Navigation } from "./src/presentation/screens/routes/Navigations";
import { StackNavigator } from "./src/presentation/screens/routes/StackNavigator";

const App = () => {

  return(
    <PaperProvider>
      <NavigationContainer>
        {/*<Navigation />*/}
        <StackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;