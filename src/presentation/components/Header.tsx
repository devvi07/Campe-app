import React from 'react'
import { Text, View } from 'react-native'

export const Header = ({ title, color = '#871a29', textColor = '#FFF' } : any) => {
    return (
        <View style={{ backgroundColor: color, height: 50, flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ justifyContent: 'center' }}>
                <Text style={{ color: textColor, textAlign: 'center', fontSize: 17, fontWeight: '700' }}>
                    { title }
                </Text>
            </View>
        </View>
    )
};