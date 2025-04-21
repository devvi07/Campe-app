import React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';

export const ConsultarPagosScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
      <TextInput.Icon
            icon={'cash-check'}
            size={300}
          //color={'#DEDEDE'}
        />
    </View>
  )
}
