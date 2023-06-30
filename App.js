/* eslint-disable no-unused-vars */
import React from 'react';
import StoreScreen from './screens/StoreScreen';
import AuditScreen from './screens/AuditScreen';
import Home from './screens/Home';
import CustomDrawer from './components/CustomDrawer';
import LoginScreen from './screens/LoginScreen';
import TotalProfitScreen from './screens/TotalProfitScreen';
import TurnoverScreen from './screens/TurnoverScreen';
import ProductSalesScreen from './screens/ProductSalesScreen';
import LineChartScreen from './screens/LineChartScreen';
import BarChartScreen from './screens/BarChart';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import { store } from './store';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} initialRouteName="LoginScreen">
      <Drawer.Screen name="LoginScreen" component={LoginScreen} />
      <Drawer.Screen name="TurnoverScreen" component={TurnoverScreen} />
      <Drawer.Screen name="TotalProfitScreen" component={TotalProfitScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator>
          <Stack.Screen
            name="Root"
            component={Root}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LineChartScreen"
            component={LineChartScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BarChartScreen"
            component={BarChartScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AuditScreen"
            component={AuditScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StoreScreen"
            component={StoreScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TurnoverScreen"
            component={TurnoverScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductSalesScreen"
            component={ProductSalesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TotalProfitScreen"
            component={TotalProfitScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
} 