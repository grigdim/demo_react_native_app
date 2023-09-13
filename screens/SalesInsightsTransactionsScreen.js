/* eslint-disable quotes */
/* eslint-disable react/self-closing-comp */
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
import {selectToken, selectStoreId} from '../features/bootstrap';
import {useSelector} from 'react-redux';
import {ip} from '@env';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useTranslation} from 'react-i18next';
import SelectDropdown from 'react-native-select-dropdown';

import {
  VictoryChart,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryArea,
  VictoryBar,
  VictoryLegend,
  VictoryLine,
} from 'victory-native';

const SalesInsightsTransactionsScreen = () => {
  const {t, i18n} = useTranslation();
  const {width, height} = Dimensions.get('screen');
  const token = useSelector(selectToken);
  const storeId = useSelector(selectStoreId);
  const [loading, setLoading] = useState(false);
  const [transactionsWeeks, setTransactionsWeeks] = useState([]);
  const [selectedTransactionsWeek, setSelectedTransactionsWeek] =
    useState(null);
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

  const setColor = dayName => {
    switch (dayName) {
      case 'Sunday':
        return 'red'; // Set the color for Sunday
      case 'Monday':
        return 'blue'; // Set the color for Monday
      case 'Tuesday':
        return 'green'; // Set the color for Tuesday
      case 'Wednesday':
        return 'orange'; // Set the color for Wednesday
      case 'Thursday':
        return 'purple'; // Set the color for Thursday
      case 'Friday':
        return 'brown'; // Set the color for Friday
      case 'Saturday':
        return 'pink'; // Set the color for Saturday
      default:
        return 'gray'; // Set the color for unknown day
    }
  };

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
        // `http://${ip}:3000/bo/Reports/GetTransactionsWeeks?storeIds=4043`, // Hard coded since we don't initialize the store at the moment
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionsWeeks?storeIds=${storeId}`, // Hard coded since we don't initialize the store at the moment
        requestOptions,
      );
      const data = await response.json();
      // console.log('transaction weeks', data);
      setTransactionsWeeks(data);

      const response2 = await fetch(
        // `http://${ip}:3000/bo/Reports/GetTransactionsStoresNames?storeIds=4043`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionsStoresNames?storeIds=${storeId}`,
        requestOptions,
      );
      const data2 = await response2.json();
      // console.log('transaction stores', data2);
      setTransactionsStores(data2);
    }
    // end of request
    setLoading(false);
  };

  const fetchTopTransactionsHours = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionAnalysisTopHour?storeIds=4043&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionAnalysisTopHour?storeIds=${storeId}&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        requestOptions,
      );
      const data = await response.json();
      // console.log('top transactions hours', data);
      setTopTransactionsHours(data);
    }
  };

  const fetchTopTransactionsDays = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionAnalysisTopDay?storeIds=4043&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionAnalysisTopDay?storeIds=${storeId}&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        requestOptions,
      );
      const data = await response.json();
      // console.log('top transactions hours', data);
      setTopTransactionsDay(data);
    }
  };

  const fetchTransactionsPerHour = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionsPerHours?storeIds=4043&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionsPerHours?storeIds=${storeId}&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        requestOptions,
      );
      const data = await response.json();
      // console.log('transactions per hour', data);
      setTransactionsPerHours(data);
    }
  };

  const fetchTransactionsPerDay = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionsPerDay?storeIds=4043&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionsPerDay?storeIds=${storeId}&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        requestOptions,
      );
      const data = await response.json();
      // console.log('transactions per day', data);
      setTransactionsPerDay(data);
    }
  };

  const fetchAnalysisWeekHourlyTransactions = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetAnalysisWeekHourlyTransactions?storeIds=4043&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetAnalysisWeekHourlyTransactions?storeIds=${storeId}&weekDescription=${selectedTransactionsWeek}`, // Hard coded since we don't initialize the store at the moment
        requestOptions,
      );
      const data = await response.json();
      // console.log('analysis', data);
      const groupedData = Object.entries(
        data.reduce((result, item) => {
          const {DayName, ...rest} = item;
          if (!result[DayName]) {
            result[DayName] = [];
          }
          result[DayName].push(rest);
          return result;
        }, {}),
      ).map(([DayName, items]) => ({DayName, items}));
      setAnalysisWeekHourlyTransactions(groupedData);
    }
  };

  useEffect(() => {
    fetchTransactionsWeeks();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchTopTransactionsHours();
    fetchTopTransactionsDays();
    fetchTransactionsPerHour();
    fetchTransactionsPerDay();
    fetchAnalysisWeekHourlyTransactions();
    setLoading(false);
  }, [selectedTransactionsWeek]);

  return (
    <ScrollView className="space-y-2">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View>
          <View>
            <SelectDropdown
              defaultButtonText="Select a week"
              dropdownStyle={{
                backgroundColor: 'lightgray',
              }}
              buttonStyle={{
                width: '100%',
                backgroundColor: 'rgb(229 231 235)',
              }}
              buttonTextStyle={{color: 'rgb(23 37 84)'}}
              data={transactionsWeeks.map(item => item.WeekDescription) || []}
              // defaultValue={}
              onSelect={(selectedItem, index) => {
                setSelectedTransactionsWeek(selectedItem); //
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </View>
          <View>
            {/*Transactions per hour start*/}
            {transactionsPerHours.length > 0 && (
              <ScrollView horizontal className="w-full">
                <View
                  className="flex-1 justify-center bg-white mx-2 rounded-lg my-6"
                  style={{elevation: 10}}>
                  <View className="bg-slate-500 p-3 rounded-t-lg">
                    <Text className="text-white underline">
                      {t('TransactionsPerHour')}
                    </Text>
                  </View>
                  <VictoryChart
                    theme={VictoryTheme.material}
                    height={height / 2}
                    padding={{top: 25, left: 50, bottom: 50, right: 25}}
                    domainPadding={{y: 50}}>
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
                      data={transactionsPerHours.map(item => ({
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
                      {t('TransactionsPerDay')}
                    </Text>
                  </View>
                  <VictoryChart
                    theme={VictoryTheme.material}
                    height={height / 2}
                    padding={{top: 25, left: 50, bottom: 50, right: 25}}
                    domainPadding={{x: [30, 0], y: 50}}>
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
                      data={transactionsPerDay.map(item => {
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
            {/*Analysis Week Hourly Transactions start*/}
            {analysisWeekHourlyTransactions.length > 0 && (
              <ScrollView horizontal className="w-full">
                <View
                  className="flex-1 justify-center bg-white mx-2 rounded-lg my-6"
                  style={{elevation: 10}}>
                  <View className="bg-slate-500 p-3 rounded-t-lg">
                    <Text className="text-white underline">
                      {t('WeeklyAnalysisOfHourlyTransactions')}
                    </Text>
                  </View>
                  <VictoryChart
                    theme={VictoryTheme.material}
                    height={height / 2}
                    padding={{top: 100, left: 50, bottom: 50, right: 25}}>
                    <VictoryLegend
                      orientation="horizontal"
                      itemsPerRow={4}
                      x={30}
                      y={10}
                      style={{
                        title: {fontSize: 20},
                        labels: {fill: 'rgb(100 116 139)'},
                      }}
                      data={analysisWeekHourlyTransactions.map(item => ({
                        name: item.DayName,
                        symbol: {fill: setColor(item.DayName)},
                      }))}
                    />
                    {analysisWeekHourlyTransactions.map((item, index) => {
                      return (
                        <VictoryLine
                          style={{data: {stroke: setColor(item.DayName)}}}
                          key={index}
                          data={item.items?.map(innerItem => {
                            return {
                              x: parseInt(innerItem.MilitaryHour, 10),
                              y: innerItem.Transactions,
                            };
                          })}
                        />
                      );
                    })}
                  </VictoryChart>
                </View>
              </ScrollView>
            )}
            {/*Analysis Week Hourly Transactions end*/}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SalesInsightsTransactionsScreen;
