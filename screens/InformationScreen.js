import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import DrawerHeader from './DrawerHeader';

const InformationScreen = () => {
  return (
    <View>
    <TouchableOpacity>
      <DrawerHeader/>
    </TouchableOpacity>
      <Text>InformationScreen</Text>
    </View>
  )
}

export default InformationScreen