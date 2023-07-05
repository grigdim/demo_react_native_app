import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
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
                    style={{ padding: 20, height: 80, width: 100, marginBottom: 10, marginTop: 5, marginLeft: 10 }}>
                </Image>
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Roboto-Medium', marginBottom: 10, marginLeft: 15 }}>
                    Intale Statistics
                </Text>
                <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#217BCC', marginLeft: -5 }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="exit-outline" size={22} color='#217BCC'/>
                        <Text style={{ fontSize: 15, fontFamily: 'Roboto-Medium', marginLeft: 5, color: '#217BCC' }}>
                            Sign Out
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomDrawer