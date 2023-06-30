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
            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#3885E0' }}>
                <Image source={require('../images/intale_statistics.png')}
                    style={{ padding: 20, height: 80, width: 100,  marginBottom: 10, marginTop: 5, marginLeft: 10 }}>
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