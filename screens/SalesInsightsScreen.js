/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import DrawerHeader from './DrawerHeader';
import {useTranslation} from 'react-i18next';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SalesInsightsTopProductsScreen from './SalesInsightsTopProductsScreen';
import SalesInsightsSeasonalityScreen from './SalesInsightsSeasonalityScreen';
import SalesInsightsTransactionsScreen from './SalesInsightsTransactionsScreen';

const Tab = createMaterialTopTabNavigator();

const SalesInsightsScreen = () => {
  const {t, i18n} = useTranslation();
  const {width, height} = Dimensions.get('screen');
  return (
    <View className="flex-1 bg-gray-300">
      {/* Comment out The DrawerHeader to remove it from app */}
      <TouchableOpacity style={{width: width, zIndex: 1}}>
        <DrawerHeader />
      </TouchableOpacity>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: false,
        }}>
        <Tab.Screen
          name={t('TopProductsTabs')}
          component={SalesInsightsTopProductsScreen}
        />
        <Tab.Screen
          name={t('SeasonalityTabs')}
          component={SalesInsightsSeasonalityScreen}
        />
        <Tab.Screen
          name={t('TransactionTabs')}
          component={SalesInsightsTransactionsScreen}
        />
      </Tab.Navigator>
    </View>
  );
};

export default SalesInsightsScreen;
