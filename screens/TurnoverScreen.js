/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { selectToken } from '../features/bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import { ip } from '@env';
import DrawerHeader from './DrawerHeader';
import { useTranslation } from 'react-i18next';
import i18next from '../languages/i18n';

const TurnoverScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('screen');
  const token = useSelector(selectToken);
  const [storesFromBoApi, setStoresFromBoApi] = useState();
  const [loading, setLoading] = useState(false);
  const [fromDate1, setFromDate1] = useState(new Date());
  const [fromDate2, setFromDate2] = useState('');
  const [toDate1, setToDate1] = useState(new Date());
  const [toDate2, setToDate2] = useState('');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const fetchTurnoverDataFromBoApi = async () => {
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
        `http://${ip}:3000/bo/Invoices/GetTurnoverDetailsServerSide?fromDate=${fromDate2}&toDate=${toDate2}`,
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
    // fetchTurnoverDataFromBoApi();
  }, []);

  return (
    <SafeAreaView className="bg-gray-100 justify-center items-center">
      <TouchableOpacity style={{ width: width, zIndex: 1 }}>
        <DrawerHeader />
      </TouchableOpacity>
      {loading ? (
        <View className="w-8/12 justify-center items-center mt-2" style={{ height: height / 1.33 }}>
          <ActivityIndicator color="rgb(34 211 238)" size="large" />
        </View>
      ) : (
        <View className="w-8/12 justify-center items-center mt-2"
          style={{ height: height / 1.33 }}>
          <TouchableOpacity
            onPress={() => {
              setOpen(false);
              setOpen2(false);
              setStoresFromBoApi();
            }}
            className="p-2 my-5 bg-gray-200 border border-solid border-cyan-200 rounded-xl"
            style={{ elevation: 50 }}>
            <Text className="text-cyan-400 text-center font-bold text-3xl">
              {storesFromBoApi ? t("newSearch") : t("searchForTurnoverData")}
            </Text>
          </TouchableOpacity>

          {!storesFromBoApi ? (
            <View>
              <TouchableOpacity
                className="bg-cyan-300 rounded-xl my-2 p-2"
                onPress={() => setOpen(true)}>
                <Text className="text-center text-xl text-white">
                  {t("selectFromDate")}
                </Text>
                <DatePicker
                  locale={i18next.language}
                  modal
                  open={open}
                  date={fromDate1}
                  mode={'date'}
                  onConfirm={date => {
                    setOpen(false);
                    setFromDate1(date);
                    setFromDate2(
                      date.toISOString().slice(0, 10).concat(' 00:00:00'),
                    );
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                  cancelText={t('cancel')}  
                  confirmText={t('confirm')}
                  title={t("selectDate")}
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
                  {t("selectEndDate")}
                </Text>
                <DatePicker
                  locale={i18next.language}
                  modal
                  open={open2}
                  date={toDate1}
                  mode={'date'}
                  onConfirm={date => {
                    setOpen2(false);
                    setToDate1(date);
                    setToDate2(
                      date.toISOString().slice(0, 10).concat(' 23:59:59'),
                    );
                  }}
                  onCancel={() => {
                    setOpen2(false);
                  }}
                  cancelText={t('cancel')}  
                  confirmText={t('confirm')}
                  title={t("selectDate")}
                />
                {toDate2 !== '' && (
                  <Text className="text-center text-xl text-white">
                    {toDate2}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                onPress={() => fetchTurnoverDataFromBoApi()}>
                <Text className="text-center text-lg text-white">{t("submit")}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {storesFromBoApi && (
            <ScrollView
              className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
              style={{ elevation: 50, height: height / 1.5, marginTop: 20 }}>
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
