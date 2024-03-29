/* eslint-disable quotes */
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
import DrawerHeader from './DrawerHeader';
import React, {useEffect, useState, useMemo} from 'react';
import {selectToken, selectStoreId, selectStrId} from '../features/bootstrap';
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
  VictoryAxis,
  VictoryArea,
} from 'victory-native';
import {useTranslation} from 'react-i18next';
import i18next from '../languages/i18n';

const SalesStatisticsScreen = () => {
  const {t, i18n} = useTranslation();
  const token = useSelector(selectToken);
  const storeId = useSelector(selectStoreId);
  const strId = useSelector(selectStrId);
  const {width, height} = Dimensions.get('screen');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [selectedGroupByDateValue, setSelectedGroupByDate] = useState('WEEK');
  const [salesData, setSalesData] = useState();
  const [totals, setTotals] = useState();
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
  const [storesIds, setStoresIds] = useState([]);
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
  const [productChartTurnoverWithVatData, setProductChartTurnoverWithVatData] =
    useState([]);
  const [
    productChartTurnoverWithoutVatData,
    setProductChartTurnoverWithoutVatData,
  ] = useState([]);
  const [productChartProfitWithVatData, setProductChartProfitWithVatData] =
    useState([]);
  const [
    productChartProfitWithoutVatData,
    setProductChartProfitWithoutVatData,
  ] = useState([]);
  const [prodID, setProdID] = useState(null);
  const [groupBy, setGroupBy] = useState('');

  const handleChangeSftId = inputText => {
    setSftId(inputText);
  };

  useEffect(() => {
    setStoresIds(() => {
      let arr = [];
      arr.push(strId);
      return arr;
    });
  }, [strId]);

  const fetchDataFromBoApi = async () => {
    setLoading(true);

    let groupByDate;
    let dayDiff = Math.ceil(
      (toDate.setHours(0, 0, 0, 0) - fromDate.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24),
    );

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

    if (
      // __DEV__ &&
      token &&
      storesIds.length > 0
    ) {
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
      // console.log(raw);
      try {
        const response = await fetch(
          // `http://${ip}:3000/bo/Invoices/FetchSalesDataServerSide`,
          `https://bo-api-gr.intalepoint.com/bo/Invoices/FetchSalesDataServerSide`,
          requestOptions,
        );
        const data = await response.json();
        // console.log(data);
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
        setDailyTransactionsAverage(data.TransactionsSalesDto);
        let totalSalesChartData;
        totalSalesChartData = data.TotalSalesChartDtos.sort((a, b) => {
          const dateA = new Date(a.InvoiceDateTime);
          const dateB = new Date(b.InvoiceDateTime);
          return dateA - dateB;
        });
        let groupedData = {};
        let summedGroupedData = [];
        let keys;
        switch (groupByDate) {
          case 'hours':
            groupedData = totalSalesChartData.reduce((groups, item) => {
              const datePart = item.InvoiceDateTime.substring(0, 10);
              if (!groups[datePart]) {
                groups[datePart] = [];
              }
              groups[datePart].push(item);
              return groups;
            }, {});
            keys = Object.keys(groupedData);
            // console.log(groupedData[keys[0]]);
            let groupedDataByHour = groupedData[keys[0]].reduce(
              (groups, item) => {
                const datePart = item.InvoiceDateTime.substring(11, 13);
                if (!groups[datePart]) {
                  groups[datePart] = [];
                }
                groups[datePart].push(item);
                return groups;
              },
              {},
            );

            summedGroupedData = Object.keys(groupedDataByHour).map(key => {
              const group = groupedDataByHour[key];
              const datePart = group[0].InvoiceDateTime.substring(11, 13);

              const totals2 = group.reduce(
                (acc, item) => {
                  acc.TotalProfit += item.TotalProfit;
                  acc.TotalProfitMerged += item.TotalProfitMerged;
                  acc.TurnOver += item.TurnOver;
                  acc.TurnOverWithoutVAT += item.TurnOverWithoutVAT;
                  return acc;
                },
                {
                  TotalProfit: 0,
                  TotalProfitMerged: 0,
                  TurnOver: 0,
                  TurnOverWithoutVAT: 0,
                },
              );

              return {
                date: datePart,
                TotalProfit: parseFloat(totals2.TotalProfit.toFixed(2)),
                TotalProfitMerged: parseFloat(
                  totals2.TotalProfitMerged.toFixed(2),
                ),
                TurnOver: parseFloat(totals2.TurnOver.toFixed(2)),
                TurnOverWithoutVAT: parseFloat(
                  totals2.TurnOverWithoutVAT.toFixed(2),
                ),
              };
            });

            summedGroupedData.sort((a, b) => {
              return parseInt(a.date, 10) - parseInt(b.date, 10);
            });

            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                arr.push({
                  x: `${item.date}:00`,
                  y: item.TurnOver,
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                arr.push({
                  x: `${item.date}:00`,
                  y: item.TurnOverWithoutVAT,
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                arr.push({
                  x: `${item.date}:00`,
                  y: item.TotalProfitMerged,
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                arr.push({
                  x: `${item.date}:00`,
                  y: item.TotalProfit,
                });
              });
              return arr;
            });
            break;
          case 'days':
            groupedData = totalSalesChartData.reduce((groups, item) => {
              const datePart = item.InvoiceDateTime.substring(0, 10);
              if (!groups[datePart]) {
                groups[datePart] = [];
              }
              groups[datePart].push(item);
              return groups;
            }, {});

            summedGroupedData = Object.keys(groupedData).map(key => {
              const group = groupedData[key];
              const datePart = group[0].InvoiceDateTime.substring(0, 10);

              const totals2 = group.reduce(
                (acc, item) => {
                  acc.TotalProfit += item.TotalProfit;
                  acc.TotalProfitMerged += item.TotalProfitMerged;
                  acc.TurnOver += item.TurnOver;
                  acc.TurnOverWithoutVAT += item.TurnOverWithoutVAT;
                  return acc;
                },
                {
                  TotalProfit: 0,
                  TotalProfitMerged: 0,
                  TurnOver: 0,
                  TurnOverWithoutVAT: 0,
                },
              );

              return {
                date: datePart,
                TotalProfit: totals2.TotalProfit.toFixed(2),
                TotalProfitMerged: totals2.TotalProfitMerged.toFixed(2),
                TurnOver: totals2.TurnOver.toFixed(2),
                TurnOverWithoutVAT: totals2.TurnOverWithoutVAT.toFixed(2),
              };
            });

            // console.log(summedGroupedData);

            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                arr.push({
                  // x: `${item.Hour}`,
                  x: item.date,
                  y: parseFloat(item.TurnOver),
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                arr.push({
                  // x: `${item.Hour}`,
                  x: item.date,
                  y: parseFloat(item.TurnOverWithoutVAT),
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                arr.push({
                  // x: `${item.Hour}`,
                  x: item.date,
                  y: parseFloat(item.TotalProfitMerged),
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                arr.push({
                  // x: `${item.Hour}`,
                  x: item.date,
                  y: parseFloat(item.TotalProfit),
                });
              });
              return arr;
            });
            break;
          case 'weeks':
            groupedData = totalSalesChartData.reduce((groups, item) => {
              const year = item.Year;
              const week = item.Hour;

              if (!groups[year]) {
                groups[year] = {};
              }
              if (!groups[year][week]) {
                groups[year][week] = [];
              }
              groups[year][week].push(item);
              return groups;
            }, {});

            keys = Object.keys(groupedData);
            let innerKeys = Object.keys(groupedData[keys[0]]);
            // console.log(keys, innerKeys);
            // console.log(groupedData[keys[0]][innerKeys[0]]);

            summedGroupedData = Object.keys(groupedData).map(yearKey => {
              const accumulatorYear = Object.keys(groupedData[yearKey]).map(
                weekKey => {
                  const accumulatorWeek = {
                    date: groupedData[yearKey][
                      weekKey
                    ][0].InvoiceDateTime.substring(0, 10),
                    TotalProfit: 0,
                    TotalProfitMerged: 0,
                    TurnOver: 0,
                    TurnOverWithoutVAT: 0,
                  };

                  groupedData[yearKey][weekKey].forEach(dayData => {
                    accumulatorWeek.TotalProfit += parseFloat(
                      dayData.TotalProfit.toFixed(2),
                    );
                    accumulatorWeek.TotalProfitMerged += parseFloat(
                      dayData.TotalProfitMerged.toFixed(2),
                    );
                    accumulatorWeek.TurnOver += parseFloat(
                      dayData.TurnOver.toFixed(2),
                    );
                    accumulatorWeek.TurnOverWithoutVAT += parseFloat(
                      dayData.TurnOverWithoutVAT.toFixed(2),
                    );
                  });

                  return accumulatorWeek;
                },
              );

              return {year: yearKey, data: accumulatorYear};
            });

            // console.log(summedGroupedData[0].data[0]);

            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              summedGroupedData.map(year => {
                year.data.map(week => {
                  arr.push({
                    x: week.date,
                    y: week.TurnOver,
                  });
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(year => {
                year.data.map(week => {
                  arr.push({
                    x: week.date,
                    y: week.TurnOverWithoutVAT,
                  });
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              summedGroupedData.map(year => {
                year.data.map(week => {
                  arr.push({
                    x: week.date,
                    y: week.TotalProfitMerged,
                  });
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(year => {
                year.data.map(week => {
                  arr.push({
                    x: week.date,
                    y: week.TotalProfit,
                  });
                });
              });
              return arr;
            });
            break;
          case 'months':
            totalSalesChartData.forEach(item => {
              // Extract year and month from InvoiceDateTime
              const date = new Date(item.InvoiceDateTime);
              const year = date.getFullYear();
              const month = date.getMonth() + 1; // Month is 0-indexed, so add 1.

              // Create year-level grouping if it doesn't exist
              if (!groupedData[year]) {
                groupedData[year] = {};
              }

              // Create month-level grouping if it doesn't exist
              if (!groupedData[year][month]) {
                groupedData[year][month] = [];
              }

              // Push the item to the month-level grouping
              groupedData[year][month].push(item);
            });

            Object.keys(groupedData).forEach(year => {
              Object.keys(groupedData[year]).forEach(month => {
                const date = groupedData[year][month][0].InvoiceDateTime;
                const monthlyData = {
                  date: date,
                  TurnOver: 0,
                  TurnOverWithoutVAT: 0,
                  TotalProfit: 0,
                  TotalProfitMerged: 0,
                };
                groupedData[year][month].forEach(invoice => {
                  monthlyData.TotalProfit += parseFloat(
                    invoice.TotalProfit.toFixed(2),
                  );
                  monthlyData.TotalProfitMerged += parseFloat(
                    invoice.TotalProfitMerged.toFixed(2),
                  );
                  monthlyData.TurnOver += parseFloat(
                    invoice.TurnOver.toFixed(2),
                  );
                  monthlyData.TurnOverWithoutVAT += parseFloat(
                    invoice.TurnOverWithoutVAT.toFixed(2),
                  );
                });
                summedGroupedData.push(monthlyData);
              });
            });

            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                let date = new Date(item.date);
                arr.push({
                  x: `${date.getMonth() + 1}/${date.getFullYear()}`,
                  y: item.TurnOver,
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                let date = new Date(item.date);
                arr.push({
                  x: `${date.getMonth() + 1}/${date.getFullYear()}`,
                  y: item.TurnOverWithoutVAT,
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                let date = new Date(item.date);
                arr.push({
                  x: `${date.getMonth() + 1}/${date.getFullYear()}`,
                  y: item.TotalProfitMerged,
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                let date = new Date(item.date);
                arr.push({
                  x: `${date.getMonth() + 1}/${date.getFullYear()}`,
                  y: item.TotalProfit,
                });
              });
              return arr;
            });
            break;
          case 'years':
            totalSalesChartData.forEach(item => {
              // Extract year and month from InvoiceDateTime
              const date = new Date(item.InvoiceDateTime);
              const year = date.getFullYear();

              // Create year-level grouping if it doesn't exist
              if (!groupedData[year]) {
                groupedData[year] = [];
              }

              // Push the item to the month-level grouping
              groupedData[year].push(item);
            });

            Object.keys(groupedData).forEach(year => {
              const date = groupedData[year][0].InvoiceDateTime;
              const annualData = {
                date: date,
                TurnOver: 0,
                TurnOverWithoutVAT: 0,
                TotalProfit: 0,
                TotalProfitMerged: 0,
              };
              groupedData[year].forEach(invoice => {
                annualData.TotalProfit += parseFloat(
                  invoice.TotalProfit.toFixed(2),
                );
                annualData.TotalProfitMerged += parseFloat(
                  invoice.TotalProfitMerged.toFixed(2),
                );
                annualData.TurnOver += parseFloat(invoice.TurnOver.toFixed(2));
                annualData.TurnOverWithoutVAT += parseFloat(
                  invoice.TurnOverWithoutVAT.toFixed(2),
                );
              });
              summedGroupedData.push(annualData);
            });

            setSalesChartTurnoverWithVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                let date = new Date(item.date);
                arr.push({
                  x: `${date.getFullYear()}`,
                  y: item.TurnOver,
                });
              });
              return arr;
            });
            setSalesChartTurnoverWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                let date = new Date(item.date);
                arr.push({
                  x: `${date.getFullYear()}`,
                  y: item.TurnOverWithoutVAT,
                });
              });
              return arr;
            });
            setSalesChartProfitWithVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                let date = new Date(item.date);
                arr.push({
                  x: `${date.getFullYear()}`,
                  y: item.TotalProfitMerged,
                });
              });
              return arr;
            });
            setSalesChartProfitWithoutVatData(() => {
              let arr = [];
              summedGroupedData.map(item => {
                let date = new Date(item.date);
                arr.push({
                  x: `${date.getFullYear()}`,
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

  const fetchProductSalesDetailsDataFromBoApi = async () => {
    setChartLoading(true);
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
      let data;
      if (groupBy === 'days') {
        if (fromDate.getMonth() !== toDate.getMonth()) {
          const dateToFormatted = new Date(
            fromDate.getFullYear(),
            fromDate.getMonth() + 1,
          )
            .toISOString()
            .slice(0, 10)
            .concat(' 23:59:59');
          const response1 = await fetch(
            // `http://${ip}:3000/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${fromDateFormatted}&toDate=${dateToFormatted}&dateGroupBy=${groupBy}&storeIds=1&prodID=${prodID}`,
            `https://bo-api-gr.intalepoint.com/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${fromDateFormatted}&toDate=${dateToFormatted}&dateGroupBy=${groupBy}&storeIds=${strId}&prodID=${prodID}`,
            requestOptions,
          );
          const dateFromFormatted = new Date(
            toDate.getFullYear(),
            toDate.getMonth(),
            2,
          )
            .toISOString()
            .slice(0, 10)
            .concat(' 00:00:00');
          const response2 = await fetch(
            // `http://${ip}:3000/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${dateFromFormatted}&toDate=${toDateFormatted}&dateGroupBy=${groupBy}&storeIds=1&prodID=${prodID}`,
            `https://bo-api-gr.intalepoint.com/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${dateFromFormatted}&toDate=${toDateFormatted}&dateGroupBy=${groupBy}&storeIds=${strId}&prodID=${prodID}`,
            requestOptions,
          );
          const data1 = await response1.json();

          const data1Formatted = data1.map(item => ({
            ...item,
            Date: `${item.DatePart}/${
              fromDate.getMonth() + 1
            }/${fromDate.getFullYear()}`,
          }));
          const data2 = await response2.json();
          const data2Formatted = data2.map(item => ({
            ...item,
            Date: `${item.DatePart}/${
              toDate.getMonth() + 1
            }/${toDate.getFullYear()}`,
          }));
          data = [...data1Formatted, ...data2Formatted];
        } else {
          const response = await fetch(
            // `http://${ip}:3000/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}&dateGroupBy=${groupBy}&storeIds=1&prodID=${prodID}`,
            `https://bo-api-gr.intalepoint.com/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}&dateGroupBy=${groupBy}&storeIds=${strId}&prodID=${prodID}`,
            requestOptions,
          );
          const dataUnformatted = await response.json();
          data = dataUnformatted.map(item => ({
            ...item,
            Date: `${item.DatePart}/${
              toDate.getMonth() + 1
            }/${toDate.getFullYear()}`,
          }));
        }
      } else {
        const response = await fetch(
          // `http://${ip}:3000/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}&dateGroupBy=${groupBy}&storeIds=1&prodID=${prodID}`,
          `https://bo-api-gr.intalepoint.com/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}&dateGroupBy=${groupBy}&storeIds=${strId}&prodID=${prodID}`,
          requestOptions,
        );
        data = await response.json();
      }
      switch (groupBy) {
        case 'hours':
          setProductChartTurnoverWithVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.DatePart.toString()}:00`,
                y: item.TurnOverWithVat,
              });
            });
            if (arr.length > 1) {
              return arr;
            } else
              return [
                {x: `${(data[0].DatePart - 1).toString()}:00`, y: 0},
                ...arr,
                {x: `${(data[0].DatePart + 1).toString()}:00`, y: 0},
              ];
          });
          setProductChartTurnoverWithoutVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.DatePart.toString()}:00`,
                y: item.TurnOverWithoutVat,
              });
            });
            return arr;
          });
          setProductChartProfitWithVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.DatePart.toString()}:00`,
                y: item.ProfitWithVat,
              });
            });
            return arr;
          });
          setProductChartProfitWithoutVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.DatePart.toString()}:00`,
                y: item.ProfitWithoutVat,
              });
            });
            return arr;
          });
          break;
        case 'days':
          setProductChartTurnoverWithVatData(() => {
            let arr = [];
            data.map(item => arr.push({x: item.Date, y: item.TurnOverWithVat}));
            return arr;
          });
          setProductChartTurnoverWithoutVatData(() => {
            let arr = [];
            data.map(item =>
              arr.push({x: item.Date, y: item.TurnOverWithoutVat}),
            );
            return arr;
          });
          setProductChartProfitWithVatData(() => {
            let arr = [];
            data.map(item => arr.push({x: item.Date, y: item.ProfitWithVat}));
            return arr;
          });
          setProductChartProfitWithoutVatData(() => {
            let arr = [];
            data.map(item =>
              arr.push({x: item.Date, y: item.ProfitWithoutVat}),
            );
            return arr;
          });
          break;
        case 'weeks':
          setProductChartTurnoverWithVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `Week ${item.DatePart} of ${item.Year}`,
                y: item.TurnOverWithVat,
              });
            });
            return arr;
          });
          setProductChartTurnoverWithoutVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `Week ${item.DatePart} of ${item.Year}`,
                y: item.TurnOverWithoutVat,
              });
            });
            return arr;
          });
          setProductChartProfitWithVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `Week ${item.DatePart} of ${item.Year}`,
                y: item.ProfitWithVat,
              });
            });
            return arr;
          });
          setProductChartProfitWithoutVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `Week ${item.DatePart} of ${item.Year}`,
                y: item.ProfitWithoutVat,
              });
            });
            return arr;
          });
          break;
        case 'months':
          data.sort((a, b) => {
            if (a.Year === b.Year) {
              return a.DatePart - b.DatePart;
            }
            return a.Year - b.Year;
          });

          setProductChartTurnoverWithVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.DatePart}/${item.Year}`,
                y: item.TurnOverWithVat,
              });
            });
            return arr;
          });
          setProductChartTurnoverWithoutVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.DatePart}/${item.Year}`,
                y: item.TurnOverWithoutVat,
              });
            });
            return arr;
          });
          setProductChartProfitWithVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.DatePart}/${item.Year}`,
                y: item.ProfitWithVat,
              });
            });
            return arr;
          });
          setProductChartProfitWithoutVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.DatePart}/${item.Year}`,
                y: item.ProfitWithoutVat,
              });
            });
            return arr;
          });
          break;
        case 'years':
          setProductChartTurnoverWithVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.Year}`,
                y: item.TurnOverWithVat,
              });
            });
            return arr;
          });
          setProductChartTurnoverWithoutVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.Year}`,
                y: item.TurnOverWithoutVat,
              });
            });
            return arr;
          });
          setProductChartProfitWithVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.Year}`,
                y: item.ProfitWithVat,
              });
            });
            return arr;
          });
          setProductChartProfitWithoutVatData(() => {
            let arr = [];
            data.map(item => {
              arr.push({
                x: `${item.Year}`,
                y: item.ProfitWithoutVat,
              });
            });
            return arr;
          });
          break;
        default:
          break;
      }
    }
    setChartLoading(false);
  };

  const getDates = () => {
    const days = [];
    const currentDate = new Date(fromDate);

    while (currentDate <= toDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

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

  useEffect(() => {
    if (prodID !== null && prodID !== undefined) {
      fetchProductSalesDetailsDataFromBoApi();
    }
  }, [prodID]);

  // const defaultSelectedGroupByDateValue = useMemo(
  //   () => selectedGroupByDateValue ,
  //   [selectedGroupByDateValue],
  // );

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

  useEffect(() => {
    setCategoriesDetailsTableDataTrunc(categoriesDetailsTableData.slice(0, 10));
  }, [categoriesDetailsTableData]);

  useEffect(() => {
    fetchDataFromBoApi();
  }, [fromDateFormatted, toDateFormatted, storesIds]);

  return (
    <View className="flex-1 bg-gray-300">
      {/* Comment out The DrawerHeader to remove it from app */}
      <TouchableOpacity style={{width: width, zIndex: 1}}>
        <DrawerHeader />
      </TouchableOpacity>
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
                        const startRange1 = new Date(date.getFullYear(), 9, 29); // October 29th
                        const endRange1 = new Date(
                          date.getFullYear() + 1,
                          2,
                          26,
                        ); // March 26th of the following year

                        // Check if the date is within the first range (29 October to 26 March)
                        if (date >= startRange1 && date <= endRange1) {
                          date.setHours(date.getHours() + 2); // Add 3 hours
                        } else {
                          date.setHours(date.getHours() + 3); // Add 2 hours
                        }
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
                        const startRange1 = new Date(date.getFullYear(), 9, 29); // October 29th
                        const endRange1 = new Date(
                          date.getFullYear() + 1,
                          2,
                          26,
                        ); // March 26th of the following year

                        // Check if the date is within the first range (29 October to 26 March)
                        if (date >= startRange1 && date <= endRange1) {
                          date.setHours(date.getHours() + 2); // Add 3 hours
                        } else {
                          date.setHours(date.getHours() + 3); // Add 2 hours
                        }
                        setOpenToDate(false);
                        setToDate(date);
                        setToDateFormatted(
                          date.toISOString().slice(0, 10).concat(' 00:00:00'),
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
                            <TouchableOpacity
                              key={item.ProductId}
                              onPress={() => {
                                setProdID(item.ProductId);
                                setSelectedProduct(item);
                                setProductModalVisible(!productModalVisible);
                              }}>
                              <Text
                                key={salesData.TopSellingProductDtos.ProductId}
                                className="text-center py-2 text-gray-500 font-bold"
                                // style={{color: 'rgb(74, 118, 194)'}}
                              >
                                {item.ProductName.toUpperCase()}
                              </Text>
                            </TouchableOpacity>
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
                        animationType="fade"
                        visible={productModalVisible}
                        onRequestClose={() => {
                          setProductModalVisible(!productModalVisible);
                          setSelectedProduct(null);
                          setProdID(null);
                        }}>
                        <ScrollView>
                          <View className="flex-row justify-center items-center p-4 border-b border-gray-200">
                            <Text className="flex-1 text-center text-lg text-slate-500">
                              {t('productSalesDetails')}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setProductModalVisible(false);
                                setSelectedProduct(null);
                                setProdID(null);
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
                                item => {
                                  return item.ProductName;
                                },
                              )}
                              onSelect={(selectedItem, index) => {
                                setSelectedProduct(
                                  salesData.TopSellingProductDtos.find(
                                    item =>
                                      item.ProductName.toLowerCase() ===
                                      selectedItem.toLowerCase(),
                                  ),
                                );
                                setProdID(
                                  salesData.TopSellingProductDtos?.find(
                                    item =>
                                      item.ProductName.toLowerCase() ===
                                      selectedItem.toLowerCase(),
                                  ).ProductId,
                                );
                              }}
                              defaultButtonText={
                                selectedProduct?.ProductName || ' '
                              }
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
                              <View
                                className="bg-yellow-400 flex-row flex-wrap justify-center items-center mx-4 rounded-md"
                                style={{elevation: 10}}>
                                {selectedProduct &&
                                  Object.keys(selectedProduct).map(
                                    (key, index) => {
                                      if (key === 'Quantity') {
                                        const translatedKey = t(key);
                                        const value = selectedProduct[key];

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
                                    },
                                  )}
                              </View>
                              <View
                                className="bg-purple-400 flex-row items-start mx-4 rounded-md py-6"
                                style={{elevation: 10}}>
                                {selectedProduct &&
                                  Object.keys(selectedProduct).map(
                                    (key, index) => {
                                      if (
                                        key === 'ProfitOnTurnOverPercentage' ||
                                        key === 'ProfitWithVat' ||
                                        key === 'ProfitWithoutVat'
                                      ) {
                                        const translatedKey = t(key);
                                        const value = selectedProduct[key];

                                        return (
                                          <View
                                            key={index}
                                            className="justify-center items-center w-1/3 px-4">
                                            <Text className="text-white text-lg font-black">
                                              {key ===
                                              'ProfitOnTurnOverPercentage'
                                                ? `${value} %`
                                                : `${value} €`}
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
                              {chartLoading ? (
                                <ActivityIndicator
                                  color="rgb(34 211 238)"
                                  size="large"
                                />
                              ) : (
                                <View
                                  className="mx-4 rounded-lg flex-1 justify-center items-center mb-2 bg-white"
                                  style={{
                                    // backgroundColor: 'rgb(105, 133, 165)',
                                    elevation: 50,
                                  }}>
                                  <View
                                    className="w-full rounded-t-lg bg-white"
                                    // style={{
                                    // backgroundColor: 'rgb(86, 113, 144)',
                                    // }}
                                  >
                                    <Text className="text-center underline py-2 text-slate-500">
                                      {t('TotalTurnoverAndProfit')}
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
                                          labels: {fill: 'rgb(100 116 139)'},
                                        }}
                                        data={[
                                          {
                                            // name: 'Turnover with VAT',
                                            name: t('TurnOverWithVat'),
                                            symbol: {fill: 'orange'},
                                          },
                                          {
                                            // name: 'Turnover without VAT',
                                            name: t('TurnOverWithoutVat'),
                                            symbol: {fill: 'rgb(245, 185, 66)'},
                                          },
                                          {
                                            // name: 'Profit with VAT',
                                            name: t('ProfitWithVat'),
                                            symbol: {fill: 'purple'},
                                          },
                                          {
                                            // name: 'Profit without VAT',
                                            name: t('ProfitWithoutVat'),
                                            symbol: {fill: 'rgb(147, 66, 245)'},
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
                                      {/*turnover with vat start*/}
                                      <VictoryArea
                                        interpolation="natural"
                                        data={productChartTurnoverWithVatData}
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
                                        data={
                                          productChartTurnoverWithoutVatData
                                        }
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
                                        data={productChartProfitWithVatData}
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
                                        data={productChartProfitWithoutVatData}
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
                        {t('categoryDetails')}
                      </Text>
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
                      Object.keys(dailyTransactionsAverage).map(
                        (key, index) => {
                          const translatedKey = t(key);
                          const value = dailyTransactionsAverage[key];

                          return (
                            <View className="justify-center items-center rounded-md space-y-2">
                              <Text className="text-white text-xl font-black">
                                {value}
                              </Text>
                              <Text className="text-white">
                                {translatedKey}
                              </Text>
                            </View>
                          );
                        },
                      )
                    ) : (
                      <Text className="text-white">{t('noDataAvailable')}</Text>
                    )}
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
                        {t('TotalTurnoverAndProfit')}
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
                            {
                              name: t('TurnOverWithVat'),
                              symbol: {fill: 'orange'},
                            },
                            {
                              name: t('TurnOverWithoutVat'),
                              symbol: {fill: 'rgb(245, 185, 66)'},
                            },
                            {
                              name: t('ProfitWithVat'),
                              symbol: {fill: 'purple'},
                            },
                            {
                              name: t('ProfitWithoutVat'),
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
                          tickFormat={tick => {
                            const suffixes = ['', 'k', 'M', 'B', 'T']; // Add more suffixes as needed
                            const magnitude = Math.floor(Math.log10(tick) / 3);
                            const scaledNumber =
                              tick / Math.pow(10, magnitude * 3);
                            const formattedNumber = scaledNumber.toFixed(0);
                            return formattedNumber + suffixes[magnitude] + '€';
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
                )}
                {/*Graph end*/}
              </ScrollView>
            ) : null}
            {/*Widgets end*/}
          </View>
        )}
      </SafeAreaView>
    </View>
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
