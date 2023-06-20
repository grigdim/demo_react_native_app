/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {selectToken} from '../features/bootstrap';
import {useDispatch, useSelector} from 'react-redux';

const StoresScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [storesFromBoApi, setStoresFromBoApi] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDataFromBoApi = async () => {
    setLoading(true);
    if (__DEV__ && token) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var raw = JSON.stringify({
        fromDate: '2019-01-01 00:00:00',
        toDate: '2019-01-31 23:59:59',
        sftId: 1,
        groupByDate: 'WEEK',
        storesIds: [1],
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw,
      };

      const response = await fetch(
        'http://192.168.1.184:3000/bo/Invoices/FetchSalesDataServerSide',
        requestOptions,
      );
      const data = await response.json();
      setStoresFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  useEffect(() => {
    fetchDataFromBoApi();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View className="mb-20">
          <View
            className="py-2 my-5 bg-gray-200 border border-solid border-cyan-200 rounded-xl"
            style={{elevation: 50}}>
            <Text className="text-cyan-400 text-center font-bold text-3xl">
              Store data
            </Text>
          </View>
          <ScrollView
            className="divide-y-2 divide-cyan-400 rounded-2xl"
            style={{elevation: 50}}>
            {storesFromBoApi?.CategoriesSalesDtos?.map(category => (
              <View className="p-2 bg-gray-200" key={category.CategoryId}>
                <Text className="m-1 text-xl">
                  Category Id: {category.CategoryId}
                </Text>
                <Text className="m-1 text-xl">
                  Category Name: {category.CategoryName}
                </Text>
                <Text className="m-1 text-xl">
                  Cost including vat: {category.CostInclVat} €
                </Text>
                <Text className="m-1 text-xl">
                  Profit percentage: {category.ProfitPercentage} %
                </Text>
                <Text className="m-1 text-xl">
                  Profit with vat: {category.ProfitWithVat} €
                </Text>
                <Text className="m-1 text-xl">
                  Profit without vat: {category.ProfitWithoutVat} €
                </Text>
                <Text className="m-1 text-xl">
                  Quantity: {category.QuantityTmx}
                </Text>
                <Text className="m-1 text-xl">
                  Turnover: {category.Turnover} €
                </Text>
                <Text className="m-1 text-xl">Vat: {category.Vat} %</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default StoresScreen;
