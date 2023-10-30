/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import CustomDrawer from './components/CustomDrawer';
import LoginScreen from './screens/LoginScreen';
import LineChartScreen from './screens/LineChartScreen';
import BarChartScreen from './screens/BarChart';
import HelpScreen from './screens/HelpScreen';
import AboutScreen from './screens/AboutScreen';
import LanguageScreen from './screens/LanguageScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Provider} from 'react-redux';
import {store} from './store';
import {InfoProvider} from './components/PersonalInfoTaken';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import TabsScreen from './screens/TabsScreen';
import SplashScreen from 'react-native-splash-screen';
import GestureHandlerRootView from 'react-native-gesture-handler';
import ProcurementsScreen from './screens/ProcurementsScreen';
import SalesStatisticsScreen from './screens/SalesStatisticsScreen';
import {useTranslation} from 'react-i18next';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
  const {t, i18n} = useTranslation();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        // swipeEdgeWidth: 0, // Not swipeable
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
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('statistics')}
        // name="Sales"
        component={TabsScreen} // So it corresponds with the tab navigation
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="stats-chart-outline" size={22} color={color} />
          ),
        }}
      />
      {/*      <Drawer.Screen
        name={t('procurementsDrawer')}
        // name="Sales"
        component={ProcurementsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="card-outline" size={22} color={color} />
          ),
        }}
      />*/}
      <Drawer.Screen
        name={t('helpDrawer')}
        // name="Help"
        component={HelpScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="headset-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('languageDrawer')}
        // name="Language"
        component={LanguageScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="flag-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('aboutDrawer')}
        // name="About"
        component={AboutScreen}
        options={{
          drawerIcon: ({color}) => (
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
              options={{headerShown: false}}
            />
            {/*
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{headerShown: false}}
            />
                      <Stack.Screen
              name="LineChartScreen"
              component={LineChartScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BarChartScreen"
              component={BarChartScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SalesStatisticsScreen"
              component={SalesStatisticsScreen}
              options={{headerShown: false}}
              />
              <Stack.Screen
                name="TabsScreen"
                component={TabsScreen}
                options={{headerShown: false}}
              />
          */}
          </Stack.Navigator>
        </Provider>
      </NavigationContainer>
    </InfoProvider>
  );
}
