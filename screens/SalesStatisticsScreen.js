/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  processColor,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {selectToken} from '../features/bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {ip} from '@env';
import Icon from 'react-native-vector-icons/AntDesign';

const SalesStatisticsScreen = () => {
  const token = useSelector(selectToken);
  const {width, height} = Dimensions.get('screen');
  const [loading, setLoading] = useState(false);
  const [groupByDate, setGroupByDate] = useState('MONTH');
  const [salesData, setSalesData] = useState();
  const [turnover, setTurnover] = useState();
  const [totalProfit, setTotalProfit] = useState();
  const [productSales, setProductSales] = useState();
  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return today;
  });
  const [fromDateFormatted, setFromDateFormatted] = useState('');
  const [toDate, setToDate] = useState(new Date());
  const [toDateFormatted, setToDateFormatted] = useState('');
  const [storesIds, setStoresIds] = useState([1]);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [sftId, setSftId] = useState(1);
  const [turnoverDetails, setTurnoverDetails] = useState(false);

  const handleChangeSftId = inputText => {
    setSftId(inputText);
  };

  const fetchDataFromBoApi = async () => {
    setLoading(true);
    console.log(
      fromDateFormatted,
      toDateFormatted,
      sftId,
      groupByDate,
      storesIds,
      token,
    );
    if (__DEV__ && token) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var raw = JSON.stringify({
        fromDate: fromDateFormatted,
        toDate: toDateFormatted,
        sftId: sftId,
        groupByDate: groupByDate,
        storesIds: storesIds,
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw,
      };

      const response = await fetch(
        `http://${ip}:3000/bo/Invoices/FetchSalesDataServerSide`,
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
      setSalesData(data);
      console.log('====================================');
      console.log('Sales data: ');
      console.log(data);
      console.log('====================================');
    }
    // end of request
    setLoading(false);
  };

  useEffect(() => {
    setFromDateFormatted(
      fromDate.toISOString().slice(0, 10).concat(' 00:00:00'),
    );
    setToDateFormatted(toDate.toISOString().slice(0, 10).concat(' 23:59:59'));
  }, []);

  useEffect(() => {
    fromDateFormatted !== null &&
      fromDateFormatted !== undefined &&
      toDateFormatted !== null &&
      toDateFormatted !== undefined &&
      fetchDataFromBoApi();
  }, [fromDateFormatted, toDateFormatted]);

  const handleGroupByChange = value => {
    let date = new Date();
    setGroupByDate(value);
    switch (value) {
      case 'DAY':
        setFromDate(date);
        setFromDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 00:00:00');
        });
        setToDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 23:59:59');
        });
        break;
      case 'WEEK':
        let oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        setFromDate(oneWeekAgo);
        setFromDateFormatted(() => {
          return oneWeekAgo.toISOString().slice(0, 10).concat(' 00:00:00');
        });
        setToDate(date);
        setToDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 23:59:59');
        });
        break;
      case 'MONTH':
        let oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        setFromDate(oneMonthAgo);
        setFromDateFormatted(() => {
          return oneMonthAgo.toISOString().slice(0, 10).concat(' 00:00:00');
        });
        setToDate(date);
        setToDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 23:59:59');
        });
        break;
      default:
        console.log('Value is not "a", "b", or "c"');
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-200">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View className="w-11/12 my-20 space-y-3">
          {/*Date picker start*/}
          <View className="mx-4 space-y-1">
            <TouchableOpacity className="bg-gray-100 border rounded-sm items-center justify-center h-12">
              <Picker
                style={{
                  width: 150,
                }}
                selectedValue={groupByDate}
                onValueChange={itemValue => {
                  handleGroupByChange(itemValue);
                }}>
                <Picker.Item label="DAY" value="DAY" />
                <Picker.Item label="WEEK" value="WEEK" />
                <Picker.Item label="MONTH" value="MONTH" />
              </Picker>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 border-solid border border-blue-950 rounded-sm p-2 flex-row justify-evenly"
              onPress={() => setOpenFromDate(true)}>
              <Text className="text-center text-xl text-blue-950">
                From Date
              </Text>
              <DatePicker
                modal
                open={openFromDate}
                date={fromDate}
                mode={'date'}
                onConfirm={date => {
                  setOpenFromDate(false);
                  setFromDate(date);
                  setFromDateFormatted(
                    date.toISOString().slice(0, 10).concat(' 00:00:00'),
                  );
                }}
                onCancel={() => {
                  setOpenFromDate(false);
                }}
              />
              {fromDateFormatted !== '' && (
                <Text className="text-center text-xl text-blue-950">
                  {fromDateFormatted}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 border-solid border border-blue-950 rounded-sm p-2 flex-row justify-evenly"
              onPress={() => setOpenToDate(true)}>
              <Text className="text-center text-xl text-blue-950">
                End Date
              </Text>
              <DatePicker
                modal
                open={openToDate}
                date={toDate}
                mode={'date'}
                onConfirm={date => {
                  setOpenToDate(false);
                  setToDate(date);
                  setToDateFormatted(
                    date.toISOString().slice(0, 10).concat(' 23:59:59'),
                  );
                }}
                onCancel={() => {
                  setOpenToDate(false);
                }}
              />
              {toDateFormatted !== '' && (
                <Text className="text-center text-xl text-blue-950">
                  {toDateFormatted}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {/*Date picker end*/}
          {/*Widgets start*/}
          <ScrollView className="space-y-3">
            {/*Turnover widget start*/}
            <View className="mx-4 bg-white" style={{elevation: 10}}>
              <View className="bg-yellow-500 p-3">
                <Text className="text-center text-white underline underline-offset-8">
                  Turnover:
                </Text>
              </View>
              <View className="bg-yellow-400 p-8">
                <Text className="text-center text-white font-bold text-xl">
                  {salesData.TotalSalesDtos.reduce(
                    (accumulator, currentObject) => {
                      return accumulator + currentObject.TurnoverWithVat;
                    },
                    0,
                  )}{' '}
                  €
                </Text>
                <Text className="text-center text-white"> with VAT</Text>
              </View>
              {!turnoverDetails ? (
                <View className="divide-y divide-yellow-400">
                  <View className="flex-row justify-evenly items-center py-8">
                    <View>
                      <Text className="text-center text-yellow-400 text-lg font-bold">
                        {salesData.TotalSalesDtos.reduce(
                          (accumulator, currentObject) => {
                            return (
                              accumulator + currentObject.TurnoverWithoutVat
                            );
                          },
                          0,
                        ).toFixed(2)}
                        €
                      </Text>
                      <Text className="text-center text-yellow-400">
                        without VAT
                      </Text>
                    </View>
                    <View>
                      <Text className="text-center text-yellow-400 text-lg font-bold">
                        {salesData.TotalSalesDtos.reduce(
                          (accumulator, currentObject) => {
                            return accumulator + currentObject.TurnoverVatTotal;
                          },
                          0,
                        ).toFixed(2)}
                        €
                      </Text>
                      <Text className="text-center text-yellow-400">
                        VAT total
                      </Text>
                    </View>
                    <View>
                      <Text className="text-center text-yellow-400 text-lg font-bold">
                        {(
                          salesData.TotalSalesDtos.reduce(
                            (accumulator, currentObject) => {
                              return (
                                accumulator + currentObject.TurnoverWithVat
                              );
                            },
                            0,
                          ).toFixed(2) /
                          ((toDate - fromDate) / 1000 / 60 / 60)
                        ).toFixed(2)}
                        €
                      </Text>
                      <Text className="text-center text-yellow-400">
                        Average Per Day
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className="py-2 flex-row space-x-2 justify-center items-center"
                    onPress={() => setTurnoverDetails(true)}>
                    <Text className="text-center text-yellow-500 font-bold">
                      More Details
                    </Text>
                    <Icon name="arrowright" size={15} color="rgb(234 179 8)" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View className="flex-row items-center justify-between px-4">
                    <Text className="text-center text-blue-950 py-2">
                      Turnover Details
                    </Text>
                    <TouchableOpacity
                      className="py-2 flex-row space-x-2 justify-center items-center"
                      onPress={() => setTurnoverDetails(false)}>
                      <Icon name="close" size={15} color="rgb(23 37 84)" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row space-x-14 bg-yellow-400 py-2 items-center justify-center">
                    <Text className="text-xs text-white">asdf</Text>
                    <Text className="text-xs text-white">asdf</Text>
                    <Text className="text-xs text-white">asdf</Text>
                    <Text className="text-xs text-white">asdf</Text>
                    <Text className="text-xs text-white">asdf</Text>
                  </View>
                  <ScrollView className="h-20 divide-y divide-gray-400">
                    <View className="py-2 px-4 flex-row space-x-14 items-center justify-center">
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                    </View>
                    <View className="py-2 px-4 flex-row space-x-14 items-center justify-center">
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                    </View>
                    <View className="py-2 px-4 flex-row space-x-14 items-center justify-center">
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                    </View>
                    <View className="py-2 px-4 flex-row space-x-14 items-center justify-center">
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
            {/*Turnover widget end*/}
            {/*Profit widget start*/}
            <View className="mx-4 bg-white" style={{elevation: 10}}>
              <View className="bg-purple-500 p-3">
                <Text className="text-center text-white underline underline-offset-8">
                  Profit:
                </Text>
              </View>
              <View className="bg-purple-400 p-8">
                <Text className="text-center text-white font-bold text-xl">
                  {salesData.TotalSalesDtos.reduce(
                    (accumulator, currentObject) => {
                      return accumulator + currentObject.TotalProfitWithVat;
                    },
                    0,
                  )}{' '}
                  €
                </Text>
                <Text className="text-center text-white"> with VAT</Text>
              </View>
              {!turnoverDetails ? (
                <View className="divide-y divide-purple-400">
                  <View className="flex-row justify-evenly items-center py-8">
                    <View>
                      <Text className="text-center text-purple-400 text-lg font-bold">
                        {salesData.TotalSalesDtos.reduce(
                          (accumulator, currentObject) => {
                            return (
                              accumulator + currentObject.TotalProfitWithoutVat
                            );
                          },
                          0,
                        ).toFixed(2)}
                        €
                      </Text>
                      <Text className="text-center text-purple-400">
                        without VAT
                      </Text>
                    </View>
                    <View>
                      <Text className="text-center text-purple-400 text-lg font-bold">
                        {(
                          (salesData.TotalSalesDtos.reduce(
                            (accumulator, currentObject) => {
                              return (
                                accumulator + currentObject.TotalProfitWithVat
                              );
                            },
                            0,
                          ) /
                            salesData.TotalSalesDtos.reduce(
                              (accumulator, currentObject) => {
                                return (
                                  accumulator + currentObject.TurnoverWithVat
                                );
                              },
                              0,
                            )) *
                          100
                        ).toFixed(2)}
                        %
                      </Text>
                      <Text className="text-center text-purple-400">
                        profit as a percentage
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className="py-2 flex-row space-x-2 justify-center items-center"
                    onPress={() => setTurnoverDetails(true)}>
                    <Text className="text-center text-purple-500 font-bold">
                      More Details
                    </Text>
                    <Icon name="arrowright" size={15} color="rgb(234 179 8)" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View className="flex-row items-center justify-between px-4">
                    <Text className="text-center text-blue-950 py-2">
                      Turnover Details
                    </Text>
                    <TouchableOpacity
                      className="py-2 flex-row space-x-2 justify-center items-center"
                      onPress={() => setTurnoverDetails(false)}>
                      <Icon name="close" size={15} color="rgb(23 37 84)" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row space-x-14 bg-yellow-400 py-2 items-center justify-center">
                    <Text className="text-xs text-white">asdf</Text>
                    <Text className="text-xs text-white">asdf</Text>
                    <Text className="text-xs text-white">asdf</Text>
                    <Text className="text-xs text-white">asdf</Text>
                    <Text className="text-xs text-white">asdf</Text>
                  </View>
                  <ScrollView className="h-20 divide-y divide-gray-400">
                    <View className="py-2 px-4 flex-row space-x-14 items-center justify-center">
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                    </View>
                    <View className="py-2 px-4 flex-row space-x-14 items-center justify-center">
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                    </View>
                    <View className="py-2 px-4 flex-row space-x-14 items-center justify-center">
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                    </View>
                    <View className="py-2 px-4 flex-row space-x-14 items-center justify-center">
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                      <Text className="text-blue-950 text-xs font-bold">
                        asdf
                      </Text>
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
            {/*Profit widget end*/}
          </ScrollView>
          {/*Widgets end*/}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '50%',
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    padding: 10,
    color: 'black',
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default SalesStatisticsScreen;
