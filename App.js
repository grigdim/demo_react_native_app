/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import StoreScreen from './screens/StoreScreen';
import AuditScreen from './screens/AuditScreen';
import CustomDrawer from './components/CustomDrawer';
import LoginScreen from './screens/LoginScreen';
import TotalProfitScreen from './screens/TotalProfitScreen';
import TurnoverScreen from './screens/TurnoverScreen';
import ProductSalesScreen from './screens/ProductSalesScreen';
import LineChartScreen from './screens/LineChartScreen';
import BarChartScreen from './screens/BarChart';
import HelpScreen from './screens/HelpScreen';
import AboutScreen from './screens/AboutScreen';
import TestingScreen from './screens/TestingScreen';
import ReportsScreen from './screens/ReportsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import { store } from './store';
import { InfoProvider } from './components/PersonalInfoTaken';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import SalesTabsScreen from './screens/SalesTabsScreen';
import SplashScreen from 'react-native-splash-screen';
import GestureHandlerRootView from 'react-native-gesture-handler';
import SalesStatisticsScreen from './screens/SalesStatisticsScreen';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {

  const { t, i18n } = useTranslation();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        swipeEdgeWidth: 0, // Not swipeable
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
      initialRouteName="Root">
      <Drawer.Screen
        name={t('homeDrawer')}
        // name="Home"
        component={LoginScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('turnoverDrawer')}
        // name="Turnover"
        component={TurnoverScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="wallet-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('totalProfitDrawer')}
        // name="Total Profit"
        component={TotalProfitScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="cash-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('reportsDrawer')}
        // name="Reports"
        component={ReportsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('chartsDrawer')}
        // name="Charts"
        component={BarChartScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="stats-chart-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('salesDrawer')}
        // name="Sales"
        component={SalesTabsScreen} // So it corresponds with the tab navigation
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="card-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('testingDrawer')}
        // name="Testing"
        component={TestingScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="bulb-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('helpDrawer')}
        // name="Help"
        component={HelpScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="headset-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('aboutDrawer')}
        // name="About"
        component={AboutScreen}
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
    </Drawer.Navigator>
  );
}

export default function App() {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <InfoProvider>
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
              name="SalesStatisticsScreen"
              component={SalesStatisticsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TestingScreen"
              component={TestingScreen}
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
    </InfoProvider>
  );
}
