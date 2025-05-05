import React from 'react'
import { Text, View } from 'react-native'
import { IconButton } from 'react-native-paper';

export const Header = ({ title, color = '#5a121c', textColor = '#FFF', iconBack=false, fnBack=null, textSize=17 } : any) => {
    return (
        <View style={{ backgroundColor: color, height: 50, flexDirection: 'row', justifyContent: 'center' }}>
            
            {
                iconBack &&
                <View style={{ justifyContent: 'center', left: 0, position: 'absolute', top: -3 }} >
                    <IconButton
                        icon="keyboard-backspace"
                        iconColor={"#FFF"}
                        size={28}
                        onPress={() => {
                            fnBack();
                        }}
                    />
                </View>
            }

            <View style={{ justifyContent: 'center' }}>
                <Text style={{ color: textColor, textAlign: 'center', fontSize: textSize, fontWeight: '700' }}>
                    { title }
                </Text>
            </View>

        </View>
    )
};