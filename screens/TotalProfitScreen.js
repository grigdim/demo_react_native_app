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
import DatePicker from 'react-native-date-picker';
import {ip} from '@env';

const TotalProfitScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [storesFromBoApi, setStoresFromBoApi] = useState();
  const [loading, setLoading] = useState(false);
  const [fromDate1, setFromDate1] = useState(new Date());
  const [fromDate2, setFromDate2] = useState('');
  const [toDate1, setToDate1] = useState(new Date());
  const [toDate2, setToDate2] = useState('');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

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
        `http://${ip}:3000/bo/Invoices/GetTotalProfitDetailsServerSide?fromDate=${fromDate}&toDate=${toDate}&storesIds=1`,
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
        <View className="mb-20 mx-5">

        <TouchableOpacity
            onPress={() => {
              setOpen(false);
              setOpen2(false);
              setStoresFromBoApi();
            }}
            className="p-2 my-5 bg-gray-200 border border-solid border-green-200 rounded-xl"
            style={{elevation: 50}}>
            <Text className="text-green-400 text-center font-bold text-3xl">
              {storesFromBoApi ? 'New search' : 'Search for total profit data'}
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
                  date={fromDate1}
                  mode={'date'}
                  onConfirm={date => {
                    setOpen2(false);
                    setFromDate1(date);
                    setFromDate2(
                      date.toISOString().slice(0, 10).concat(' 00:00:00'),
                    );
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
                {fromDate2 !== '' && (
                  <Text className="text-center text-xl text-white">
                    {fromDate2}
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
                  date={toDate1}
                  mode={'date'}
                  onConfirm={date => {
                    setOpen(false);
                    setToDate1(date);
                    setToDate2(
                      date.toISOString().slice(0, 10).concat(' 23:59:59'),
                    );
                  }}
                  onCancel={() => {
                    setOpen2(false);
                  }}
                />
                {toDate2 !== '' && (
                  <Text className="text-center text-xl text-white">
                    {toDate2}
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

          {/* <View
            className="py-2 my-5 bg-gray-200 border border-solid border-green-200 rounded-xl"
            style={{elevation: 50}}>
            <Text className="text-green-400 text-center font-bold text-3xl">
              Total Profit Data
            </Text>
          </View> */}

          {storesFromBoApi && (
          <ScrollView
            className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
            style={{elevation: 50}}>
            {storesFromBoApi?.map(x => (
              <View className="p-2 bg-gray-200" key={x.Level}>
                <Text className="m-1 text-xl text-black">Level: {x.Level}</Text>
                <Text className="m-1 text-xl text-black">
                  VAT: {x.TotalProfitVat}
                </Text>
                <Text className="m-1 text-xl text-black">
                  Total profit with vat: {x.TotalProfitWithVAT} €
                </Text>
                <Text className="m-1 text-xl text-black">
                  Total profit without vat: {x.TotalProfitWithoutVAT} %
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

export default TotalProfitScreen;
