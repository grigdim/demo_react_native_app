/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {selectToken} from '../features/bootstrap';
import {useSelector} from 'react-redux';
import {ip} from '@env';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useTranslation} from 'react-i18next';

const SalesInsightsSeasonalityScreen = () => {
  const {t, i18n} = useTranslation();
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [seasonalityPerCategory, setSeasonalityPerCategory] = useState([]);

  const getBackgroundColor = value => {
    if (value === 0) {
      return 'transparent';
    } else if (value > 0) {
      const opacity = Math.min(1, 0.25 + value / 200);
      return `rgba(0, 255, 0, ${opacity})`;
    } else {
      const opacity = Math.min(1, 0.25 + Math.abs(value) / 200);
      return `rgba(255, 0, 0, ${opacity})`;
    }
  };

  const fetchProductCategoryNamesFromSeasonality = async () => {
    // setLoading(true);
    if (__DEV__ && token) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        `http://${ip}:3000/bo/Reports/GetProductCategoryNamesFromSeasonality`,
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
      setCategories(data);
      let seasonalityPerCategoryArr = [];
      const promises = [];

      data.map(item => {
        const url = `http://${ip}:3000/bo/Reports/GetSeasonality?productCategoryName=${item}`;
        promises.push(async () => {
          const response2 = await fetch(url, requestOptions);
          const data2 = await response2.json();
          seasonalityPerCategoryArr.push(data2);
        });
      });

      await Promise.all(promises.map(promise => promise()));
      let seasonalityPerCategoryArrFormatted = [];
      seasonalityPerCategoryArr.map(item => {
        let obj = {};
        console.log(item);
        obj['Category'] = item[0].Category;
        obj['currentMonth'] = {
          DateMonth: item[0].DateMonth,
          MonthName: item[0].MonthName,
          Seasonality: item[0].Seasonality,
        };
        obj['nextMonth'] = {
          DateMonth: item[1].DateMonth,
          MonthName: item[1].MonthName,
          Seasonality: item[1].Seasonality,
        };
        seasonalityPerCategoryArrFormatted.push(obj);
      });
      setSeasonalityPerCategory(seasonalityPerCategoryArrFormatted);
      // end of request
      // setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProductCategoryNamesFromSeasonality();
    setLoading(false);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <ScrollView className="w-full space-y-4">
          {/*Seasonality per product category start*/}
          {seasonalityPerCategory.length > 0 && (
            <ScrollView horizontal>
              <View
                className="bg-white m-4 p-4 space-y-2 rounded-lg"
                style={{elevation: 10}}>
                {seasonalityPerCategory.map(item => (
                  <View className="flex-row space-x-4 p-1 rounded-md">
                    <Text className="grow-1">{item.Category}</Text>
                    <Text className="bg-slate-600 rounded-md px-2 text-white">
                      {item.currentMonth.MonthName}
                    </Text>
                    <Text
                      className="px-2 rounded-md"
                      style={{
                        backgroundColor: getBackgroundColor(
                          item.currentMonth.Seasonality,
                        ),
                      }}>
                      {item.currentMonth.Seasonality}%
                    </Text>
                    <Text className="bg-slate-600 rounded-md px-2 text-white">
                      {item.nextMonth.MonthName}
                    </Text>
                    <Text
                      className="px-2 rounded-md"
                      style={{
                        backgroundColor: getBackgroundColor(
                          item.nextMonth.Seasonality,
                        ),
                      }}>
                      {item.nextMonth.Seasonality}%
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
          {/*Seasonality per product category end*/}

          {/*Seasonality per product category with sub categories start*/}
          <View></View>
          {/*Seasonality per product category with sub categories end*/}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SalesInsightsSeasonalityScreen;
