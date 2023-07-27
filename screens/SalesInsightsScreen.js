import React from 'react';
import {useTranslation} from 'react-i18next';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SalesInsightsTopProductsScreen from './SalesInsightsTopProductsScreen';
import SalesInsightsSeasonalityScreen from './SalesInsightsSeasonalityScreen';
import SalesInsightsTransactionsScreen from './SalesInsightsTransactionsScreen';

const Tab = createMaterialTopTabNavigator();

const SalesInsightsScreen = () => {
  const {t, i18n} = useTranslation();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={t("TopProductsTabs")}
        component={SalesInsightsTopProductsScreen}
      />
      <Tab.Screen
        name={t("SeasonalityTabs")}
        component={SalesInsightsSeasonalityScreen}
      />
      <Tab.Screen
        name={t("TransactionTabs")}
        component={SalesInsightsTransactionsScreen}
      />
    </Tab.Navigator>
  );
};

export default SalesInsightsScreen;
