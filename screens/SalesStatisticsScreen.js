/* eslint-disable curly */
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
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {selectToken} from '../features/bootstrap';
import {useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {ip} from '@env';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Table, Row} from 'react-native-table-component';
import SelectDropdown from 'react-native-select-dropdown';
import {
  VictoryLegend,
  VictoryChart,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryArea,
  VictoryTooltip,
} from 'victory-native';

const SalesStatisticsScreen = () => {
  const token = useSelector(selectToken);
  const {width, height} = Dimensions.get('screen');
  const [loading, setLoading] = useState(true);
  const [selectedGroupByDateValue, setSelectedGroupByDate] = useState('MONTH');
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
  const [salesChartTurnoverWithVatData, setSalesChartTurnoverWithVatData] =
    useState([]);
  const [
    salesChartTurnoverWithoutVatData,
    setSalesChartTurnoverWithoutVatData,
  ] = useState([]);
  const [salesChartProfitWithVatData, setSalesChartProfitWithVatData] =
    useState([]);
  const [salesChartProfitWithoutVatData, setSalesChartProfitWithoutVatData] =
    useState([]);
  const [prodID, setProdID] = useState(1);
  const [groupBy, setGroupBy] = useState('');

  const handleChangeSftId = inputText => {
    setSftId(inputText);
  };

  const fetchDataFromBoApi = async () => {
    setLoading(true);

    let groupByDate;
    let dayDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === 0) {
      groupByDate = 'hours';
    } else if (dayDiff >= 60 && dayDiff < 420) {
      groupByDate = 'weeks';
    } else if (dayDiff >= 420 && dayDiff < 730) {
      groupByDate = 'months';
    } else if (dayDiff >= 730) {
      groupByDate = 'years';
    } else groupByDate = 'days';

    setGroupBy(groupByDate);

    // console.log(
    // fromDateFormatted,
    // toDateFormatted,
    // sftId,
    // groupByDate,
    // storesIds,
    // token,
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
        setCategoriesDetailsTableHeaders(() => {
          let headerArray = [];
          if (data.CategoriesSalesDtos.length > 0) {
            Object.keys(data.CategoriesSalesDtos[0]).forEach(key => {
              if (key === 'CategoryId' || key === 'Vat') {
                return;
              } else {
                headerArray.push(key.replace(/(?!^)([A-Z])/g, ' $1'));
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
        setDailyTransactionsAverage(data.TransactionsSalesDto);

        let totalSalesChartData = data.TotalSalesChartDtos.sort((a, b) => {
          if (a.Year === b.Year) {
            return a.Hour - b.Hour;
          }
          return a.Year - b.Year;
        });

        switch (groupByDate) {
          case 'hours':
            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: item.Hour.toString(),
                  y: item.TurnOver,
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: item.Hour.toString(),
                  y: item.TurnOverWithoutVAT,
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: item.Hour.toString(),
                  y: item.TotalProfitMerged,
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: item.Hour.toString(),
                  y: item.TotalProfit,
                });
              });
              return arr;
            });
            break;
          case 'days':
            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `${item.Hour} - ${item.Year}`,
                  y: item.TurnOver,
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `${item.Hour} - ${item.Year}`,
                  y: item.TurnOverWithoutVAT,
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `${item.Hour} - ${item.Year}`,
                  y: item.TotalProfitMerged,
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `${item.Hour} - ${item.Year}`,
                  y: item.TotalProfit,
                });
              });
              return arr;
            });
            break;
          case 'weeks':
            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `Week ${item.Hour} of ${item.Year}`,
                  y: item.TurnOver,
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `Week ${item.Hour} of ${item.Year}`,
                  y: item.TurnOverWithoutVAT,
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `Week ${item.Hour} of ${item.Year}`,
                  y: item.TotalProfitMerged,
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `Week ${item.Hour} of ${item.Year}`,
                  y: item.TotalProfit,
                });
              });
              return arr;
            });
            break;
          case 'months':
            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `Month ${item.Hour} of ${item.Year}`,
                  y: item.TurnOver,
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `Month ${item.Hour} of ${item.Year}`,
                  y: item.TurnOverWithoutVAT,
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `Month ${item.Hour} of ${item.Year}`,
                  y: item.TotalProfitMerged,
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `Month ${item.Hour} of ${item.Year}`,
                  y: item.TotalProfit,
                });
              });
              return arr;
            });
            break;
          case 'years':
            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `${item.Year}`,
                  y: item.TurnOver,
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `${item.Year}`,
                  y: item.TurnOverWithoutVAT,
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `${item.Year}`,
                  y: item.TotalProfitMerged,
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              totalSalesChartData.map(item => {
                arr.push({
                  x: `${item.Year}`,
                  y: item.TotalProfit,
                });
              });
              return arr;
            });
            break;
          default:
            break;
        }

        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
  };

  // const fetchProductSalesDetailsDataFromBoApi = async () => {
  //   setLoading(true);
  //   if (__DEV__ && token) {
  //     var myHeaders = new Headers();
  //     myHeaders.append('Token', token);
  //     myHeaders.append('Content-Type', 'application/json');
  //     var requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow',
  //     };

  //     const response = await fetch(
  //       `http://${ip}:3000/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${fromDate}&toDate=${toDate}&dateGroupBy=${groupBy}&storeIds=1&prodID=${prodID}`,
  //       requestOptions,
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //   }
  //   // end of request
  //   setLoading(false);
  // };

  const handleGroupByChange = value => {
    let date = new Date();
    switch (value) {
      case 'DAY':
        // setGroupByDate('hours');
        setFromDate(date);
        setFromDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 00:00:00');
        });
        setToDate(date);
        setToDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 23:59:59');
        });
        break;
      case 'WEEK':
        // setGroupByDate('days');
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
        // setGroupByDate('days');
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

  const defaultSelectedGroupByDateValue = useMemo(
    () => selectedGroupByDateValue,
    [selectedGroupByDateValue],
  );

  useEffect(() => {
    setCategoriesDetailsTableDataTrunc(categoriesDetailsTableData.slice(0, 10));
  }, [categoriesDetailsTableData]);

  useEffect(() => {
    fetchDataFromBoApi();
  }, [fromDateFormatted, toDateFormatted]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-300">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View className="w-full h-full space-y-3" style={{elevation: 50}}>
          {/*Widgets start*/}
          {salesData !== undefined && salesData !== null ? (
            <ScrollView className="space-y-3">
              {/*Date picker start*/}
              <View className="space-y-1 my-2 mx-4">
                <View
                  className="bg-gray-200 border rounded-sm h-11 justify-center"
                  style={{elevation: 10}}>
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
                    data={['DAY', 'WEEK', 'MONTH']}
                    defaultValue={defaultSelectedGroupByDateValue}
                    onSelect={(selectedItem, index) => {
                      handleGroupByChange(selectedItem);
                      setSelectedGroupByDate(selectedItem);
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
                  style={{elevation: 50}}
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
                  style={{elevation: 50}}
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
              {/*Turnover widget start*/}
              <View
                className="bg-white my-1 mx-4 rounded-md"
                style={{elevation: 10}}>
                <View
                  className="bg-yellow-500 p-3 rounded-t-md"
                  style={{elevation: 10}}>
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
                      <View className="w-1/3">
                        <Text className="text-center text-yellow-400 text-lg font-bold">
                          {totals[0].TurnoverWithoutVat} €
                        </Text>
                        <Text className="text-center text-yellow-400">
                          without VAT
                        </Text>
                      </View>
                      <View className="w-1/3">
                        <Text className="text-center text-yellow-400 text-lg font-bold">
                          {totals[0].TurnoverVatTotal}€
                        </Text>
                        <Text className="text-center text-yellow-400">
                          VAT total
                        </Text>
                      </View>
                      <View className="w-1/3">
                        <Text className="text-center text-yellow-400 text-lg font-bold">
                          {totals[0].AvgPerDay}€
                        </Text>
                        <Text className="text-center text-yellow-400">
                          Average Per Day
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="py-2 flex-row space-x-2 justify-center items-center rounded-b-md"
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
                  <View className="">
                    {/*more details start*/}
                    <View className="">
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
                      <View className="w-1/2">
                        <Text className="text-center text-purple-400 text-lg font-bold">
                          {totals[0].TotalProfitWithoutVat}€
                        </Text>
                        <Text className="text-center text-purple-400">
                          without VAT
                        </Text>
                      </View>
                      <View className="w-1/2">
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
                      Top Selling Products
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
                        CHOOSE A PRODUCT
                      </Text>
                      <FontAwesome
                        name="arrow-right"
                        size={10}
                        color="rgb(255 255 255)"
                      />
                    </TouchableOpacity>
                    <Modal
                      animationType="fade"
                      visible={productModalVisible}
                      onRequestClose={() => {
                        setProductModalVisible(!productModalVisible);
                        setSelectedProduct(null);
                      }}>
                      <ScrollView>
                        <View className="flex-row justify-center items-center p-4 border-b border-gray-200">
                          <Text className="flex-1 text-center text-lg text-slate-500">
                            Product Sales Details
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setProductModalVisible(false);
                              setSelectedProduct(null);
                            }}>
                            <Icon
                              name="close"
                              size={15}
                              color="rgb(100 116 139)"
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
                              // fetchProductSalesDetailsDataFromBoApi();
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
                              borderColor: 'rgb(229 231 235)',
                            }}
                            buttonTextStyle={{color: '#444', textAlign: 'left'}}
                            renderDropdownIcon={isOpened => {
                              return (
                                <SimpleLineIcons
                                  name={'magnifier'}
                                  color={'rgb(229 231 235)'}
                                  size={18}
                                />
                              );
                            }}
                            dropdownIconPosition={'left'}
                            dropdownStyle={{backgroundColor: '#EFEFEF'}}
                            rowStyle={{
                              backgroundColor: '#EFEFEF',
                              borderBottomColor: '#C5C5C5',
                            }}
                            rowTextStyle={{color: '#444', textAlign: 'left'}}
                            selectedRowStyle={{
                              backgroundColor: 'rgba(0,0,0,0.1)',
                            }}
                            search
                            searchInputStyle={{
                              backgroundColor: 'white',
                              borderBottomWidth: 1,
                              borderBottomColor: 'rgb(229 231 235)',
                            }}
                            searchPlaceHolder={'Search by product name'}
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
                              From:
                            </Text>
                            <Text className="text-slate-500 text-xl">
                              {fromDateFormatted}
                            </Text>
                          </View>
                          <View className="flex-row">
                            <Text className="text-slate-500 text-xl">To: </Text>
                            <Text className="text-slate-500 text-xl">
                              {toDateFormatted}
                            </Text>
                          </View>
                        </View>
                        {selectedProduct && (
                          <View className="space-y-4">
                            <View
                              className="bg-yellow-400 flex-row flex-wrap justify-center items-center mx-2 rounded-md"
                              style={{elevation: 10}}>
                              {selectedProduct &&
                                Object.keys(selectedProduct).map(key => {
                                  if (
                                    key === 'Quantity' ||
                                    key === 'TurnOverWithoutVat' ||
                                    key === 'VatTotal' ||
                                    key === 'TurnOverWithVat'
                                  ) {
                                    return (
                                      <View className="justify-start items-center p-4 w-1/2">
                                        <Text className="text-white text-lg font-black">
                                          {selectedProduct[key] + '€'}
                                        </Text>
                                        <Text className="text-white text-center text-sm">
                                          {key
                                            .replace(/(?!^Turn)O/g, ' o')
                                            .replace(/(?!^)([A-Z])/g, ' $1')}
                                        </Text>
                                      </View>
                                    );
                                  }
                                })}
                            </View>
                            <View
                              className="bg-purple-400 flex-row items-start mx-2 rounded-md py-6"
                              style={{elevation: 10}}>
                              {selectedProduct &&
                                Object.keys(selectedProduct).map(key => {
                                  if (
                                    key === 'ProfitOnTurnOverPercentage' ||
                                    key === 'ProfitWithVat' ||
                                    key === 'ProfitWithoutVat'
                                  ) {
                                    return (
                                      <View className="justify-center items-center w-1/3 px-4">
                                        <Text className="text-white text-lg font-black">
                                          {key === 'ProfitOnTurnOverPercentage'
                                            ? selectedProduct[key] + '%'
                                            : selectedProduct[key] + '€'}
                                        </Text>

                                        <Text className="text-white text-center text-sm">
                                          {key
                                            .replace(/(?!^Turn)O/g, ' o')
                                            .replace(/(?!^)([A-Z])/g, ' $1')}
                                        </Text>
                                      </View>
                                    );
                                  }
                                })}
                            </View>
                            <View
                              className="mx-4 rounded-lg flex-1 justify-center items-center mb-2"
                              style={{backgroundColor: 'rgb(105, 133, 165)'}}>
                              <View
                                className="w-full rounded-t-lg"
                                style={{
                                  backgroundColor: 'rgb(86, 113, 144)',
                                  elevation: 50,
                                }}>
                                <Text className="text-center underline py-2 text-white">
                                  Total Turnover and Profit
                                </Text>
                              </View>
                              <ScrollView horizontal className="w-full">
                                <VictoryChart
                                  theme={VictoryTheme.material}
                                  height={height / 2}
                                  padding={{
                                    top: 75,
                                    left: 50,
                                    bottom: 50,
                                    right: 25,
                                  }}
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
                                    data={[
                                      {
                                        name: 'Turnover with VAT',
                                        symbol: {fill: 'orange'},
                                      },
                                      {
                                        name: 'Turnover without VAT',
                                        symbol: {fill: 'rgb(245, 185, 66)'},
                                      },
                                      {
                                        name: 'Profit with VAT',
                                        symbol: {fill: 'purple'},
                                      },
                                      {
                                        name: 'Profit without VAT',
                                        symbol: {fill: 'rgb(147, 66, 245)'},
                                      },
                                    ]}
                                  />
                                  {/*x axis start*/}
                                  <VictoryAxis
                                    fixLabelOverlap={true}
                                    style={{
                                      grid: {
                                        stroke: 'lightgray',
                                        strokeDasharray: 'none',
                                      },
                                      axis: {stroke: 'lightgray'},
                                      ticks: {stroke: 'lightgray'},
                                      tickLabels: {fill: 'lightgray'},
                                    }}
                                  />
                                  {/*x axis end*/}
                                  {/*y axis start*/}
                                  <VictoryAxis
                                    dependentAxis
                                    tickFormat={t => {
                                      const suffixes = ['', 'k', 'M', 'B', 'T']; // Add more suffixes as needed
                                      const magnitude = Math.floor(
                                        Math.log10(t) / 3,
                                      );
                                      const scaledNumber =
                                        t / Math.pow(10, magnitude * 3);
                                      const formattedNumber =
                                        scaledNumber.toFixed(0);
                                      return (
                                        formattedNumber + suffixes[magnitude]
                                      );
                                    }}
                                    style={{
                                      grid: {
                                        stroke: 'lightgray',
                                        strokeDasharray: 'none',
                                      },
                                      axis: {stroke: 'lightgray'},
                                      ticks: {stroke: 'lightgray'},
                                      tickLabels: {fill: 'lightgray'},
                                    }}
                                  />
                                  {/*y axis end*/}
                                  {/*turnover with vat start*/}
                                  <VictoryArea
                                    interpolation="natural"
                                    data={salesChartTurnoverWithVatData}
                                    style={{
                                      data: {fill: 'orange'},
                                    }}
                                    animate={{
                                      duration: 1000,
                                      onLoad: {duration: 1000},
                                    }}
                                  />
                                  {/*turnover with vat end*/}
                                  {/*turnover without vat start*/}
                                  <VictoryArea
                                    interpolation="natural"
                                    data={salesChartTurnoverWithoutVatData}
                                    style={{
                                      data: {fill: 'rgb(245, 185, 66)'},
                                    }}
                                    animate={{
                                      duration: 2000,
                                      onLoad: {duration: 2000},
                                    }}
                                  />
                                  {/*turnover without vat end*/}
                                  {/*profit with vat start*/}
                                  <VictoryArea
                                    interpolation="natural"
                                    data={salesChartProfitWithVatData}
                                    style={{
                                      data: {fill: 'purple'},
                                    }}
                                    animate={{
                                      duration: 3000,
                                      onLoad: {duration: 3000},
                                    }}
                                  />
                                  {/*profit with vat end*/}
                                  {/*profit without vat start*/}
                                  <VictoryArea
                                    interpolation="natural"
                                    data={salesChartProfitWithoutVatData}
                                    style={{
                                      data: {fill: 'rgb(147, 66, 245)'},
                                    }}
                                    animate={{
                                      duration: 4000,
                                      onLoad: {duration: 4000},
                                    }}
                                  />
                                  {/*profit without vat end*/}
                                </VictoryChart>
                              </ScrollView>
                            </View>
                          </View>
                        )}
                      </ScrollView>
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
                      Category Details
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
                        EXPORT TO EXCEL
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
                          className="text-xs font-bold"
                          style={{color: 'rgb(255,255,255)'}}>
                          {!categoriesDetailsTableExpanded
                            ? 'EXPAND'
                            : 'COLLAPSE'}
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
              <View
                className="mx-4"
                style={{
                  marginBottom:
                    salesData.TotalSalesChartDtos.length > 0 ? null : 4,
                }}>
                <View
                  className="py-3 rounded-t-md"
                  style={{
                    backgroundColor: 'rgb(86, 113, 144)',
                    elevation: 50,
                  }}>
                  <Text className="text-center text-white underline">
                    Daily Transactions Average
                  </Text>
                </View>
                <View
                  className="rounded-b-md py-6 space-y-6"
                  style={{
                    backgroundColor: 'rgb(105, 133, 165)',
                    elevation: 50,
                  }}>
                  {dailyTransactionsAverage &&
                    Object.keys(dailyTransactionsAverage).map((key, index) => {
                      return (
                        <View
                          className="justify-center items-center rounded-md space-y-2"
                          key={index}>
                          <Text className="text-white text-xl font-black">
                            {dailyTransactionsAverage[key]}
                          </Text>
                          <Text className="text-white">
                            {key.replace(/(?!^)([A-Z])/g, ' $1')}
                          </Text>
                        </View>
                      );
                    })}
                </View>
              </View>
              {/*Daily Transactions Average end*/}
              {/*Graph start*/}
              {salesData.TotalSalesChartDtos.length > 0 && (
                <View
                  className="mx-4 rounded-lg flex-1 justify-center items-center mb-2"
                  style={{backgroundColor: 'rgb(105, 133, 165)'}}>
                  <View
                    className="w-full rounded-t-lg"
                    style={{
                      backgroundColor: 'rgb(86, 113, 144)',
                      elevation: 50,
                    }}>
                    <Text className="text-center underline py-2 text-white">
                      Total Turnover and Profit
                    </Text>
                  </View>
                  <ScrollView horizontal className="w-full">
                    <VictoryChart
                      theme={VictoryTheme.material}
                      height={height / 2}
                      padding={{top: 75, left: 50, bottom: 50, right: 25}}
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
                        data={[
                          {name: 'Turnover with VAT', symbol: {fill: 'orange'}},
                          {
                            name: 'Turnover without VAT',
                            symbol: {fill: 'rgb(245, 185, 66)'},
                          },
                          {name: 'Profit with VAT', symbol: {fill: 'purple'}},
                          {
                            name: 'Profit without VAT',
                            symbol: {fill: 'rgb(147, 66, 245)'},
                          },
                        ]}
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
                        tickFormat={t => {
                          const suffixes = ['', 'k', 'M', 'B', 'T']; // Add more suffixes as needed
                          const magnitude = Math.floor(Math.log10(t) / 3);
                          const scaledNumber = t / Math.pow(10, magnitude * 3);
                          const formattedNumber = scaledNumber.toFixed(0);
                          return formattedNumber + suffixes[magnitude];
                        }}
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
                        data={salesChartTurnoverWithVatData}
                        style={{
                          data: {fill: 'orange'},
                        }}
                        animate={{
                          duration: 1000,
                          onLoad: {duration: 1000},
                        }}
                      />
                      {/*turnover with vat end*/}
                      {/*turnover without vat start*/}
                      <VictoryArea
                        interpolation="natural"
                        data={salesChartTurnoverWithoutVatData}
                        style={{
                          data: {fill: 'rgb(245, 185, 66)'},
                        }}
                        animate={{
                          duration: 2000,
                          onLoad: {duration: 2000},
                        }}
                      />
                      {/*turnover without vat end*/}
                      {/*profit with vat start*/}
                      <VictoryArea
                        interpolation="natural"
                        data={salesChartProfitWithVatData}
                        style={{
                          data: {fill: 'purple'},
                        }}
                        animate={{
                          duration: 3000,
                          onLoad: {duration: 3000},
                        }}
                      />
                      {/*profit with vat end*/}
                      {/*profit without vat start*/}
                      <VictoryArea
                        interpolation="natural"
                        data={salesChartProfitWithoutVatData}
                        style={{
                          data: {fill: 'rgb(147, 66, 245)'},
                        }}
                        animate={{
                          duration: 4000,
                          onLoad: {duration: 4000},
                        }}
                      />
                      {/*profit without vat end*/}
                    </VictoryChart>
                  </ScrollView>
                </View>
              )}
              {/*Graph end*/}
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

export default SalesStatisticsScreen;
