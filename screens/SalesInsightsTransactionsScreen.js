/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {selectToken} from '../features/bootstrap';
import {useSelector} from 'react-redux';
import {ip} from '@env';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useTranslation} from 'react-i18next';
import {
  VictoryLegend,
  VictoryChart,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryArea,
  VictoryTooltip,
  VictoryBar,
} from 'victory-native';

const SalesInsightsTransactionsScreen = () => {
  const {width, height} = Dimensions.get('screen');
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(false);
  const [transactionsWeeks, setTransactionsWeeks] = useState([]);
  const [transactionsStores, setTransactionsStores] = useState([]);
  const [topTransactionsHours, setTopTransactionsHours] = useState([]);
  const [topTransactionsDay, setTopTransactionsDay] = useState([]);
  const [transactionsPerHours, setTransactionsPerHours] = useState([]);
  const [transactionsPerDay, setTransactionsPerDay] = useState([]);
  const [analysisWeekHourlyTransactions, setAnalysisWeekHourlyTransactions] =
    useState([]);
  const dayOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

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
              arr3.push({week: item.WeekDescription, data: data5});
            }),
        );
      });
      await Promise.all(promises3);
      let arr3Formatted = arr3.sort((a, b) => {
        const [dayA, monthA, yearA] = a.week.split('/').map(Number);
        const [dayB, monthB, yearB] = b.week.split('/').map(Number);

        if (yearA !== yearB) {
          return yearA - yearB; // Compare years
        } else if (monthA !== monthB) {
          return monthA - monthB; // Compare months
        } else {
          return dayA - dayB; // Compare days
        }
      });

      // console.log('transactions per hours', arr3Formatted);
      setTransactionsPerHours(arr3Formatted);

      const promises4 = [];
      let arr4 = [];
      data.forEach(item => {
        const url = `http://${ip}:3000/bo/Reports/GetTransactionsPerDay?storeIds=4043&weekDescription=${item.WeekDescription}`;
        promises4.push(
          fetch(url, requestOptions)
            .then(response6 => response6.json())
            .then(data6 => {
              arr4.push({week: item.WeekDescription, data: data6});
            }),
        );
      });
      await Promise.all(promises4);
      let arr4Formatted = arr4.sort((a, b) => {
        const [dayA, monthA, yearA] = a.week.split('/').map(Number);
        const [dayB, monthB, yearB] = b.week.split('/').map(Number);

        if (yearA !== yearB) {
          return yearA - yearB; // Compare years
        } else if (monthA !== monthB) {
          return monthA - monthB; // Compare months
        } else {
          return dayA - dayB; // Compare days
        }
      });
      console.log('transactions per day', arr4Formatted[0]);
      setTransactionsPerDay(arr4Formatted);

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
      // console.log('analysis week hourly transactions', arr5);
      setAnalysisWeekHourlyTransactions(arr5);
    }
    // end of request
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactionsWeeks();
  }, []);

  return (
    <ScrollView className="space-y-2">
      {/*Transactions per hour start*/}
      {transactionsPerHours.length > 0 && (
        <ScrollView horizontal className="w-full">
          <View
            className="flex-1 justify-center bg-white mx-2 rounded-lg my-6"
            style={{elevation: 10}}>
            <View className="bg-slate-500 p-3 rounded-t-lg">
              <Text className="text-white underline">
                Transactions per hour
              </Text>
            </View>
            <VictoryChart
              theme={VictoryTheme.material}
              height={height / 2}
              padding={{top: 25, left: 50, bottom: 50, right: 25}}
              domainPadding={{y: 50}}>
              <VictoryLegend
                orientation="horizontal"
                itemsPerRow={2}
                x={30}
                y={10}
                style={{
                  title: {fontSize: 20},
                  labels: {fill: 'white'},
                }}
                data={[]}
              />
              {/*x axis start*/}
              <VictoryAxis
                fixLabelOverlap={true}
                style={{
                  grid: {stroke: 'lightgray', strokeDasharray: 'none'},
                  axis: {stroke: 'lightgray'},
                  ticks: {stroke: 'lightgray'},
                  tickLabels: {fill: 'lightgray'},
                }}
              />
              {/*x axis end*/}
              {/*y axis start*/}
              <VictoryAxis
                dependentAxis
                style={{
                  grid: {stroke: 'lightgray', strokeDasharray: 'none'},
                  axis: {stroke: 'lightgray'},
                  ticks: {stroke: 'lightgray'},
                  tickLabels: {fill: 'lightgray'},
                }}
              />
              {/*y axis end*/}
              {/*turnover with vat start*/}
              <VictoryArea
                interpolation="natural"
                data={transactionsPerHours[0].data.map(item => ({
                  x: item.MilitaryHour,
                  y: item.Transactions,
                }))}
                style={{
                  data: {fill: 'rgba(162, 247, 2, 0.3)'},
                }}
                animate={{
                  duration: 1000,
                  onLoad: {duration: 1000},
                }}
              />
              {/*turnover with vat end*/}
            </VictoryChart>
          </View>
        </ScrollView>
      )}
      {/*Transactions per hour end*/}
      {/*Transactions per day start*/}
      {transactionsPerDay.length > 0 && (
        <ScrollView horizontal className="w-full">
          <View
            className="flex-1 justify-center bg-white mx-2 rounded-lg my-6"
            style={{elevation: 10}}>
            <View className="bg-slate-500 p-3 rounded-t-lg">
              <Text className="text-white underline">
                Transactions per hour
              </Text>
            </View>
            <VictoryChart
              theme={VictoryTheme.material}
              height={height / 2}
              padding={{top: 25, left: 50, bottom: 50, right: 25}}
              domainPadding={{x: [30, 0], y: 50}}>
              <VictoryLegend
                orientation="horizontal"
                itemsPerRow={2}
                x={30}
                y={10}
                style={{
                  title: {fontSize: 20},
                  labels: {fill: 'white'},
                }}
                data={[]}
              />
              {/*x axis start*/}
              <VictoryAxis
                fixLabelOverlap={true}
                style={{
                  grid: {stroke: 'lightgray', strokeDasharray: 'none'},
                  axis: {stroke: 'lightgray'},
                  ticks: {stroke: 'lightgray'},
                  tickLabels: {fill: 'lightgray'},
                }}
              />
              {/*x axis end*/}
              {/*y axis start*/}
              <VictoryAxis
                dependentAxis
                style={{
                  grid: {stroke: 'lightgray', strokeDasharray: 'none'},
                  axis: {stroke: 'lightgray'},
                  ticks: {stroke: 'lightgray'},
                  tickLabels: {fill: 'lightgray'},
                }}
              />
              {/*y axis end*/}

              <VictoryBar
                alignment="center"
                data={transactionsPerDay[0].data.map(item => {
                  console.log(item);
                  return {
                    x: item.DayName,
                    y: item.Transactions,
                  };
                })}
                style={{
                  data: {fill: 'red'},
                  labels: {fill: 'white'},
                }}
                animate={{
                  duration: 1000,
                  onLoad: {duration: 1000},
                }}
                labels={({datum}) => datum.y}
                labelComponent={<VictoryLabel dy={30} />}
              />
            </VictoryChart>
          </View>
        </ScrollView>
      )}
      {/*Transactions per day end*/}
    </ScrollView>
  );
};

export default SalesInsightsTransactionsScreen;
