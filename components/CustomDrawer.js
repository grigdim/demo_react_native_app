import { View, Text, ImageBackground, Image } from 'react-native'
import React from 'react'
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';

const CustomDrawer = (props) => {
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#2B61A1' }}>
                <Image source={require('../images/intale.png')}
                    style={{ padding: 20, height: 70, width: 70, borderRadius: 40, marginBottom: 10, marginTop: 5, marginLeft: 10 }}>
                </Image>
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Roboto-Medium', marginBottom: 10, marginLeft: 15 }}>
                    Intale Statistics
                </Text>
                <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View>
                <Text>Custom</Text>
            </View>
        </View>
    )
}

export default CustomDrawer