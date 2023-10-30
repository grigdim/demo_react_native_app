/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import DatePicker from 'react-native-date-picker';
import DrawerHeader from './DrawerHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import {selectToken} from '../features/bootstrap';
import {useSelector} from 'react-redux';
import {Table, Row} from 'react-native-table-component';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import i18next from '../languages/i18n';
import {
  VictoryLegend,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryBar,
  VictoryArea,
} from 'victory-native';

const ProcurementsScreen = () => {
  const {height} = Dimensions.get('screen');
  const [loading, setLoading] = useState(true);
  const token = useSelector(selectToken);
  const [selectedGroupByDateValue, setSelectedGroupByDate] = useState('WEEK');
  const [groupBy, setGroupBy] = useState('week');
  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    return today;
  });
  const [fromDateFormatted, setFromDateFormatted] = useState(
    fromDate.toISOString().slice(0, 10).concat(' 00:00:00'),
  );
  const [toDate, setToDate] = useState(new Date());
  const [toDateFormatted, setToDateFormatted] = useState(
    toDate.toISOString().slice(0, 10).concat(' 23:59:59'),
  );
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [ordersSummary, setOrdersSummary] = useState();
  const [topSuppliers, setTopSuppliers] = useState();
  const [totalExpenditures, setTotalExpenditures] = useState({});
  const [totalExpendituresDetails, setTotalExpendituresDetails] =
    useState(false);
  const [totalExpenditureChartGrossValue, setTotalExpenditureChartGrossValue] =
    useState();
  const [totalExpenditureChartNetValue, setTotalExpenditureChartNetValue] =
    useState();
  const [totalExpenditureChartVAT, setTotalExpenditureChartVAT] = useState();
  const totalExpenditureDetailsTableHeaders = [
    'VATPercent',
    'OrdersWithVat',
    'VAT',
    'OrdersWithoutVat',
  ];
  const [
    totalExpenditureDetailsTableData,
    setTotalExpenditureDetailsTableData,
  ] = useState();
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [supplierID, setSupplierID] = useState();
  const [supplierTotalExpenditures, setSupplierTotalExpenditures] = useState();
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [supplierChartGrossValue, setSupplierChartGrossValue] = useState();
  const [supplierChartNetValue, setSupplierChartNetValue] = useState();
  const [supplierChartVAT, setSupplierChartVAT] = useState();
  const selectedSupplierTableHeaders = [
    'Date',
    'InvoiceNumber',
    'Value',
    'OrderDescr',
  ];
  const [selectedSupplierTableData, setSelectedSupplierTableData] = useState(
    [],
  );
  const {t, i18n} = useTranslation();
  // Default day value
  const defaultSelectedGroupByDateValue = useMemo(() => {
    switch (selectedGroupByDateValue) {
      case t('day'):
        return t('day');
      case t('week'):
        return t('week');
      case t('month'):
        return t('month');
      default:
        return t('week');
    }
  }, [selectedGroupByDateValue]);

  const handleGroupByChange = value => {
    let date = new Date();
    switch (value) {
      case t('day'):
        setFromDate(date);
        setFromDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 00:00:00');
        });
        setToDate(date);
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

  const fetchDataFromProcurementExpenditure = async () => {
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
    } else {
      groupByDate = 'days';
    }

    setGroupBy(groupByDate);

    if (
      // __DEV__ &&
      token
    ) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      try {
        const response = await fetch(
          `https://bo-api-gr.intalepoint.com/bo/Invoices/GetProcurementExpenditures?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}&storesIds=1&traId=0`,
          requestOptions,
        );
        const data = await response.json();
        // console.log(data.ChartExpenditures);
        setTopSuppliers(data.TopSuppliers);
        setTotalExpenditures(data.TotalExpenditures);

        let sortedData = data.ChartExpenditures.sort(
          (a, b) => new Date(a.Inv_DateTime) - new Date(b.Inv_DateTime),
        );

        switch (groupByDate) {
          case 'hours':
            // console.log(groupByDate);
            setTotalExpenditureChartVAT(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(11, 16)}`,
                  y: item.VAT,
                });
              });
              return arr;
            });
            setTotalExpenditureChartNetValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(11, 16)}`,
                  y: item.NetValue,
                });
              });
              return arr;
            });
            setTotalExpenditureChartGrossValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(11, 16)}`,
                  y: item.GrossValue,
                });
              });
              return arr;
            });
            break;
          case 'days':
            // console.log(groupByDate);
            setTotalExpenditureChartVAT(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.VAT,
                });
              });
              return arr;
            });
            setTotalExpenditureChartNetValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.NetValue,
                });
              });
              return arr;
            });
            setTotalExpenditureChartGrossValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.GrossValue,
                });
              });
              return arr;
            });
            break;
          case 'weeks':
            // console.log(groupByDate);
            setTotalExpenditureChartVAT(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.VAT,
                });
              });
              return arr;
            });
            setTotalExpenditureChartNetValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.NetValue,
                });
              });
              return arr;
            });
            setTotalExpenditureChartGrossValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.GrossValue,
                });
              });
              return arr;
            });
            break;
          case 'months':
            // console.log(groupByDate);
            setTotalExpenditureChartVAT(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.VAT,
                });
              });
              return arr;
            });
            setTotalExpenditureChartNetValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.NetValue,
                });
              });
              return arr;
            });
            setTotalExpenditureChartGrossValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.GrossValue,
                });
              });
              return arr;
            });
            break;
          case 'years':
            // console.log(groupByDate);
            setTotalExpenditureChartVAT(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.VAT,
                });
              });
              return arr;
            });
            setTotalExpenditureChartNetValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.NetValue,
                });
              });
              return arr;
            });
            setTotalExpenditureChartGrossValue(() => {
              let arr = [];
              sortedData.map(item => {
                arr.push({
                  x: `${item.Inv_DateTime.slice(
                    8,
                    10,
                  )}/${item.Inv_DateTime.slice(5, 7)}/${item.Inv_DateTime.slice(
                    2,
                    4,
                  )}`,
                  y: item.GrossValue,
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

  const fetchDataFromProcurementExpenditureDetails = async () => {
    if (
      // __DEV__ &&
      token
    ) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      try {
        const response = await fetch(
          `https://bo-api-gr.intalepoint.com/bo/Invoices/GetProcurementExpendituresDetails?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}&storesIds=1&traId=0`,
          requestOptions,
        );
        const data = await response.json();
        // console.log(data);
        if (data !== undefined && data.length > 0) {
          setTotalExpenditureDetailsTableData(() => {
            let acc = [];
            data.map(item => {
              let arr = [];
              for (const key in item) {
                if (key === 'VATPercent') {
                  arr[0] = item[key] * 100;
                } else if (key === 'GrossValue') {
                  arr[1] = item[key] + '€';
                } else if (key === 'VAT') {
                  arr[2] = item[key] + '€';
                } else if (key === 'NetValue') {
                  arr[3] = item[key] + '€';
                }
              }
              if (arr.length > 0) {
                acc.push(arr);
              }
            });
            return acc;
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const fetchDataFromGetOrderSummaries = async () => {
    setLoading(true);
    if (token) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      try {
        const response = await fetch(
          `https://bo-api-gr.intalepoint.com/bo/Invoices/GetOrderSummaries?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}&storesIds=1`,
          requestOptions,
        );
        const data = await response.json();
        setOrdersSummary(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
  };

  const fetchDataFromGetSuppliersModal = async () => {
    setLoading(true);
    if (token && supplierID) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      try {
        const response = await fetch(
          `https://bo-api-gr.intalepoint.com/bo/Invoices/GetSuppliersModal?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}&storesIds=1&traId=${supplierID}`,
          requestOptions,
        );
        const data = await response.json();
        console.log(data);
        // setSupplierTotalExpenditures(data.TotalExpenditures);
        // setSupplierChartGrossValue(() => {
        //   let supplierChartGrossValueArray = [];
        //   let sortedData = data.ChartExpenditures.sort(
        //     (a, b) => new Date(a.Inv_DateTime) - new Date(b.Inv_DateTime),
        //   );
        //   sortedData.map(item => {
        //     supplierChartGrossValueArray.push({
        //       y: item.GrossValue,
        //       x: `${new Date(item.Inv_DateTime).getDate()}/${
        //         new Date(item.Inv_DateTime).getMonth() + 1
        //       }/${new Date(item.Inv_DateTime).getFullYear()}`,
        //     });
        //   });
        //   return supplierChartGrossValueArray;
        // });
        // setSupplierChartNetValue(() => {
        //   let supplierChartNetValueArray = [];
        //   let sortedData = data.ChartExpenditures.sort(
        //     (a, b) => new Date(a.Inv_DateTime) - new Date(b.Inv_DateTime),
        //   );
        //   sortedData.map(item => {
        //     supplierChartNetValueArray.push({
        //       y: item.NetValue,
        //       x: `${new Date(item.Inv_DateTime).getDate()}/${
        //         new Date(item.Inv_DateTime).getMonth() + 1
        //       }/${new Date(item.Inv_DateTime).getFullYear()}`,
        //     });
        //   });
        //   return supplierChartNetValueArray;
        // });
        // setSupplierChartVAT(() => {
        //   let supplierChartVATArray = [];
        //   let sortedData = data.ChartExpenditures.sort(
        //     (a, b) => new Date(a.Inv_DateTime) - new Date(b.Inv_DateTime),
        //   );
        //   sortedData.map(item => {
        //     supplierChartVATArray.push({
        //       y: item.VAT,
        //       x: `${new Date(item.Inv_DateTime).getDate()}/${
        //         new Date(item.Inv_DateTime).getMonth() + 1
        //       }/${new Date(item.Inv_DateTime).getFullYear()}`,
        //     });
        //   });
        //   return supplierChartVATArray;
        // });
        setLoading(false);
      } catch (e) {
        console.log(e, 'supplierModal');
        setLoading(false);
      }
    }
  };

  const fetchDataFromGetSupplierOrder = async () => {
    setLoading(true);
    if (token && supplierID) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      try {
        const response = await fetch(
          `https://bo-api-gr.intalepoint.com/bo/Invoices/GetSupplierOrders?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}&traId=${supplierID}`,
          requestOptions,
        );
        const data = await response.json();
        if (data !== undefined && data.length > 0) {
          setSelectedSupplierTableData(() => {
            let acc = [];
            data.map(item => {
              let arr = [];
              for (const key in item) {
                if (key === 'Date') {
                  arr[0] = item[key].slice(0, 10);
                } else if (key === 'InvoiceNumber') {
                  arr[1] = item[key];
                } else if (key === 'Value') {
                  arr[2] = item[key];
                } else if (key === 'OrderDescr') {
                  arr[3] = item[key];
                }
              }
              if (arr.length > 0) {
                acc.push(arr);
              }
            });
            return acc;
          });
        }
        setLoading(false);
      } catch (e) {
        console.log(e, 'supplierOrder');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDataFromProcurementExpenditure();
    fetchDataFromProcurementExpenditureDetails();
    fetchDataFromGetOrderSummaries();
  }, [fromDateFormatted, toDateFormatted]);

  useEffect(() => {
    fetchDataFromGetSuppliersModal();
    fetchDataFromGetSupplierOrder();
  }, [supplierID]);

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity>
        <DrawerHeader />
      </TouchableOpacity>
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-300">
        {loading ? (
          <ActivityIndicator color="rgb(34 211 238)" size="large" />
        ) : (
          <View className="w-full h-full" style={{elevation: 50}}>
            <ScrollView className="space-y-2">
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
                    data={[t('day'), t('week'), t('month')]}
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
                  style={{elevation: 50}}
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
              {/*Future spend start*/}
              <View className="mb-2 mx-4 space-y-4">
                <View
                  className="bg-green-400 my-1 rounded-md"
                  style={{elevation: 10}}>
                  <View
                    className="bg-green-500 p-3 rounded-t-md"
                    style={{elevation: 10}}>
                    <Text className="text-center text-white underline underline-offset-8">
                      {t('FutureSpend')}
                    </Text>
                  </View>

                  <View className="divide-y divide-green-400">
                    <View className="flex-column justify-evenly items-center space-y-4 py-4">
                      <View className="w-full">
                        <Text className="text-center text-white text-lg font-bold">
                          {ordersSummary?.PendingSum}€
                        </Text>
                        <Text className="text-center text-white">
                          {ordersSummary?.PendingCount} {t('PendingCount')}
                        </Text>
                      </View>
                      <View className="w-full">
                        <Text className="text-center text-white text-lg font-bold">
                          {ordersSummary?.CompletedSumGross}€
                        </Text>
                        <Text className="text-center text-white">
                          {ordersSummary?.CompletedCount} {t('CompletedCount')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {/*Future spend end*/}

              {topSuppliers && topSuppliers.length > 0 && (
                <View className="mb-2 mx-4 space-y-4">
                  {/*Total expenditure widget start*/}
                  <View
                    className="bg-white my-1 rounded-md"
                    style={{elevation: 10}}>
                    <View
                      className="bg-blue-400 p-3 rounded-t-md"
                      style={{elevation: 10}}>
                      <Text className="text-center text-white underline underline-offset-8">
                        {t('TotalExpenditure')} |{' '}
                        {totalExpenditures.Transactions}
                        {t('Transactions')}
                      </Text>
                    </View>
                    {!totalExpendituresDetails ? (
                      <View className="divide-y divide-blue-400">
                        <View className="flex-row justify-evenly items-center py-8">
                          <View className="w-1/3">
                            <Text className="text-center text-blue-400 text-lg font-bold">
                              {totalExpenditures.NetValue} €
                            </Text>
                            <Text className="text-center text-blue-400">
                              {t('withoutVAT')}
                            </Text>
                          </View>
                          <View className="w-1/3">
                            <Text className="text-center text-blue-400 text-lg font-bold">
                              {totalExpenditures.VAT}€
                            </Text>
                            <Text className="text-center text-blue-400">
                              {t('VAT')}
                            </Text>
                          </View>
                          <View className="w-1/3">
                            <Text className="text-center text-blue-400 text-lg font-bold">
                              {totalExpenditures.GrossValue}€
                            </Text>
                            <Text className="text-center text-blue-400">
                              {t('GrossValue')}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          className="py-2 flex-row space-x-2 justify-center items-center rounded-b-md"
                          onPress={() => setTotalExpendituresDetails(true)}>
                          <Text className="text-center text-blue-400 font-bold">
                            {t('totalExpenditureVATDetails')}
                          </Text>
                          <Icon
                            name="arrowright"
                            size={15}
                            color="rgb(96 165 250)"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View className="">
                        {/*more details start*/}
                        <View className="">
                          <TouchableOpacity
                            className="flex-row items-center justify-between px-4"
                            onPress={() => setTotalExpendituresDetails(false)}>
                            <Text className="text-center text-blue-950 py-2">
                              {t('totalExpenditureVATDetails')}
                            </Text>
                            <Icon
                              name="close"
                              size={15}
                              color="rgb(23 37 84)"
                            />
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
                                data={totalExpenditureDetailsTableHeaders.map(
                                  item => {
                                    return t(item);
                                  },
                                )}
                                style={{
                                  alignContent: 'center',
                                  backgroundColor: 'rgb(96 165 250)',
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
                              <View className="divide-y divide-gray-200 rounded-b-md">
                                {totalExpenditureDetailsTableData.map(
                                  (row, index) => (
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
                                  ),
                                )}
                              </View>
                            </Table>
                          </ScrollView>
                          {/*more details end*/}
                        </View>
                      </View>
                    )}
                  </View>
                  {/*Total expenditure widget end*/}
                  {/*Top suppliers start*/}
                  <View>
                    <View
                      className="py-3 rounded-t-md"
                      style={{
                        backgroundColor: 'rgb(86, 113, 144)',
                      }}>
                      <Text className="text-center text-white underline">
                        {t('topSuppliers')}
                      </Text>
                    </View>
                    <View
                      className="divide-y divide-gray-200 bg-white rounded-b-md"
                      style={{elevation: 50}}>
                      {topSuppliers?.map((item, index) => {
                        if (index <= 9) {
                          return (
                            <TouchableOpacity
                              key={item.ID}
                              onPress={() => {
                                setSupplierID(item.ID);
                                setSelectedSupplier(item);
                                setSupplierModalVisible(!supplierModalVisible);
                              }}>
                              <Text
                                key={item.ID}
                                className="text-center py-2 text-gray-500 font-bold"
                                // style={{color: 'rgb(74, 118, 194)'}}
                              >
                                {item.Name}
                              </Text>
                            </TouchableOpacity>
                          );
                        }
                      })}
                      <TouchableOpacity
                        className="py-2 flex-row space-x-2 justify-center items-center rounded-b-md"
                        style={{backgroundColor: 'rgb(95,125,155)'}}
                        onPress={() => {
                          setSupplierModalVisible(true);
                        }}>
                        <Text
                          className="text-center text-xs font-bold"
                          style={{color: 'rgb(255 255 255)'}}>
                          {t('chooseSupplier').toUpperCase()}
                        </Text>
                        <FontAwesome
                          name="arrow-right"
                          size={10}
                          color="rgb(255 255 255)"
                        />
                      </TouchableOpacity>

                      <Modal
                        animationType="fade"
                        visible={supplierModalVisible}
                        onRequestClose={() => {
                          setSupplierModalVisible(!supplierModalVisible);
                          // setSelectedSupplier();
                          // setSupplierID();
                        }}>
                        <ScrollView className="bg-gray-200">
                          <View className="flex-row justify-center items-center border-b border-gray-200">
                            <Text className="flex-1 text-center text-lg text-slate-500">
                              {t('supplierDetails')}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setSupplierModalVisible(false);
                                // setSelectedSupplier();
                                // setSupplierID();
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
                              data={topSuppliers.map(item => {
                                return item.Name;
                              })}
                              onSelect={(selectedItem, index) => {
                                setSelectedSupplier(
                                  topSuppliers.find(
                                    item =>
                                      item.Name.toLowerCase() ===
                                      selectedItem.toLowerCase(),
                                  ),
                                );
                                setSupplierID(
                                  topSuppliers.find(
                                    item =>
                                      item.Name.toLowerCase() ===
                                      selectedItem.toLowerCase(),
                                  ).ID,
                                );
                              }}
                              defaultButtonText={selectedSupplier?.Name || ' '}
                              buttonTextAfterSelection={selectedItem =>
                                selectedItem
                              }
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
                              buttonTextStyle={{
                                color: '#444',
                                textAlign: 'left',
                              }}
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
                              searchPlaceHolder={t('supplierPlaceholder')}
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
                          {selectedSupplier && (
                            <View className="space-y-4">
                              <View
                                className="bg-blue-400 flex-row flex-wrap justify-center items-center mx-4 rounded-md"
                                style={{elevation: 10}}>
                                {supplierTotalExpenditures &&
                                  Object.keys(supplierTotalExpenditures).map(
                                    (key, index) => {
                                      if (key === 'Transactions') {
                                        const translatedKey = t(key);
                                        const value =
                                          supplierTotalExpenditures[key];

                                        return (
                                          <View
                                            key={index}
                                            className="justify-start items-center p-4 w-1/2">
                                            <Text className="text-white text-lg font-black">
                                              {value}
                                            </Text>
                                            <Text className="text-white text-center text-sm">
                                              {translatedKey}
                                            </Text>
                                          </View>
                                        );
                                      } else if (
                                        key === 'GrossValue' ||
                                        key === 'NetValue' ||
                                        key === 'VAT'
                                      ) {
                                        const translatedKey = t(key);
                                        const value =
                                          supplierTotalExpenditures[key];

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
                                    },
                                  )}
                              </View>
                              <View className="space-y-3 mb-4">
                                <View
                                  className="mx-4 rounded-lg flex-1 justify-center items-center bg-white"
                                  style={{
                                    //   backgroundColor: 'rgb(105, 133, 165)',
                                    elevation: 50,
                                  }}>
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
                                      domainPadding={{y: 50, x: 50}}>
                                      <VictoryLegend
                                        orientation="horizontal"
                                        x={75}
                                        y={10}
                                        gutter={20}
                                        title={t('spent')}
                                        centerTitle
                                        style={{
                                          title: {fontSize: 20},
                                          labels: {fill: 'rgb(100 116 139)'},
                                        }}
                                        data={[
                                          {
                                            // name: 'Turnover with VAT',
                                            name: t('NetValue'),
                                            symbol: {fill: 'rgb(96 165 250)'},
                                          },
                                          {
                                            // name: 'Turnover without VAT',
                                            name: t('VAT'),
                                            symbol: {fill: 'red'},
                                          },
                                          {
                                            // name: 'Profit with VAT',
                                            name: t('GrossValue'),
                                            symbol: {fill: 'orange'},
                                          },
                                        ]}
                                      />
                                      {/*x axis start*/}
                                      <VictoryAxis
                                        fixLabelOverlap={true}
                                        style={{
                                          grid: {
                                            stroke: 'rgb(100 116 139)',
                                            strokeDasharray: 'none',
                                          },
                                          axis: {stroke: 'rgb(100 116 139)'},
                                          ticks: {stroke: 'rgb(100 116 139)'},
                                          tickLabels: {
                                            fill: 'rgb(100 116 139)',
                                          },
                                        }}
                                      />
                                      {/*x axis end*/}
                                      {/*y axis start*/}
                                      <VictoryAxis
                                        dependentAxis
                                        tickFormat={tick => {
                                          const suffixes = [
                                            '',
                                            'k',
                                            'M',
                                            'B',
                                            'T',
                                          ]; // Add more suffixes as needed
                                          const magnitude = Math.floor(
                                            Math.log10(tick) / 3,
                                          );
                                          const scaledNumber =
                                            tick / Math.pow(10, magnitude * 3);
                                          const formattedNumber =
                                            scaledNumber.toFixed(0);
                                          return (
                                            formattedNumber +
                                            suffixes[magnitude] +
                                            '€'
                                          );
                                        }}
                                        style={{
                                          grid: {
                                            stroke: 'rgb(100 116 139)',
                                            strokeDasharray: 'none',
                                          },
                                          axis: {stroke: 'rgb(100 116 139)'},
                                          ticks: {stroke: 'rgb(100 116 139)'},
                                          tickLabels: {
                                            fill: 'rgb(100 116 139)',
                                          },
                                        }}
                                      />
                                      {/*y axis end*/}
                                      {/*gross value chart start*/}
                                      <VictoryArea
                                        interpolation="natural"
                                        data={supplierChartGrossValue}
                                        style={{
                                          data: {fill: 'orange'},
                                        }}
                                        animate={{
                                          duration: 1000,
                                          onLoad: {duration: 1000},
                                        }}
                                      />
                                      {/*gross value chart end*/}
                                      {/*net value chart start*/}
                                      <VictoryArea
                                        interpolation="natural"
                                        data={supplierChartNetValue}
                                        style={{
                                          data: {fill: 'rgb(96 165 250)'},
                                        }}
                                        animate={{
                                          duration: 2000,
                                          onLoad: {duration: 2000},
                                        }}
                                      />
                                      {/*net value chart end*/}
                                      {/*vat chart start*/}
                                      <VictoryArea
                                        interpolation="natural"
                                        data={supplierChartVAT}
                                        style={{
                                          data: {fill: 'red'},
                                        }}
                                        animate={{
                                          duration: 3000,
                                          onLoad: {duration: 3000},
                                        }}
                                      />
                                      {/*vat chart end*/}
                                    </VictoryChart>
                                  </ScrollView>
                                </View>
                                <View className="flex-1 justify-center items-center p-4">
                                  <View
                                    className="p-2 mb-4 bg-white rounded-md"
                                    style={{elevation: 10}}>
                                    <Text className="text-black text-lg">
                                      {t('orders')}
                                    </Text>
                                  </View>
                                  <Table
                                    style={{
                                      flex: 1,
                                      backgroundColor: '#fff',
                                      borderRadius: 5,
                                      elevation: 10,
                                    }}>
                                    <Row
                                      data={selectedSupplierTableHeaders.map(
                                        item => {
                                          return t(item);
                                        },
                                      )}
                                      style={{
                                        alignContent: 'center',
                                        backgroundColor: 'rgb(96 165 250)',
                                        paddingRight: 2,
                                        paddingLeft: 2,
                                        borderTopLeftRadius: 5,
                                        borderTopRightRadius: 5,
                                      }}
                                      textStyle={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 14,
                                      }}
                                      widthArr={[100, 100, 100, 100]}
                                    />
                                    <View className="divide-y divide-gray-200 rounded-b-md">
                                      {selectedSupplierTableData.map(
                                        (row, index) => (
                                          <Row
                                            key={index}
                                            style={{
                                              alignContent: 'center',
                                              paddingTop: 4,
                                              paddingBottom: 4,
                                              paddingLeft: 2,
                                              paddingRight: 2,
                                            }}
                                            textStyle={{
                                              textAlign: 'center',
                                              fontSize: 14,
                                              color: 'black',
                                            }}
                                            widthArr={[100, 100, 100, 100]}
                                            data={row}
                                          />
                                        ),
                                      )}
                                    </View>
                                  </Table>
                                </View>
                              </View>
                            </View>
                          )}
                        </ScrollView>
                      </Modal>
                    </View>
                  </View>
                  {/*Top suppliers end*/}
                </View>
              )}
              {/*Total expenditure chart start*/}
              {totalExpenditureChartGrossValue && !loading && (
                <View
                  className="rounded-lg flex-1 mx-4 justify-center items-center bg-white"
                  style={{
                    //   backgroundColor: 'rgb(105, 133, 165)',
                    elevation: 50,
                  }}>
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
                        x={75}
                        y={10}
                        gutter={20}
                        style={{
                          title: {fontSize: 20},
                          labels: {fill: 'rgb(100 116 139)'},
                        }}
                        data={[
                          {
                            name: t('NetValue'),
                            symbol: {fill: 'rgb(96 165 250)'},
                          },
                          {
                            name: t('VAT'),
                            symbol: {fill: 'red'},
                          },
                          {
                            name: t('GrossValue'),
                            symbol: {fill: 'orange'},
                          },
                        ]}
                      />
                      {/*x axis start*/}
                      <VictoryAxis
                        fixLabelOverlap={true}
                        style={{
                          grid: {
                            stroke: 'rgb(229 231 235)',
                            strokeDasharray: 'none',
                          },
                          axis: {stroke: 'rgb(100 116 139)'},
                          ticks: {stroke: 'rgb(229 231 235)'},
                          tickLabels: {
                            fill: 'rgb(100 116 139)',
                          },
                        }}
                      />
                      {/*x axis end*/}
                      {/*y axis start*/}
                      <VictoryAxis
                        dependentAxis
                        tickFormat={tick => {
                          const suffixes = ['', 'k', 'M', 'B', 'T']; // Add more suffixes as needed
                          const magnitude = Math.floor(Math.log10(tick) / 3);
                          const scaledNumber =
                            tick / Math.pow(10, magnitude * 3);
                          const formattedNumber = scaledNumber.toFixed(0);
                          return formattedNumber + suffixes[magnitude];
                        }}
                        style={{
                          grid: {
                            stroke: 'rgb(229 231 235)',
                            strokeDasharray: 'none',
                          },
                          axis: {stroke: 'rgb(100 116 139)'},
                          ticks: {stroke: 'rgb(100 116 139)'},
                          tickLabels: {
                            fill: 'rgb(100 116 139)',
                          },
                        }}
                      />
                      {/*y axis end*/}
                      {/*gross value chart start*/}
                      <VictoryArea
                        interpolation="natural"
                        data={totalExpenditureChartGrossValue}
                        style={{
                          data: {fill: 'orange'},
                        }}
                        animate={{
                          duration: 1000,
                          onLoad: {duration: 1000},
                        }}
                      />
                      {/*gross value chart end*/}
                      {/*net value chart start*/}
                      <VictoryArea
                        interpolation="natural"
                        data={totalExpenditureChartNetValue}
                        style={{
                          data: {fill: 'rgb(96 165 250)'},
                        }}
                        animate={{
                          duration: 2000,
                          onLoad: {duration: 2000},
                        }}
                      />
                      {/*net value chart end*/}
                      {/*vat chart start*/}
                      <VictoryArea
                        interpolation="natural"
                        data={totalExpenditureChartVAT}
                        style={{
                          data: {fill: 'red'},
                        }}
                        animate={{
                          duration: 3000,
                          onLoad: {duration: 3000},
                        }}
                      />
                      {/*vat chart end*/}
                    </VictoryChart>
                  </ScrollView>
                </View>
              )}
              {/*Total expenditure chart end*/}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default ProcurementsScreen;
