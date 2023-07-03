/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import SalesStatisticsScreen from './SalesStatisticsScreen';
import DetailedReports from './SalesDetailedReports';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const SalesTabsScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'rgb(37, 99, 235)',
        },
        headerStyle: {backgroundColor: 'rgb(37, 99, 235)'},
        headerTitleStyle: {fontSize: 25, color: 'white'},
        headerTitleAlign: 'center',
      }}>
      <Tab.Screen
        name={'Sales statistics'}
        component={SalesStatisticsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="md-stats-chart"
              size={25}
              color={focused ? 'white' : 'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        name={'Detailed Reports'}
        component={DetailedReports}
        options={{
          tabBarIcon: ({focused}) => (
            <SimpleLineIcons
              name="drawer"
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
