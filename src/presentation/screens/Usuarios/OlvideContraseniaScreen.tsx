import React from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-paper'

export const OlvideContraseniaScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
      <TextInput.Icon
            icon={'eye-settings'}
            size={250}
          //color={'#DEDEDE'}
        />
    </View>
  )
}
