/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import SalesStatisticsScreen from './SalesStatisticsScreen';
import SalesInsightsScreen from './SalesInsightsScreen';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import i18next from '../languages/i18n';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProcurementsScreen from './ProcurementsScreen';

const Tab = createBottomTabNavigator();

const TabsScreen = () => {
  const {t, i18n} = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'rgb(37, 99, 235)',
        },
        headerStyle: {backgroundColor: 'rgb(37, 99, 235)'},
        headerTitleStyle: {fontSize: 23, color: 'white'},
        headerTitleAlign: 'center',
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tab.Screen
        // name={'Sales statistics'}
        name={t('SalesStatistics')}
        component={SalesStatisticsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="stats-chart"
              size={25}
              color={focused ? 'white' : 'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        // name={'Sales statistics'}
        name={t('Procurements')}
        component={ProcurementsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="basket"
              size={25}
              color={focused ? 'white' : 'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        // name={'Sales insights'}
        name={t('SalesInsights')}
        component={SalesInsightsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="analytics"
              size={25}
              color={focused ? 'white' : 'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        // name={'Sales insights'}
        name={t('Personnel')}
        component={SalesInsightsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="people"
              size={25}
              color={focused ? 'white' : 'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        // name={'Sales insights'}
        name={t('Activity')}
        component={SalesInsightsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="pulse"
              size={25}
              color={focused ? 'white' : 'black'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabsScreen;
