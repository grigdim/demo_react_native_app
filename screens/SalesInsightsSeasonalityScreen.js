/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
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
  const [seasonalityDetailsPerCategory, setSeasonalityDetailsPerCategory] =
    useState([]);

  const getLocalizedMonthName = month => {
    switch (month) {
      case 1:
        return t('months.january');
      case 2:
        return t('months.february');
      case 3:
        return t('months.march');
      case 4:
        return t('months.april');
      case 5:
        return t('months.may');
      case 6:
        return t('months.june');
      case 7:
        return t('months.july');
      case 8:
        return t('months.august');
      case 9:
        return t('months.september');
      case 10:
        return t('months.october');
      case 11:
        return t('months.november');
      case 12:
        return t('months.december');
      default:
        return '';
    }
  };

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
    if (
      // __DEV__ &&
      token
    ) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        // `http://${ip}:3000/bo/Reports/GetProductCategoryNamesFromSeasonality`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetProductCategoryNamesFromSeasonality`,
        requestOptions,
      );
      const data = await response.json();
      setCategories(data);
      let seasonalityPerCategoryArr = [];
      const promises = [];
      const collator = new Intl.Collator(undefined, {
        sensitivity: 'base',
        ignorePunctuation: true,
      });
      data.map(item => {
        // const url = `http://${ip}:3000/bo/Reports/GetSeasonality?productCategoryName=${item}`;
        const url = `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetSeasonality?productCategoryName=${item}`;
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
        obj['Category'] = item[0].Category;
        obj['currentMonth'] = {
          DateMonth: item[0].DateMonth,
          MonthName: getLocalizedMonthName(item[0].DateMonth),
          Seasonality: item[0].Seasonality,
        };
        obj['nextMonth'] = {
          DateMonth: item[1].DateMonth,
          MonthName: getLocalizedMonthName(item[1].DateMonth),
          Seasonality: item[1].Seasonality,
        };
        seasonalityPerCategoryArrFormatted.push(obj);
      });
      setSeasonalityPerCategory(
        seasonalityPerCategoryArrFormatted.sort((a, b) => {
          const categoryA = a.Category;
          const categoryB = b.Category;
          return collator.compare(categoryA, categoryB);
        }),
      );

      let seasonalityDetailsPerCategoryArr = [];
      const promises2 = [];
      data.map(item => {
        // const url = `http://${ip}:3000/bo/Reports/GetSeasonalityDetails?productCategoryName=${item}`;
        const url = `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetSeasonalityDetails?productCategoryName=${item}`;
        promises2.push(async () => {
          const response2 = await fetch(url, requestOptions);
          const data2 = await response2.json();
          seasonalityDetailsPerCategoryArr.push(data2);
        });
      });
      await Promise.all(promises2.map(promise => promise()));

      let seasonalityDetailsPerCategoryArrFormatted =
        seasonalityDetailsPerCategoryArr.map(arr => {
          const obj = {
            Category: arr[0].Category,
            SeasonalityDetailsPerSubCategory: [],
          };

          arr.forEach(item => {
            const existingSubcategory = obj[
              'SeasonalityDetailsPerSubCategory'
            ].find(subCatItem => subCatItem.Subcategory === item.Subcategory);

            if (!existingSubcategory) {
              const newSubcategory = {
                Subcategory: item.Subcategory,
                Details: [
                  {
                    currentMonth: item.DateMonth,
                    MonthName: getLocalizedMonthName(item.DateMonth),
                    Seasonality: item.Seasonality,
                  },
                ],
              };
              obj['SeasonalityDetailsPerSubCategory'].push(newSubcategory);
            } else {
              existingSubcategory.Details.push({
                nextMonth: item.DateMonth,
                MonthName: getLocalizedMonthName(item.DateMonth),
                Seasonality: item.Seasonality,
              });
            }
          });

          return obj;
        });

      setSeasonalityDetailsPerCategory(
        seasonalityDetailsPerCategoryArrFormatted.sort((a, b) => {
          const categoryA = a.Category;
          const categoryB = b.Category;
          return collator.compare(categoryA, categoryB);
        }),
      );
    }
  };

  useEffect(() => {
    fetchProductCategoryNamesFromSeasonality();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <ScrollView className="space-y-4">
          <Text
            style={{fontSize: 16, color: 'rgb(86, 113, 144)'}}
            className="underline text-center pt-4">
            {t('ByCategoriesTabs').toUpperCase()}
          </Text>
          {/*Seasonality per product category start*/}
          {seasonalityPerCategory.length > 0 && (
            <ScrollView horizontal className="">
              <View
                className="bg-white mx-2 p-2 space-y-2 rounded-lg"
                style={{elevation: 10}}>
                {seasonalityPerCategory.map(item => (
                  <View className="flex-row space-x-4 p-1 mr-0 rounded-md">
                    <Text className="">{item.Category}</Text>
                    <Text className="bg-slate-600 rounded-md px-2 text-white ">
                      {item.currentMonth.MonthName}
                    </Text>
                    <Text
                      className="px-2 rounded-md "
                      style={{
                        backgroundColor: getBackgroundColor(
                          item.currentMonth.Seasonality,
                        ),
                      }}>
                      {item.currentMonth.Seasonality}%
                    </Text>
                    <Text className="bg-slate-600 rounded-md px-2 text-white ">
                      {item.nextMonth.MonthName}
                    </Text>
                    <Text
                      className="px-2 rounded-md "
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
          <Text
            style={{fontSize: 16, color: 'rgb(86, 113, 144)'}}
            className="underline text-center">
            {t('BySubCategoriesTabs').toUpperCase()}
          </Text>
          {seasonalityDetailsPerCategory.length > 0 && (
            <ScrollView horizontal>
              <View
                className="bg-white mx-2 p-2 space-y-2 rounded-lg divide-y-2 divide-gray-500"
                style={{elevation: 10}}>
                {seasonalityDetailsPerCategory.map(item => (
                  <View className="space-x-4 p-1 flex-row">
                    <Text className="w-1/4 text-left font-bold">
                      {item.Category}
                    </Text>
                    <View className="space-y-2 divide-y divide-gray-300">
                      {item.SeasonalityDetailsPerSubCategory.map(obj => {
                        return (
                          <View className="flex-row space-x-2 py-1 justify-between items-center">
                            <Text className="">{obj.Subcategory}</Text>
                            <View className="flex-row space-x-2">
                              <Text className="bg-slate-600 text-white px-2 rounded-md text-left">
                                {obj.Details[0].MonthName}
                              </Text>
                              <Text
                                style={{
                                  backgroundColor: getBackgroundColor(
                                    obj.Details[0].Seasonality,
                                  ),
                                }}
                                className="rounded-md px-2">
                                {obj.Details[0].Seasonality}%
                              </Text>
                              <Text className="bg-slate-600 text-white px-2 rounded-md">
                                {obj.Details[1].MonthName}
                              </Text>
                              <Text
                                style={{
                                  backgroundColor: getBackgroundColor(
                                    obj.Details[1].Seasonality,
                                  ),
                                }}
                                className="rounded-md px-2">
                                {obj.Details[1].Seasonality}%
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
          {/*Seasonality per product category with sub categories end*/}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SalesInsightsSeasonalityScreen;
