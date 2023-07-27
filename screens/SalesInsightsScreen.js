import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SalesInsightsTopProductsScreen from './SalesInsightsTopProductsScreen';
import SalesInsightsSeasonalityScreen from './SalesInsightsSeasonalityScreen';
import SalesInsightsTransactionsScreen from './SalesInsightsTransactionsScreen';

const Tab = createMaterialTopTabNavigator();

const SalesInsightsScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Top Products"
        component={SalesInsightsTopProductsScreen}
      />
      <Tab.Screen
        name="Seasonality"
        component={SalesInsightsSeasonalityScreen}
      />
      <Tab.Screen
        name="Transactions"
        component={SalesInsightsTransactionsScreen}
      />
    </Tab.Navigator>
  );
};

export default SalesInsightsScreen;
