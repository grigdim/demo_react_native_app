import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import DrawerHeader from './DrawerHeader';

const SettingsScreen = () => {
  return (
    <View>
      <TouchableOpacity>
        <DrawerHeader />
      </TouchableOpacity>
      <Text>SettingsScreen</Text>
    </View>
  )
}

export default SettingsScreen