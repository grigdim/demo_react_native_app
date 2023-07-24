/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import SalesStatisticsScreen from './SalesStatisticsScreen';
import SalesInsightsScreen from './SalesInsightsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import i18next from '../languages/i18n';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const SalesTabsScreen = () => {
  const { t, i18n } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'rgb(37, 99, 235)',
        },
        headerStyle: { backgroundColor: 'rgb(37, 99, 235)' },
        headerTitleStyle: { fontSize: 25, color: 'white' },
        headerTitleAlign: 'center',
      }}>
      <Tab.Screen
        // name={'Sales statistics'}
        name={t("SalesStatistics")}
        component={SalesStatisticsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="md-stats-chart"
              size={25}
              color={focused ? 'white' : 'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        // name={'Sales insights'}
        name={t("SalesInsights")}
        component={SalesInsightsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="insights"
              size={25}
              color={focused ? 'white' : 'black'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default SalesTabsScreen;
