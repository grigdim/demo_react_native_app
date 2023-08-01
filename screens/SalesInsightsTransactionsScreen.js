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
      // console.log(data);
      setTransactionsWeeks(data);

      const response2 = await fetch(
        `http://${ip}:3000/bo/Reports/GetTransactionsStoresNames?storeIds=4043`,
        requestOptions,
      );
      const data2 = await response2.json();
      // console.log(data2);
      setTransactionsStores(data2);
      const promises = [];
      let arr = [];
      data.map(item => {
        const url = `http://${ip}:3000/bo/Reports/GetTransactionAnalysisTopHour?storeIds=4043&weekDescription${item.WeekDescription}`;
        promises.push(async () => {
          const response3 = await fetch(url, requestOptions);
          const data3 = await response3.json();
          arr.push(data3);
        });
      });
      await Promise.all(promises.map(promise => promise()));
      setTopTransactionsHours(arr);

      const promises2 = [];
      let arr2 = [];
      data.map(item => {
        const url = `http://${ip}:3000/bo/Reports/GetTransactionAnalysisTopDay?storeIds=4043&weekDescription${item.WeekDescription}`;
        promises2.push(async () => {
          const response4 = await fetch(url, requestOptions);
          const data4 = await response4.json();
          arr2.push(data4);
        });
      });
      await Promise.all(promises2.map(promise => promise()));
      setTopTransactionsDay(arr2);

      const promises3 = [];
      let arr3 = [];
      data.map(item => {
        const url = `http://${ip}:3000/bo/Reports/GetTransactionsPerHours?storeIds=4043&weekDescription${item.WeekDescription}`;
        promises3.push(async () => {
          const response5 = await fetch(url, requestOptions);
          const data5 = await response5.json();
          arr3.push(data5);
        });
      });
      await Promise.all(promises3.map(promise => promise()));
      console.log(arr3);
      setTransactionsPerHours(arr3);

      const promises4 = [];
      let arr4 = [];
      data.map(item => {
        const url = `http://${ip}:3000/bo/Reports/GetTransactionsPerDay?storeIds=4043&weekDescription${item.WeekDescription}`;
        promises4.push(async () => {
          const response6 = await fetch(url, requestOptions);
          const data6 = await response6.json();
          arr4.push(data6);
        });
      });
      await Promise.all(promises4.map(promise => promise()));
      console.log(arr4);
      setTransactionsPerDay(arr4);

      const promises5 = [];
      let arr5 = [];
      data.map(item => {
        const url = `http://${ip}:3000/bo/Reports/GetAnalysisWeekHourlyTransactions?storeIds=4043&weekDescription${item.WeekDescription}`;
        promises5.push(async () => {
          const response7 = await fetch(url, requestOptions);
          const data7 = await response7.json();
          arr5.push(data7);
        });
      });
      await Promise.all(promises5.map(promise => promise()));
      console.log(arr5);
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
