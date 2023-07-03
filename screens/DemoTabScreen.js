/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import StoreScreen from './StoreScreen';
import ProductSalesScreen from './ProductSalesScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const Tabs = () => {
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
        component={StoreScreen}
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
        name={'Product Sales Screen'}
        component={ProductSalesScreen}
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

export default Tabs;
