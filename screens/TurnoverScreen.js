/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {selectToken} from '../features/bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {ip} from '@env';

const TurnoverScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [storesFromBoApi, setStoresFromBoApi] = useState();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [date, setDate] = useState(new Date());

  const fetchTotalProfitDataFromBoApi = async () => {
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
        `http://${ip}:3000/bo/Invoices/GetTurnoverDetailsServerSide?fromDate=${fromDate}&toDate=${toDate}`,
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
      setStoresFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  useEffect(() => {
    // fetchTotalProfitDataFromBoApi();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View className="w-8/12 justify-center mt-2">
          <TouchableOpacity
            onPress={() => {
              setOpen(false);
              setOpen2(false);
              setStoresFromBoApi();
            }}
            className="p-2 my-5 bg-gray-200 border border-solid border-cyan-200 rounded-xl"
            style={{elevation: 50}}>
            <Text className="text-cyan-400 text-center font-bold text-3xl">
              {storesFromBoApi ? 'New search' : 'Search for turnover data'}
            </Text>
          </TouchableOpacity>
          {!storesFromBoApi ? (
            <View>
              <TouchableOpacity
                className="bg-cyan-300 rounded-xl my-2 p-2"
                onPress={() => setOpen(true)}>
                <Text className="text-center text-xl text-white">
                  Select From Date
                </Text>
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  mode={'date'}
                  onConfirm={date => {
                    setOpen(false);
                    setFromDate(
                      date.toISOString().slice(0, 10).concat(' 00:00:00'),
                    );
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
                {fromDate !== '' && (
                  <Text className="text-center text-xl text-white">
                    {fromDate}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-300 rounded-xl my-2 p-2"
                onPress={() => setOpen2(true)}>
                <Text className="text-center text-xl text-white">
                  Select End Date
                </Text>
                <DatePicker
                  modal
                  open={open2}
                  date={date}
                  mode={'date'}
                  onConfirm={date => {
                    setOpen2(false);
                    setToDate(
                      date.toISOString().slice(0, 10).concat(' 23:59:59'),
                    );
                  }}
                  onCancel={() => {
                    setOpen2(false);
                  }}
                />
                {toDate !== '' && (
                  <Text className="text-center text-xl text-white">
                    {toDate}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                onPress={() => fetchTotalProfitDataFromBoApi()}>
                <Text className="text-center text-lg text-white">Submit</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {storesFromBoApi && (
            <ScrollView
              className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
              style={{elevation: 50}}>
              {storesFromBoApi?.map(x => (
                <View className="p-2 bg-gray-200" key={x.AvgPerDay}>
                  <Text className="m-1 text-xl text-black">
                    Average Per Day: {x.AvgPerDay}
                  </Text>
                  <Text className="m-1 text-xl text-black">
                    Level: {x.Level}
                  </Text>
                  <Text className="m-1 text-xl text-black">
                    Turnover vat total: {x.TurnoverVatTotal} €
                  </Text>
                  <Text className="m-1 text-xl text-black">
                    Turnover without vat: {x.TurnoverWithoutVat} %
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default TurnoverScreen;
