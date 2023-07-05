/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
import React from 'react';
import StoreScreen from './screens/StoreScreen';
import AuditScreen from './screens/AuditScreen';
import CustomDrawer from './components/CustomDrawer';
import LoginScreen from './screens/LoginScreen';
import TotalProfitScreen from './screens/TotalProfitScreen';
import TurnoverScreen from './screens/TurnoverScreen';
import ProductSalesScreen from './screens/ProductSalesScreen';
import LineChartScreen from './screens/LineChartScreen';
import BarChartScreen from './screens/BarChart';
import SettingsScreen from './screens/SettingsScreen';
import InformationScreen from './screens/InformationScreen';
import ReportsScreen from './screens/ReportsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import SalesTabsScreen from './screens/SalesTabsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import { store } from './store';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, // Show or hide app button for drawer
        headerTintColor: '#3885E0',
        drawerActiveBackgroundColor: '#217BCC',
        drawerActiveTintColor: '#FFFFFF',
        drawerInactiveTintColor: '#333333',
        drawerLabelStyle: {
          marginLeft: -20,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}
      initialRouteName="LoginScreen" >
      <Drawer.Screen name="Home" component={LoginScreen} options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="home-outline" size={22} color={color} />
        )
      }} />
      <Drawer.Screen name="Turnover" component={TurnoverScreen} options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="wallet-outline" size={22} color={color} />
        )
      }} />
      <Drawer.Screen name="Profit" component={TotalProfitScreen} options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="cash-outline" size={22} color={color} />
        )
      }} />
      <Drawer.Screen name="Reports" component={ReportsScreen} options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="document-text-outline" size={22} color={color} />
        )
      }} />
      <Drawer.Screen name="Info" component={InformationScreen} options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="information-circle-outline" size={22} color={color} />
        )
      }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="settings-outline" size={22} color={color} />
        )
      }} />
      <Drawer.Screen
        name="Home"
        component={LoginScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Turnover"
        component={TurnoverScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="wallet-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profit"
        component={TotalProfitScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="cash-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Info"
        component={InformationScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
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
          <Stack.Screen
            name="SalesTabsScreen"
            component={SalesTabsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportsScreen"
            component={ReportsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}
