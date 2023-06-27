/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
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
  processColor,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {selectToken} from '../features/bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {ip} from '@env';
import {BarChart} from 'react-native-charts-wrapper';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
} from 'victory-native';

const StoresScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [storesFromBoApi, setStoresFromBoApi] = useState();
  const [loading, setLoading] = useState(false);
  const [fromDate1, setFromDate1] = useState(new Date());
  const [fromDate2, setFromDate2] = useState('');
  const [toDate1, setToDate1] = useState(new Date());
  const [toDate2, setToDate2] = useState('');
  const [sftId, setSftId] = useState(1);
  const [groupByDate, setGroupByDate] = useState('WEEK');
  const [storesIds, setStoresIds] = useState([1]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  //config for victoryBar
  const [victoryBarData, setVictoryBarData] = useState([]);
  //end of victory bar
  const {width, height} = Dimensions.get('screen');
  //react-native-charts-wrapper
  const [legend, setLegend] = useState({
    enabled: false,
    textSize: 14,
    form: 'SQUARE',
    formSize: 14,
    xEntrySpace: 10,
    yEntrySpace: 0,
    formToTextSpace: 5,
    wordWrapEnabled: true,
    maxSizePercent: 0.5,
  });
  const [barChartData, setBarChartData] = useState({
    dataSets: [
      {
        values: [],
        label: 'Bar Chart',
        config: {
          color: processColor('teal'),
          barShadowColor: processColor('lightgrey'),
          highlightAlpha: 90,
          highlightColor: processColor('red'),
        },
      },
    ],
    config: {
      barWidth: 0.7,
    },
  });
  const [highlights, setHighlights] = useState([{x: 3}, {x: 6}]);
  const [xAxis, setXAxis] = useState({
    granularityEnabled: true,
    granularity: 1,
  });
  //end of react-native-charts-wrapper

  const handleChangeSftId = inputText => {
    setSftId(inputText);
  };

  const fetchDataFromBoApi = async () => {
    setLoading(true);
    // console.log(fromDate, toDate, sftId, groupByDate, storesIds, token);
    if (__DEV__ && token) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var raw = JSON.stringify({
        fromDate: fromDate2,
        toDate: toDate2,
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
      setStoresFromBoApi(data);
      data.CategoriesSalesDtos.map(category => {
        setBarChartData(prevState => ({
          ...prevState,
          dataSets: [
            {
              ...prevState.dataSets[0],
              values: [
                ...prevState.dataSets[0].values,
                {y: category.Turnover, marker: category.CategoryName},
              ],
            },
          ],
        }));
        setVictoryBarData(prevState => [
          ...prevState,
          {y: category.Turnover, label: category.CategoryName},
        ]);
        // setXAxis(prevState => ({
        //   ...prevState,
        //   valueFormatter: [...prevState.valueFormatter, category.CategoryName],
        // }));
      });
    }
    // end of request
    setLoading(false);
  };

  useEffect(() => {
    // fetchDataFromBoApi();
    console.log('====================================');
    console.log(victoryBarData);
    console.log('====================================');
  }, [victoryBarData]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View className="w-10/12 mt-10">
          <TouchableOpacity
            onPress={() => {
              setOpen(false);
              setOpen2(false);
              setStoresFromBoApi();
              setVictoryBarData([]);
            }}
            className="p-2 my-5 border border-solid bg-gray-300 border-cyan-200 rounded-xl"
            style={{elevation: 10}}>
            <Text className="text-cyan-400 text-center font-bold text-3xl">
              {storesFromBoApi ? 'New search' : 'Search for data'}
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
                    setOpen(false);
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
                    setOpen2(false);
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
              <TouchableOpacity className="bg-red-300 rounded-lg my-2 p-2 justify-center items-center">
                <Text className="text-center text-xl">Group By: </Text>
                <Picker
                  style={{
                    width: '50%',
                  }}
                  selectedValue={groupByDate}
                  onValueChange={(itemValue, itemIndex) =>
                    setGroupByDate(itemValue)
                  }>
                  <Picker.Item label="HOUR" value="HOUR" />
                  <Picker.Item label="DAY" value="DAY" />
                  <Picker.Item label="WEEK" value="WEEK" />
                  <Picker.Item label="MONTH" value="MONTH" />
                  <Picker.Item label="YEAR" value="YEAR" />
                </Picker>
              </TouchableOpacity>

              <View className="bg-gray-200 rounded-lg my-2 p-2">
                <Text className="text-center text-xl">Shift Id: </Text>
                <TextInput
                  onChangeText={handleChangeSftId}
                  style={styles.input}
                  selectTextOnFocus
                  placeholder="Shift Id"
                  placeholderTextColor={'darkgrey'}
                  keyboardType="number-pad"
                  clearButtonMode={'always'}
                  returnKeyType="done"
                />
              </View>
              <TouchableOpacity
                className="bg-gray-600 justify-center items-center my-2 p-2 rounded-lg"
                onPress={() => fetchDataFromBoApi()}>
                <Text className="text-lg text-white">Submit</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {storesFromBoApi && (
            <ScrollView className="mb-10">
              <View
                className="divide-y-2 divide-cyan-400"
                style={{elevation: 50}}>
                {storesFromBoApi.CategoriesSalesDtos?.map(category => {
                  return (
                    <View className="p-2 bg-gray-200" key={category.CategoryId}>
                      <Text className="m-1 text-xl text-black">
                        Category Id: {category.CategoryId}
                      </Text>
                      <Text className="m-1 text-xl text-black">
                        Category Name: {category.CategoryName}
                      </Text>
                      <Text className="m-1 text-xl text-black">
                        Cost including vat: {category.CostInclVat} €
                      </Text>
                      <Text className="m-1 text-xl text-black">
                        Profit percentage: {category.ProfitPercentage} %
                      </Text>
                      <Text className="m-1 text-xl text-black">
                        Profit with vat: {category.ProfitWithVat} €
                      </Text>
                      <Text className="m-1 text-xl text-black">
                        Profit without vat: {category.ProfitWithoutVat} €
                      </Text>
                      <Text className="m-1 text-xl text-black">
                        Quantity: {category.QuantityTmx}
                      </Text>
                      <Text className="m-1 text-xl text-black">
                        Turnover: {category.Turnover} €
                      </Text>
                      <Text className="m-1 text-xl text-black">
                        Vat: {category.Vat} %
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View className="flex-1 justify-center items-center my-10 p-2">
                <BarChart
                  style={{
                    width: width / 1.2,
                    height: height / 1.5,
                  }}
                  data={barChartData}
                  xAxis={xAxis}
                  yAxis={{axisMinimum: 0}}
                  animation={{durationX: 1000}}
                  legend={legend}
                  gridBackgroundColor={processColor('#ffffff')}
                  visibleRange={{x: {min: 5, max: 5}}}
                  drawBarShadow={false}
                  drawValueAboveBar
                  drawHighlightArrow
                  // onSelect={this.handleSelect.bind(this)}
                  highlights={highlights}
                  // onChange={event => console.log(event.nativeEvent)}
                  marker={{enabled: true}}
                  chartDescription={{
                    text: 'Categories Sales Dtos',
                    textSize: 16,
                  }}
                />
              </View>
              <View className="mb-20 pt-2 flex-1 items-center">
                <Text>Categories Sales Dtos</Text>
                <VictoryChart
                  theme={VictoryTheme.material}
                  height={height / 1.5}
                  domainPadding={{y: 50}}
                  width={width / 1.1}>
                  <VictoryBar
                    data={victoryBarData}
                    style={{
                      data: {fill: 'orange'},
                    }}
                    animate={{
                      duration: 2000,
                      onLoad: {duration: 1000},
                    }}
                    barRatio={0.8}
                    labelComponent={
                      <VictoryLabel
                        angle={90}
                        textAnchor="end"
                        dy={7}
                        dx={-5}
                        style={{fill: 'teal'}}
                      />
                    }
                  />
                </VictoryChart>
              </View>
            </ScrollView>
          )}
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

export default StoresScreen;
