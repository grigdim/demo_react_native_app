/* eslint-disable no-unused-vars */
import React from 'react';
import StoreScreen from './screens/StoreScreen';
import AuditScreen from './screens/AuditScreen';
import Home from './screens/Home';
import LoginScreen from './screens/LoginScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {store} from './store';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AuditScreen"
            component={AuditScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StoreScreen"
            component={StoreScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}
