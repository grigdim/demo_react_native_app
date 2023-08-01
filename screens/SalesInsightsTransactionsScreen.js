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

const SalesInsightsTransactionsScreen = () => {
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(false);
  const [transactionsWeeks, setTransactionsWeeks] = useState([]);
  const [transactionsStores, setTransactionsStores] = useState([]);
  const [topTransactionsHours, setTopTransactionsHours] = useState([]);
  const [topTransactionsDay, setTopTransactionsDay] = useState([]);
  const [transactionsPerHours, setTransactionsPerHours] = useState([]);
  const [transactionsPerDay, setTransactionsPerDay] = useState([]);
  const [αnalysisWeekHourlyTransactions, setAnalysisWeekHourlyTransactions] =
    useState([]);

  const fetchTransactionsWeeks = async () => {
    setLoading(true);
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
        // `http://${ip}:3000/bo/Reports/GetTransactionsWeeks?storeIds=${storeIdsForTransactionWeeks}`,
        `http://${ip}:3000/bo/Reports/GetTransactionsWeeks?storeIds=4043`, // Hard coded since we don't initialize the store at the moment
        requestOptions,
      );
      const data = await response.json();
      // console.log('transaction weeks', data);
      setTransactionsWeeks(data);

      const response2 = await fetch(
        `http://${ip}:3000/bo/Reports/GetTransactionsStoresNames?storeIds=4043`,
        requestOptions,
      );
      const data2 = await response2.json();
      // console.log('transaction stores', data2);
      setTransactionsStores(data2);

      const promises = [];
      let arr = [];
      data.forEach(item => {
        const url = `http://${ip}:3000/bo/Reports/GetTransactionAnalysisTopHour?storeIds=4043&weekDescription=${item.WeekDescription}`;
        promises.push(
          fetch(url, requestOptions)
            .then(response3 => response3.json())
            .then(data3 => {
              arr.push(data3);
            }),
        );
      });
      await Promise.all(promises);
      // console.log('top transaction per hours', arr);
      setTopTransactionsHours(arr);

      const promises2 = [];
      let arr2 = [];

      data.forEach(item => {
        const url = `http://${ip}:3000/bo/Reports/GetTransactionAnalysisTopDay?storeIds=4043&weekDescription=${item.WeekDescription}`;
        promises2.push(
          fetch(url, requestOptions)
            .then(response4 => response4.json())
            .then(data4 => {
              arr2.push(data4);
            }),
        );
      });
      await Promise.all(promises2);
      // console.log('top transactions day', arr2);
      setTopTransactionsDay(arr2);

      const promises3 = [];
      let arr3 = [];
      data.forEach(item => {
        const url = `http://${ip}:3000/bo/Reports/GetTransactionsPerHours?storeIds=4043&weekDescription=${item.WeekDescription}`;
        promises3.push(
          fetch(url, requestOptions)
            .then(response5 => response5.json())
            .then(data5 => {
              arr3.push(data5);
            }),
        );
      });
      await Promise.all(promises3);
      // console.log('transactions per hours', arr3);
      setTransactionsPerHours(arr3);

      const promises4 = [];
      let arr4 = [];
      data.forEach(item => {
        const url = `http://${ip}:3000/bo/Reports/GetTransactionsPerDay?storeIds=4043&weekDescription=${item.WeekDescription}`;
        promises4.push(
          fetch(url, requestOptions)
            .then(response6 => response6.json())
            .then(data6 => {
              arr4.push(data6);
            }),
        );
      });
      await Promise.all(promises4);
      // console.log('transactions per day', arr4);
      setTransactionsPerDay(arr4);

      const promises5 = [];
      let arr5 = [];
      data.forEach(item => {
        const url = `http://${ip}:3000/bo/Reports/GetAnalysisWeekHourlyTransactions?storeIds=4043&weekDescription=${item.WeekDescription}`;
        promises5.push(
          fetch(url, requestOptions)
            .then(response7 => response7.json())
            .then(data7 => {
              arr5.push(data7);
            }),
        );
      });
      await Promise.all(promises5);
      console.log('analysis week hourly transactions', arr5);
      setAnalysisWeekHourlyTransactions(arr5);
    }
    // end of request
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactionsWeeks();
  }, []);

  return (
    <View>
      <Text>SalesInsightsTransactionsScreen</Text>
    </View>
  );
};

export default SalesInsightsTransactionsScreen;
