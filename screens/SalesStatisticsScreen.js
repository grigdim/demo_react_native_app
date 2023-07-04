/* eslint-disable no-dupe-keys */
/* eslint-disable curly */
/* eslint-disable react/self-closing-comp */
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
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {selectToken} from '../features/bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {ip} from '@env';
import Icon from 'react-native-vector-icons/AntDesign';
import {Table, Row} from 'react-native-table-component';

const SalesStatisticsScreen = () => {
  const token = useSelector(selectToken);
  const {width, height} = Dimensions.get('screen');
  const [loading, setLoading] = useState(true);
  const [groupByDate, setGroupByDate] = useState('MONTH');
  const [salesData, setSalesData] = useState();
  const [totals, setTotals] = useState();
  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return today;
  });
  const [fromDateFormatted, setFromDateFormatted] = useState(
    fromDate.toISOString().slice(0, 10).concat(' 00:00:00'),
  );
  const [toDate, setToDate] = useState(new Date());
  const [toDateFormatted, setToDateFormatted] = useState(
    toDate.toISOString().slice(0, 10).concat(' 23:59:59'),
  );
  const [storesIds, setStoresIds] = useState([1]);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [sftId, setSftId] = useState(1);
  const [turnoverDetails, setTurnoverDetails] = useState(false);
  const [profitDetails, setProfitDetails] = useState(false);
  const [turnoverTableHeaders, setTurnoverTableHeaders] = useState([]);
  const [turnoverTableData, setTurnoverTableData] = useState([]);
  const [profitTableHeaders, setProfitTableHeaders] = useState([]);
  const [profitTableData, setProfitTableData] = useState([]);

  const handleChangeSftId = inputText => {
    setSftId(inputText);
  };

  const fetchDataFromBoApi = async () => {
    setLoading(true);
    // console.log(
    // fromDateFormatted,
    // toDateFormatted,
    //   sftId,
    //   groupByDate,
    //   storesIds,
    //   token,
    // );
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
      try {
        const response = await fetch(
          `http://${ip}:3000/bo/Invoices/FetchSalesDataServerSide`,
          requestOptions,
        );
        const data = await response.json();
        setSalesData(data);
        setTotals(() => {
          return data.TotalSalesDtos.filter(d => d.Level === 'Total');
        });
        setTurnoverTableHeaders(
          Object.keys(data?.TotalSalesDtos[0])
            .filter(
              key =>
                key !== 'TotalProfitWithVat' &&
                key !== 'TotalProfitWithoutVat' &&
                key !== 'TotalProfitVat' &&
                key !== 'TotalProfitPercentage',
            )
            .map(key => {
              return key.replace(/(?!^)([A-Z])/g, ' $1');
            }),
        );
        setTurnoverTableData(
          data?.TotalSalesDtos?.filter(item => item.Level !== 'Total')
            .sort((a, b) => a.Level - b.Level)
            .map(item => {
              const filteredItem = Object.keys(item).reduce((acc, key) => {
                if (
                  [
                    'AvgPerDay',
                    'Level',
                    'TurnoverVatTotal',
                    'TurnoverWithVat',
                    'TurnoverWithoutVat',
                  ].includes(key)
                ) {
                  acc[key] = item[key];
                }
                return acc;
              }, {});
              let dataRow = [];
              Object.keys(filteredItem).forEach(key => {
                if (key === 'Level') {
                  dataRow.push(filteredItem[key]);
                } else {
                  dataRow.push(filteredItem[key] + ' €');
                }
              });
              return dataRow;
            }),
        );

        setProfitTableHeaders(
          Object.keys(data?.TotalSalesDtos[0])
            .filter(
              key =>
                key !== 'TotalProfitPercentage' &&
                key !== 'TurnoverWithVat' &&
                key !== 'TurnoverWithoutVat' &&
                key !== 'TurnoverVatTotal' &&
                key !== 'AvgPerDay',
            )
            .map(key => {
              return key.replace(/(?!^)([A-Z])/g, ' $1');
            }),
        );
        setProfitTableData(
          data?.TotalSalesDtos?.filter(item => item.Level !== 'Total')
            .sort((a, b) => a.Level - b.Level)
            .map(item => {
              const filteredItem = Object.keys(item).reduce((acc, key) => {
                if (
                  [
                    'Level',
                    'TotalProfitVat',
                    'TotalProfitWithVat',
                    'TotalProfitWithoutVat',
                  ].includes(key)
                ) {
                  acc[key] = item[key];
                }
                return acc;
              }, {});
              let dataRow = [];
              Object.keys(filteredItem).forEach(key => {
                if (key === 'Level') {
                  dataRow.push(filteredItem[key]);
                } else {
                  dataRow.push(filteredItem[key] + ' €');
                }
              });
              return dataRow;
            }),
        );
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
  };

  // useEffect(() => {
  //   console.log('====================================');
  //   console.log('SalesDataDtos: ', salesData?.TotalSalesDtos);
  //   console.log('====================================');
  // }, [salesData]);

  useEffect(() => {
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
        <View className="w-full h-full space-y-3" style={{elevation: 10}}>
          {/*Date picker start*/}
          <View className="space-y-1 m-2">
            <TouchableOpacity className="bg-gray-100 border rounded-sm items-center justify-center h-12">
              <Picker
                style={{
                  width: 150,
                  color: 'rgb(23 37 84)',
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
              className="bg-gray-200 border-solid border border-blue-950 rounded-sm p-2 flex-row justify-center space-x-1"
              onPress={() => setOpenFromDate(true)}>
              <Text className="text-center text-base text-blue-950">
                From Date:
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
                <Text className="text-center text-base text-blue-950">
                  {fromDateFormatted}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 border-solid border border-blue-950 rounded-sm p-2 flex-row justify-center space-x-1"
              onPress={() => setOpenToDate(true)}>
              <Text className="text-center text-base text-blue-950">
                End Date:
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
                <Text className="text-center text-base text-blue-950">
                  {toDateFormatted}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {/*Date picker end*/}

          {/*Widgets start*/}

          {salesData !== undefined && salesData !== null ? (
            <ScrollView className="space-y-3 mx-2" style={{elevation: 10}}>
              {/*Turnover widget start*/}
              <View className="bg-white" style={{elevation: 10}}>
                <View className="bg-yellow-500 p-3">
                  <Text className="text-center text-white underline underline-offset-8">
                    Turnover:
                  </Text>
                </View>
                <View className="bg-yellow-400 p-8">
                  <Text className="text-center text-white font-bold text-xl">
                    {totals[0].TurnoverWithVat}€
                  </Text>
                  <Text className="text-center text-white"> with VAT</Text>
                </View>
                {!turnoverDetails ? (
                  <View className="divide-y divide-yellow-400">
                    <View className="flex-row justify-evenly items-center py-8">
                      <View>
                        <Text className="text-center text-yellow-400 text-lg font-bold">
                          {totals[0].TurnoverWithoutVat} €
                        </Text>
                        <Text className="text-center text-yellow-400">
                          without VAT
                        </Text>
                      </View>
                      <View>
                        <Text className="text-center text-yellow-400 text-lg font-bold">
                          {totals[0].TurnoverVatTotal}€
                        </Text>
                        <Text className="text-center text-yellow-400">
                          VAT total
                        </Text>
                      </View>
                      <View>
                        <Text className="text-center text-yellow-400 text-lg font-bold">
                          {totals[0].AvgPerDay}€
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
                      <Icon
                        name="arrowright"
                        size={15}
                        color="rgb(234 179 8)"
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View>
                      <TouchableOpacity
                        className="flex-row items-center justify-between px-4"
                        onPress={() => setTurnoverDetails(false)}>
                        <Text className="text-center text-blue-950 py-2">
                          Turnover Details
                        </Text>
                        <Icon name="close" size={15} color="rgb(23 37 84)" />
                      </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                      {/*more details start*/}
                      <ScrollView horizontal>
                        <Table
                          style={{
                            flex: 1,
                            backgroundColor: '#fff',
                          }}>
                          <Row
                            data={turnoverTableHeaders}
                            style={{
                              alignContent: 'center',
                              backgroundColor: 'rgb(250 204 21)',
                              paddingRight: 2,
                              paddingLeft: 2,
                            }}
                            textStyle={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 12,
                            }}
                            widthArr={[100, 100, 100, 100, 100]}
                          />
                          <View className="divide-y divide-gray-200">
                            {turnoverTableData.map((row, index) => (
                              <Row
                                key={index}
                                style={{
                                  alignContent: 'center',
                                  paddingTop: 4,
                                  paddingBottom: 4,
                                  paddingLeft: 2,
                                  paddingRight: 2,
                                  height: 25,
                                }}
                                textStyle={{
                                  textAlign: 'center',
                                  fontSize: 12,
                                  color: 'black',
                                }}
                                widthArr={[100, 100, 100, 100, 100]}
                                data={row}
                              />
                            ))}
                          </View>
                        </Table>
                      </ScrollView>
                      {/*more details end*/}
                    </View>
                  </View>
                )}
              </View>
              {/*Turnover widget end*/}
              {/*Profit widget start*/}
              <View className="bg-white" style={{elevation: 10}}>
                <View className="bg-purple-500 p-3">
                  <Text className="text-center text-white underline">
                    Profit:
                  </Text>
                </View>
                <View className="bg-purple-400 p-8">
                  <Text className="text-center text-white font-bold text-xl">
                    {totals[0].TotalProfitWithVat}€
                  </Text>
                  <Text className="text-center text-white"> with VAT</Text>
                </View>
                {!profitDetails ? (
                  <View className="divide-y divide-purple-400">
                    <View className="flex-row justify-evenly items-center py-8">
                      <View>
                        <Text className="text-center text-purple-400 text-lg font-bold">
                          {totals[0].TotalProfitWithoutVat}€
                        </Text>
                        <Text className="text-center text-purple-400">
                          without VAT
                        </Text>
                      </View>
                      <View>
                        <Text className="text-center text-purple-400 text-lg font-bold">
                          {totals[0].TotalProfitPercentage}%
                        </Text>
                        <Text className="text-center text-purple-400">
                          profit as a percentage
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="py-2 flex-row space-x-2 justify-center items-center"
                      onPress={() => setProfitDetails(true)}>
                      <Text className="text-center text-purple-500 font-bold">
                        More Details
                      </Text>
                      <Icon
                        name="arrowright"
                        size={15}
                        color="rgb(168 85 247)"
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      className="flex-row items-center justify-between px-4"
                      onPress={() => setProfitDetails(false)}>
                      <Text className="text-center text-blue-950 py-2">
                        Profit Details
                      </Text>
                      <Icon name="close" size={15} color="rgb(23 37 84)" />
                    </TouchableOpacity>

                    <View className="flex-1">
                      {/*more details start*/}
                      <ScrollView horizontal>
                        <Table
                          style={{
                            flex: 1,
                            backgroundColor: '#fff',
                          }}>
                          <Row
                            data={profitTableHeaders}
                            style={{
                              alignContent: 'center',
                              backgroundColor: 'rgb(168 85 247)',
                              paddingRight: 2,
                              paddingLeft: 2,
                            }}
                            textStyle={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 12,
                            }}
                            widthArr={[100, 100, 100, 100]}
                          />
                          <View className="divide-y divide-gray-200">
                            {profitTableData.map((row, index) => (
                              <Row
                                key={index}
                                style={{
                                  alignContent: 'center',
                                  paddingTop: 4,
                                  paddingBottom: 4,
                                  paddingLeft: 2,
                                  paddingRight: 2,
                                  height: 25,
                                }}
                                textStyle={{
                                  textAlign: 'center',
                                  fontSize: 12,
                                  color: 'black',
                                }}
                                widthArr={[100, 100, 100, 100]}
                                data={row}
                              />
                            ))}
                          </View>
                        </Table>
                      </ScrollView>
                      {/*more details end*/}
                    </View>
                  </View>
                )}
              </View>
              {/*Profit widget end*/}
            </ScrollView>
          ) : null}

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
