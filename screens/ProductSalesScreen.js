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
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {selectToken} from '../features/bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {ip} from '@env';

const ProductSalesScreen = () => {
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('screen');
  const token = useSelector(selectToken);
  const [storesFromBoApi, setStoresFromBoApi] = useState();
  const [stores2FromBoApi, setStores2FromBoApi] = useState();
  const [stores3FromBoApi, setStores3FromBoApi] = useState();
  const [loading, setLoading] = useState(false);
  const [fromDate1, setFromDate1] = useState(new Date());
  const [fromDate2, setFromDate2] = useState(''); // Use this for url inputs
  const [toDate1, setToDate1] = useState(new Date());
  const [toDate2, setToDate2] = useState(''); // Use this for url inputs
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [openA2, setOpenA2] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [openB2, setOpenB2] = useState(false);
  const [groupByDate, setGroupByDate] = useState('WEEK');
  const [selectedLabel, setSelectedLabel] = useState('ProductSalesData');
  const [productId, setProductId] = useState(1);
  const [categoryId, setCategoryId] = useState(1);
  const [prodId, setProdId] = useState(1);

  const handleChangeProductId = inputText => {
    setProductId(inputText);
  };

  const handleChangeCategoryId = inputText => {
    setCategoryId(inputText);
  };

  const handleChangeProdId = inputText => {
    setProdId(inputText);
  };

  const fetchProductSalesDataFromBoApi = async () => {
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
        `http://${ip}:3000/bo/Invoices/GetProductSalesPropertiesServerSide?fromDate=${fromDate2}&toDate=${toDate2}&productId=${productId}&groupByDate=${groupByDate}&storesIds=1`,
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
      setStoresFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchProductSalesDetailsDataFromBoApi = async () => {
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
        `http://${ip}:3000/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${fromDate2}&toDate=${toDate2}&dateGroupBy=${groupByDate}&storeIds=1&prodID=${prodId}`,
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
      setStores2FromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchProductByCategoryDataFromBoApi = async () => {
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
        `http://${ip}:3000/bo/Invoices/GetProductsByCategoryServerSide?fromDate=${fromDate2}&toDate=${toDate2}&categoryId=${categoryId}&storesIds=1`,
        requestOptions,
      );
      const data = await response.json();
      console.log(data);
      setStores3FromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  useEffect(() => {
    // fetchProductSalesDataFromBoApi();
    // fetchProductSalesDetailsDataFromBoApi();
    // fetchProductByCategoryDataFromBoApi();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View className="w-10/12">
          <TouchableOpacity
            onPress={() => {
              setOpen(false);
              setOpen2(false);
              setStoresFromBoApi();
              setStores2FromBoApi(null);
              setStores3FromBoApi(null);
            }}
            className="p-2 my-3 border border-solid bg-gray-200 border-purple-200 rounded-xl"
            style={{elevation: 10}}>
            <Text className="text-purple-400 text-center font-bold text-3xl">
              {storesFromBoApi ? 'New search' : 'Search for product sales'}
            </Text>
          </TouchableOpacity>

          <View>
            {!storesFromBoApi && !stores2FromBoApi && !stores3FromBoApi ? (
              <TouchableOpacity className="bg-green-400 rounded-lg my-2 p-2 justify-center align-center">
                <Text className="text-center text-xl">Search by: </Text>
                <Picker
                  style={{
                    width: '85%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  selectedValue={selectedLabel}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedLabel(itemValue);
                  }}>
                  <Picker.Item
                    label="Product Sales Data"
                    value="ProductSalesData"
                  />
                  <Picker.Item
                    label="Product Sales Details"
                    value="ProductSalesDetails"
                  />
                  <Picker.Item
                    label="Product Sales Category Data"
                    value="ProductSalesCategoryData"
                  />
                </Picker>
              </TouchableOpacity>
            ) : null}
          </View>

          {!storesFromBoApi && !stores2FromBoApi && !stores3FromBoApi
            ? (() => {
                switch (selectedLabel) {
                  case 'ProductSalesData':
                    return (
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
                                date
                                  .toISOString()
                                  .slice(0, 10)
                                  .concat(' 00:00:00'),
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
                                date
                                  .toISOString()
                                  .slice(0, 10)
                                  .concat(' 23:59:59'),
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
                        <TouchableOpacity className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">
                            Group By:{' '}
                          </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
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
                          <Text className="text-center text-xl">
                            Product Id:{' '}
                          </Text>
                          <TextInput
                            onChangeText={handleChangeProductId}
                            style={styles.input}
                            selectTextOnFocus
                            placeholder="Product Id"
                            placeholderTextColor={'darkgrey'}
                            keyboardType="number-pad"
                            clearButtonMode={'always'}
                            returnKeyType="done"
                          />
                        </View>
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                          onPress={() => fetchProductSalesDataFromBoApi()}>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'ProductSalesDetails':
                    return (
                      <View>
                        <TouchableOpacity
                          className="bg-cyan-300 rounded-xl my-2 p-2"
                          onPress={() => setOpenA(true)}>
                          <Text className="text-center text-xl text-white">
                            Select From Date
                          </Text>
                          <DatePicker
                            modal
                            open={openA}
                            date={fromDate1}
                            mode={'date'}
                            onConfirm={date => {
                              setOpenA(false);
                              setFromDate1(date);
                              setFromDate2(
                                date
                                  .toISOString()
                                  .slice(0, 10)
                                  .concat(' 00:00:00'),
                              );
                            }}
                            onCancel={() => {
                              setOpenA(false);
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
                          onPress={() => setOpenA2(true)}>
                          <Text className="text-center text-xl text-white">
                            Select End Date
                          </Text>
                          <DatePicker
                            modal
                            open={openA2}
                            date={toDate1}
                            mode={'date'}
                            onConfirm={date => {
                              setOpenA2(false);
                              setToDate1(date);
                              setToDate2(
                                date
                                  .toISOString()
                                  .slice(0, 10)
                                  .concat(' 23:59:59'),
                              );
                            }}
                            onCancel={() => {
                              setOpenA2(false);
                            }}
                          />
                          {toDate2 !== '' && (
                            <Text className="text-center text-xl text-white">
                              {toDate2}
                            </Text>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">
                            Group By:{' '}
                          </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
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
                          <Text className="text-center text-xl">Prod Id: </Text>
                          <TextInput
                            onChangeText={handleChangeProdId}
                            style={styles.input}
                            selectTextOnFocus
                            placeholder="Prod Id"
                            placeholderTextColor={'darkgrey'}
                            keyboardType="number-pad"
                            clearButtonMode={'always'}
                            returnKeyType="done"
                          />
                        </View>
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                          onPress={() =>
                            fetchProductSalesDetailsDataFromBoApi()
                          }>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'ProductSalesCategoryData':
                    return (
                      <View>
                        <TouchableOpacity
                          className="bg-cyan-300 rounded-xl my-2 p-2"
                          onPress={() => setOpenB(true)}>
                          <Text className="text-center text-xl text-white">
                            Select From Date
                          </Text>
                          <DatePicker
                            modal
                            open={openB}
                            date={fromDate1}
                            mode={'date'}
                            onConfirm={date => {
                              setOpenB(false);
                              setFromDate1(date);
                              setFromDate2(
                                date
                                  .toISOString()
                                  .slice(0, 10)
                                  .concat(' 00:00:00'),
                              );
                            }}
                            onCancel={() => {
                              setOpenB(false);
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
                          onPress={() => setOpenB2(true)}>
                          <Text className="text-center text-xl text-white">
                            Select End Date
                          </Text>
                          <DatePicker
                            modal
                            open={openB2}
                            date={toDate1}
                            mode={'date'}
                            onConfirm={date => {
                              setOpenB2(false);
                              setToDate1(date);
                              setToDate2(
                                date
                                  .toISOString()
                                  .slice(0, 10)
                                  .concat(' 23:59:59'),
                              );
                            }}
                            onCancel={() => {
                              setOpenB2(false);
                            }}
                          />
                          {toDate2 !== '' && (
                            <Text className="text-center text-xl text-white">
                              {toDate2}
                            </Text>
                          )}
                        </TouchableOpacity>

                        {/* Details View */}
                        <View className="bg-gray-200 rounded-lg my-2 p-2">
                          <Text className="text-center text-xl">
                            Category Id:{' '}
                          </Text>
                          <TextInput
                            onChangeText={handleChangeCategoryId}
                            style={styles.input}
                            selectTextOnFocus
                            placeholder="Category Id"
                            placeholderTextColor={'darkgrey'}
                            keyboardType="number-pad"
                            clearButtonMode={'always'}
                            returnKeyType="done"
                          />
                        </View>
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                          onPress={() => fetchProductByCategoryDataFromBoApi()}>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  default:
                    return null;
                }
              })()
            : null}

          {storesFromBoApi || stores2FromBoApi || stores3FromBoApi
            ? (() => {
                switch (selectedLabel) {
                  case 'ProductSalesData':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          <Text className="m-1 text-xl text-black">
                            Product Id: {storesFromBoApi.ProductId}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Product Name: {storesFromBoApi.ProductName}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Profit on Turnover:{' '}
                            {storesFromBoApi.ProfitOnTurnOverPercentage}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Profit with VAT: {storesFromBoApi.ProfitWithVat}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Profit without VAT:{' '}
                            {storesFromBoApi.ProfitWithoutVat}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Quantity: {storesFromBoApi.Quantity}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Turnover with VAT: {storesFromBoApi.TurnOverWithVat}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Turnover without VAT:{' '}
                            {storesFromBoApi.TurnOverWithoutVat}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            VAT Total: {storesFromBoApi.VatTotal}
                          </Text>
                          <Text className="m-1 pt-1 text-2xl text-purple-700">
                            Sales Product Chart:{' '}
                          </Text>
                          {storesFromBoApi.SalesProductChartDtos?.map(x => {
                            return (
                              <View
                                className="p-2 bg-gray-200"
                                key={x.DatePart}>
                                <Text className="m-1 text-xl text-black">
                                  Date Part: {x.DatePart}
                                </Text>
                                <Text className="m-1 text-xl text-black">
                                  Product Id: {x.ProductId}
                                </Text>
                                <Text className="m-1 text-xl text-black">
                                  Profit with vat: {x.ProfitWithVat} €
                                </Text>
                                <Text className="m-1 text-xl text-black">
                                  Profit without vat: {x.ProfitWithoutVat} %
                                </Text>
                                <Text className="m-1 text-xl text-black">
                                  Turnover with vat: {x.TurnOverWithVat} €
                                </Text>
                                <Text className="m-1 text-xl text-black">
                                  Turnover without vat: {x.TurnOverWithoutVat} €
                                </Text>
                                <Text className="m-1 text-xl text-black">
                                  Year: {x.Year} €
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    );
                  case 'ProductSalesDetails':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View
                          style={{marginTop: 15}}
                          className="p-2 bg-gray-200">
                          <Text className="m-1 text-3xl text-purple-500">
                            Product Details
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Product Id: {stores2FromBoApi.ProductId}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Product Name: {stores2FromBoApi.ProductName}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            (Returns Empty)
                          </Text>
                        </View>
                      </ScrollView>
                    );
                  case 'ProductSalesCategoryData':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View
                          style={{marginTop: 15}}
                          className="p-2 bg-gray-200">
                          <Text className="m-1 text-3xl text-purple-500">
                            Products By Category
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Product Id: {stores3FromBoApi.ProductId}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            Product Name: {stores3FromBoApi.ProductName}
                          </Text>
                          <Text className="m-1 text-xl text-black">
                            (Returns Empty)
                          </Text>
                        </View>
                      </ScrollView>
                    );
                  default:
                    return null;
                }
              })()
            : null}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '85%',
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

export default ProductSalesScreen;
