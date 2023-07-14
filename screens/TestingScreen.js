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
  Modal,
  Alert,
  Touchable,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {selectToken} from '../features/bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {ip} from '@env';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Table, Row} from 'react-native-table-component';
import SelectDropdown from 'react-native-select-dropdown';
import DrawerHeader from './DrawerHeader';
import {useTranslation} from 'react-i18next';
import i18next from '../languages/i18n';

const TestingScreen = () => {
  const {t, i18n} = useTranslation();
  const token = useSelector(selectToken);
  const {width, height} = Dimensions.get('screen');
  const dispatch = useDispatch();
  const navigation = useNavigation();
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
  const [categoriesDetailsTableHeaders, setCategoriesDetailsTableHeaders] =
    useState([]);
  const [categoriesDetailsTableData, setCategoriesDetailsTableData] = useState(
    [],
  );
  const [categoriesDetailsTableDataTrunc, setCategoriesDetailsTableDataTrunc] =
    useState([]);
  const [categoriesDetailsTableExpanded, setCategoriesDetailsTableExpanded] =
    useState(false);
  const [dailyTransactionsAverage, setDailyTransactionsAverage] = useState();
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();

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
              const translatedKey = t(key);
              return translatedKey;
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
              const translatedKey = t(key);
              return translatedKey;
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
        setCategoriesDetailsTableHeaders(() => {
          let headerArray = [];
          if (data.CategoriesSalesDtos.length > 0) {
            Object.keys(data.CategoriesSalesDtos[0]).forEach(key => {
              if (key === 'CategoryId' || key === 'Vat') {
                return;
              } else {
                const translatedHeader = t(key);
                const uppercaseHeader = translatedHeader
                  .toUpperCase()
                  .replace(/Έ/g, 'Ε');
                headerArray.push(uppercaseHeader);
              }
            });
            return headerArray;
          } else return [];
        });
        setCategoriesDetailsTableData(() => {
          let tableData = [];
          if (data.CategoriesSalesDtos.length > 0) {
            data.CategoriesSalesDtos.map(item => {
              let dataRow = [];
              Object.keys(item).forEach(key => {
                if (key === 'CategoryId' || key === 'Vat') {
                  return;
                } else if (key === 'CategoryName' || key === 'QuantityTmx') {
                  dataRow.push(item[key]);
                } else if (key === 'ProfitPercentage') {
                  dataRow.push(item[key] + ' %');
                } else {
                  dataRow.push(item[key] + ' €');
                }
              });
              tableData.push(dataRow);
            });
          } else return [];
          return tableData;
        });
        setCategoriesDetailsTableDataTrunc(
          categoriesDetailsTableData.slice(0, 10),
        );
        setDailyTransactionsAverage(data.TransactionsSalesDto);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setCategoriesDetailsTableDataTrunc(categoriesDetailsTableData.slice(0, 10));
  }, [categoriesDetailsTableData]);

  useEffect(() => {
    fetchDataFromBoApi();
  }, [fromDateFormatted, toDateFormatted]);

  const handleGroupByChange = value => {
    let date = new Date();
    setGroupByDate(value);
    switch (value) {
      case t('day'):
        setFromDate(date);
        setFromDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 00:00:00');
        });
        setToDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 23:59:59');
        });
        break;
      case t('week'):
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
      case t('month'):
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

  const selectedGroupByDateValue = useMemo(() => {
    switch (groupByDate) {
      case t('day'):
        return t('day');
      case t('week'):
        return t('week');
      case t('month'):
        return t('month');
      default:
        return t('day');
    }
  }, [groupByDate]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-300">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View className="w-full h-full  " style={{elevation: 5}}>
          <TouchableOpacity>
            <DrawerHeader />
          </TouchableOpacity>
          {/*Widgets start*/}
          {salesData !== undefined && salesData !== null ? (
            <ScrollView className="space-y-3">
              {/*Date picker start*/}
              <View className="space-y-1 my-2 mx-4" style={{elevation: 50}}>
                <View className="bg-gray-200 border rounded-sm h-11 justify-center">
                  <SelectDropdown
                    dropdownStyle={{
                      backgroundColor: 'lightgray',
                    }}
                    buttonStyle={{
                      width: '100%',
                      height: '99%',
                      backgroundColor: 'rgb(229 231 235)',
                    }}
                    buttonTextStyle={{color: 'rgb(23 37 84)'}}
                    data={[t('day'), t('week'), t('month')]}
                    defaultValue={selectedGroupByDateValue}
                    onSelect={(selectedItem, index) => {
                      handleGroupByChange(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />
                </View>
                <TouchableOpacity
                  className="bg-gray-200 border-solid border border-blue-950 rounded-sm p-2 flex-row justify-center space-x-1"
                  onPress={() => setOpenFromDate(true)}>
                  <Text className="text-center text-base text-blue-950">
                    {t('fromDate')}:
                  </Text>
                  <DatePicker
                    locale={i18next.language}
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
                    cancelText={t('cancel')}
                    confirmText={t('confirm')}
                    title={t('selectDate')}
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
                    {t('endDate')}:
                  </Text>
                  <DatePicker
                    locale={i18next.language}
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
                    cancelText={t('cancel')}
                    confirmText={t('confirm')}
                    title={t('selectDate')}
                  />
                  {toDateFormatted !== '' && (
                    <Text className="text-center text-base text-blue-950">
                      {toDateFormatted}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              {/*Date picker end*/}
              {/*Turnover widget start*/}
              <View
                className="bg-white my-1 mx-4 rounded-md"
                style={{elevation: 10}}>
                <View
                  className="bg-yellow-500 p-3 rounded-t-md"
                  style={{elevation: 10}}>
                  <Text className="text-center text-white underline underline-offset-8">
                    {t('turnover')}:
                  </Text>
                </View>
                <View className="bg-yellow-400 p-8">
                  <Text className="text-center text-white font-bold text-xl">
                    {totals[0].TurnoverWithVat}€
                  </Text>
                  <Text className="text-center text-white">
                    {' '}
                    {t('withVAT')}
                  </Text>
                </View>
                {!turnoverDetails ? (
                  <View className="divide-y divide-yellow-400">
                    <View className="flex-row justify-evenly items-center py-8">
                      <View className="w-1/3">
                        <Text className="text-center text-yellow-400 text-lg font-bold">
                          {totals[0].TurnoverWithoutVat} €
                        </Text>
                        <Text className="text-center text-yellow-400">
                          {t('withoutVAT')}
                        </Text>
                      </View>
                      <View className="w-1/3">
                        <Text className="text-center text-yellow-400 text-lg font-bold">
                          {totals[0].TurnoverVatTotal}€
                        </Text>
                        <Text className="text-center text-yellow-400">
                          {t('vatTotal')}
                        </Text>
                      </View>
                      <View className="w-1/3">
                        <Text className="text-center text-yellow-400 text-lg font-bold">
                          {totals[0].AvgPerDay}€
                        </Text>
                        <Text className="text-center text-yellow-400">
                          {t('avgPerDay')}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="py-2 flex-row space-x-2 justify-center items-center rounded-b-md"
                      onPress={() => setTurnoverDetails(true)}>
                      <Text className="text-center text-yellow-500 font-bold">
                        {t('moreDetails')}
                      </Text>
                      <Icon
                        name="arrowright"
                        size={15}
                        color="rgb(234 179 8)"
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="">
                    {/*more details start*/}
                    <View className="">
                      <TouchableOpacity
                        className="flex-row items-center justify-between px-4"
                        onPress={() => setTurnoverDetails(false)}>
                        <Text className="text-center text-blue-950 py-2">
                          {t('turnoverDetails')}
                        </Text>
                        <Icon name="close" size={15} color="rgb(23 37 84)" />
                      </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                      <ScrollView horizontal className="rounded-b-md pb-1">
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
                          <View className="divide-y divide-gray-200 rounded-b-md">
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
              <View
                className="bg-white my-1 mx-4 rounded-md"
                style={{elevation: 10}}>
                <View className="bg-purple-500 p-3 rounded-t-md">
                  <Text className="text-center text-white underline">
                    {t('profit')}:
                  </Text>
                </View>
                <View className="bg-purple-400 p-8">
                  <Text className="text-center text-white font-bold text-xl">
                    {totals[0].TotalProfitWithVat}€
                  </Text>
                  <Text className="text-center text-white">
                    {' '}
                    {t('withVAT')}
                  </Text>
                </View>
                {!profitDetails ? (
                  <View className="divide-y divide-purple-400">
                    <View className="flex-row justify-evenly items-center py-8">
                      <View className="w-1/2">
                        <Text className="text-center text-purple-400 text-lg font-bold">
                          {totals[0].TotalProfitWithoutVat}€
                        </Text>
                        <Text className="text-center text-purple-400">
                          {t('withoutVAT')}
                        </Text>
                      </View>
                      <View className="w-1/2">
                        <Text className="text-center text-purple-400 text-lg font-bold">
                          {totals[0].TotalProfitPercentage}%
                        </Text>
                        <Text className="text-center text-purple-400">
                          {t('profitAsPer')}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="py-2 flex-row space-x-2 justify-center items-center"
                      onPress={() => setProfitDetails(true)}>
                      <Text className="text-center text-purple-500 font-bold">
                        {t('moreDetails')}
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
                        {t('profitDetails')}
                      </Text>
                      <Icon name="close" size={15} color="rgb(23 37 84)" />
                    </TouchableOpacity>

                    <View className="flex-1">
                      {/*more details start*/}
                      <ScrollView horizontal className="rounded-b-md pb-1">
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
              {/*Top products start*/}
              {salesData.TopSellingProductDtos.length > 0 && (
                <View className="mb-2 mx-4">
                  <View
                    className="py-3 rounded-t-md"
                    style={{
                      backgroundColor: 'rgb(86, 113, 144)',
                      elevation: 50,
                    }}>
                    <Text className="text-center text-white underline">
                      {t('topProducts')}
                    </Text>
                  </View>
                  <View
                    className="divide-y divide-gray-200 bg-white rounded-b-md"
                    style={{elevation: 50}}>
                    {salesData?.TopSellingProductDtos?.map((item, index) => {
                      if (index <= 9) {
                        return (
                          <Text
                            key={salesData.TopSellingProductDtos.ProductId}
                            className="text-center py-2 text-gray-500 font-bold"
                            // style={{color: 'rgb(74, 118, 194)'}}
                          >
                            {item.ProductName.toUpperCase()}
                          </Text>
                        );
                      }
                    })}
                    <TouchableOpacity
                      className="py-2 flex-row space-x-2 justify-center items-center rounded-b-md"
                      style={{backgroundColor: 'rgb(95,125,155)'}}
                      onPress={() => {
                        setProductModalVisible(true);
                      }}>
                      <Text
                        className="text-center text-xs font-bold"
                        style={{color: 'rgb(255 255 255)'}}>
                        {t('chooseProduct')}
                      </Text>
                      <FontAwesome
                        name="arrow-right"
                        size={10}
                        color="rgb(255 255 255)"
                      />
                    </TouchableOpacity>
                    <Modal
                      animationType="slide"
                      visible={productModalVisible}
                      onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setProductModalVisible(!productModalVisible);
                      }}>
                      <View>
                        <View
                          className="flex-row justify-center items-center p-4 border-b"
                          style={{borderColor: 'rgb(212 215 222)'}}>
                          <Text className="flex-1 text-center text-lg">
                            {t('productSalesDetails')}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setProductModalVisible(false);
                              setSelectedProduct(null);
                            }}>
                            <Icon
                              name="close"
                              size={15}
                              color="rgb(23 37 84)"
                              className="grow-0"
                            />
                          </TouchableOpacity>
                        </View>
                        <View className="justify-center items-center py-4">
                          <SelectDropdown
                            data={salesData?.TopSellingProductDtos?.map(
                              item => item.ProductName,
                            )}
                            onSelect={(selectedItem, index) => {
                              setSelectedProduct(
                                salesData.TopSellingProductDtos?.find(
                                  item =>
                                    item.ProductName.toLowerCase() ===
                                    selectedItem.toLowerCase(),
                                ),
                              );
                            }}
                            defaultButtonText={' '}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                              return item;
                            }}
                            buttonStyle={{
                              width: '80%',
                              height: 50,
                              backgroundColor: '#FFF',
                              borderRadius: 8,
                              borderWidth: 1,
                              borderColor: 'rgb(212 215 222)',
                            }}
                            buttonTextStyle={{color: '#444', textAlign: 'left'}}
                            renderDropdownIcon={isOpened => {
                              return (
                                <SimpleLineIcons
                                  name={'magnifier'}
                                  color={'rgb(212 215 222)'}
                                  size={18}
                                />
                              );
                            }}
                            dropdownIconPosition={'left'}
                            dropdownStyle={{backgroundColor: '#EFEFEF'}}
                            rowStyle={{
                              backgroundColor: 'rgb(253 253 253)',
                              borderBottomColor: 'rgb(212 215 222)',
                            }}
                            rowTextStyle={{color: '#444', textAlign: 'left'}}
                            selectedRowStyle={{
                              backgroundColor: 'rgba(0,0,0,0.1)',
                            }}
                            search
                            searchInputStyle={{
                              backgroundColor: 'white',
                              borderBottomWidth: 1,
                              borderBottomColor: 'rgb(212 215 222)',
                            }}
                            searchPlaceHolder={t('productPlaceHolder')}
                            searchPlaceHolderColor={'darkgrey'}
                            renderSearchInputLeftIcon={() => {
                              return (
                                <SimpleLineIcons
                                  onEnterText
                                  name={'magnifier'}
                                  color={'rgb(100, 116, 139)'}
                                  size={18}
                                />
                              );
                            }}
                          />
                        </View>
                        <View className="justify-center items-center space-y-2 mb-2">
                          <View className="flex-row">
                            <Text className="text-slate-500 text-xl">
                              {t('from')}:{' '}
                            </Text>
                            <Text className="text-slate-500 text-xl">
                              {fromDateFormatted}
                            </Text>
                          </View>
                          <View className="flex-row">
                            <Text className="text-slate-500 text-xl">
                              {t('to')}:{' '}
                            </Text>
                            <Text className="text-slate-500 text-xl">
                              {toDateFormatted}
                            </Text>
                          </View>
                        </View>
                        {selectedProduct && (
                          <View className="space-y-4">
                            <View className="bg-yellow-400 flex-row flex-wrap justify-center items-center mx-2 rounded-md">
                              {selectedProduct &&
                                Object.keys(selectedProduct).map(key => {
                                  if (
                                    key === 'Quantity' ||
                                    key === 'TurnOverWithoutVat' ||
                                    key === 'VatTotal' ||
                                    key === 'TurnOverWithVat'
                                  ) {
                                    const translatedKey = t(key);
                                    const value = selectedProduct[key];

                                    return (
                                      <View className="justify-start items-center p-4 w-1/2">
                                        <Text className="text-white text-lg font-black">
                                          {value + '€'}
                                        </Text>
                                        <Text className="text-white text-center text-sm">
                                          {translatedKey}
                                        </Text>
                                      </View>
                                    );
                                  }
                                })}
                            </View>
                            <View className="bg-purple-400 flex-row items-start mx-2 rounded-md py-6">
                              {selectedProduct &&
                                Object.keys(selectedProduct).map(key => {
                                  if (
                                    key === 'ProfitOnTurnOverPercentage' ||
                                    key === 'ProfitWithVat' ||
                                    key === 'ProfitWithoutVat'
                                  ) {
                                    const translatedKey = t(key);
                                    const value = selectedProduct[key];

                                    return (
                                      <View className="justify-center items-center w-1/3 px-4">
                                        <Text className="text-white text-lg font-black">
                                          {key === 'ProfitOnTurnOverPercentage'
                                            ? `${value} %`
                                            : `${value} €`}
                                        </Text>

                                        <Text className="text-white text-center text-sm">
                                          {translatedKey}
                                        </Text>
                                      </View>
                                    );
                                  }
                                })}
                            </View>
                          </View>
                        )}
                      </View>
                    </Modal>
                  </View>
                </View>
              )}
              {/*Top products end*/}
              {/*Categories Details start*/}
              {categoriesDetailsTableData.length > 0 && (
                <View className="mb-2 mx-4">
                  <View
                    className="flex-row justify-between rounded-t-md py-3"
                    style={{
                      backgroundColor: 'rgb(86, 113, 144)',
                      elevation: 50,
                    }}>
                    <Text className="text-white underline ml-3 mt-1">
                      {t('categoryDetails')}
                    </Text>
                    <TouchableOpacity
                      className="flex-row space-x-2 justify-center items-center rounded-b-md"
                      onPress={() => {}}>
                      <Text
                        className="text-xs font-bold border border-white p-1 mr-2"
                        style={{
                          color: 'rgb(255, 255, 255)',
                          borderRadius: 20,
                          fontSize: 11,
                        }}>
                        {t('exportToExcel')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1 divide-y divide-gray-200">
                    <ScrollView horizontal className="rounded-b-md">
                      <Table
                        style={{
                          flex: 1,
                          backgroundColor: '#fff',
                        }}>
                        <Row
                          data={categoriesDetailsTableHeaders}
                          // className="bg-slate-400"
                          style={{
                            alignContent: 'center',
                            backgroundColor: 'rgb(105, 133, 165)',
                            paddingRight: 2,
                            paddingLeft: 2,
                            paddingTop: 4,
                            paddingBottom: 4,
                          }}
                          textStyle={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 12,
                          }}
                          widthArr={categoriesDetailsTableHeaders.map(
                            () => 100,
                          )}
                        />
                        <View className="divide-y divide-gray-200">
                          {categoriesDetailsTableExpanded
                            ? categoriesDetailsTableData.map((row, index) => {
                                return (
                                  <Row
                                    key={index}
                                    style={{
                                      alignContent: 'center',
                                      paddingTop: 6,
                                      paddingBottom: 6,
                                      paddingLeft: 2,
                                      paddingRight: 2,
                                    }}
                                    textStyle={{
                                      textAlign: 'center',
                                      fontSize: 12,
                                      fontWeight: 'bold',
                                      color: 'rgb(107, 114, 128)',
                                    }}
                                    widthArr={categoriesDetailsTableHeaders.map(
                                      () => 100,
                                    )}
                                    data={row}
                                  />
                                );
                              })
                            : categoriesDetailsTableDataTrunc.map(
                                (row, index) => {
                                  if (index <= 9) {
                                    return (
                                      <Row
                                        key={index}
                                        style={{
                                          alignContent: 'center',
                                          paddingTop: 6,
                                          paddingBottom: 6,
                                          paddingLeft: 2,
                                          paddingRight: 2,
                                        }}
                                        textStyle={{
                                          textAlign: 'center',
                                          fontSize: 12,
                                          fontWeight: 'bold',
                                          color: 'rgb(107, 114, 128)',
                                        }}
                                        widthArr={categoriesDetailsTableHeaders.map(
                                          () => 100,
                                        )}
                                        data={row}
                                      />
                                    );
                                  }
                                  return null; // Added for the case when index > 9
                                },
                              )}
                        </View>
                      </Table>
                    </ScrollView>
                    <View className="rounded-b-md">
                      <TouchableOpacity
                        className="py-2 flex-row space-x-2 justify-center items-center rounded-b-md"
                        style={{backgroundColor: 'rgb(95,125,155)'}}
                        onPress={() =>
                          setCategoriesDetailsTableExpanded(
                            !categoriesDetailsTableExpanded,
                          )
                        }>
                        <Text
                          className="font-bold text-xs"
                          style={{color: 'rgb(255,255,255)'}}>
                          {!categoriesDetailsTableExpanded
                            ? t('expand')
                            : t('collapse')}
                        </Text>
                        <FontAwesome
                          name={
                            categoriesDetailsTableExpanded
                              ? 'arrow-up'
                              : 'arrow-down'
                          }
                          size={10}
                          color="rgb(255,255,255)"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              {/*Categories Details end*/}
              {/*Daily Transactions Average start*/}
              <View className="mb-2 mx-4">
                <View
                  className="py-3 rounded-t-md"
                  style={{
                    backgroundColor: 'rgb(86, 113, 144)',
                    elevation: 50,
                  }}>
                  <Text className="text-center text-white underline">
                    {t('dailyTransactionAvg')}
                  </Text>
                </View>
                <View
                  className="rounded-b-md py-6 space-y-6"
                  style={{
                    backgroundColor: 'rgb(105, 133, 165)',
                    elevation: 50,
                  }}>
                  {dailyTransactionsAverage ? (
                    Object.keys(dailyTransactionsAverage).map((key, index) => {
                      const translatedKey = t(key);
                      const value = dailyTransactionsAverage[key];

                      return (
                        <View className="justify-center items-center rounded-md space-y-2">
                          <Text className="text-white text-xl font-black">
                            {value}
                          </Text>
                          <Text className="text-white">{translatedKey}</Text>
                        </View>
                      );
                    })
                  ) : (
                    <Text className="text-white">{t('noDataAvailable')}</Text>
                  )}
                </View>
              </View>
              {/*Daily Transactions Average end*/}
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
    textAlign: 'center',
    borderWidth: 1,
    padding: 10,
    color: 'black',
    borderRadius: 5,
  },
});

export default TestingScreen;
