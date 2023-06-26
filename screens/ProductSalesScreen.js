/* eslint-disable no-shadow */
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
  TextInput,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {selectToken} from '../features/bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {ip} from '@env';

const ProductSalesScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [storesFromBoApi, setStoresFromBoApi] = useState();
  const [stores2FromBoApi, setStores2FromBoApi] = useState();
  const [stores3FromBoApi, setStores3FromBoApi] = useState();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [fromDateA, setFromDateA] = useState('');
  const [fromDateB, setFromDateB] = useState('');
  const [toDate, setToDate] = useState('');
  const [toDateA, setToDateA] = useState('');
  const [toDateB, setToDateB] = useState('');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [openA2, setOpenA2] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [openB2, setOpenB2] = useState(false);
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [date3, setDate3] = useState(new Date());
  const [groupByDate, setGroupByDate] = useState('WEEK');
  const [groupByDate2, setGroupByDate2] = useState('DAY');
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
        `http://${ip}:3000/bo/Invoices/GetProductSalesPropertiesServerSide?fromDate=${fromDate}&toDate=${toDate}&productId=${productId}&groupByDate=${groupByDate}&storesIds=1`,
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
        `http://${ip}:3000/bo/Invoices/GetProductSalesDetailsServerSide?fromDate=${fromDateA}&toDate=${toDateA}&dateGroupBy=${groupByDate2}&storeIds=1&prodID=${prodId}`,
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
        `http://${ip}:3000/bo/Invoices/GetProductsByCategoryServerSide?fromDate=${fromDateB}&toDate=${toDateB}&categoryId=${categoryId}&storesIds=1`,
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
      <ScrollView
        // style={{maxHeight: 1200, width: 600, padding: 20}}
        contentContainerStyle={{flexGrow: 1}}>
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
              className="p-2 my-5 border border-solid bg-gray-200 border-purple-200 rounded-xl"
              style={{elevation: 10}}>
              <Text className="text-purple-400 text-center font-bold text-3xl">
                {storesFromBoApi ? 'New search' : 'Search for product sales'}
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
                    date={date}
                    mode={'date'}
                    onConfirm={date => {
                      setOpen(false);
                      setFromDate(
                        date.toISOString().slice(0, 10).concat(' 00:00:00'),
                      );
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                  {fromDate !== '' && (
                    <Text className="text-center text-xl text-white">
                      {fromDate}
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
                    date={date}
                    mode={'date'}
                    onConfirm={date => {
                      setOpen2(false);
                      setToDate(
                        date.toISOString().slice(0, 10).concat(' 23:59:59'),
                      );
                    }}
                    onCancel={() => {
                      setOpen2(false);
                    }}
                  />
                  {toDate !== '' && (
                    <Text className="text-center text-xl text-white">
                      {toDate}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                  <Text className="text-center text-xl">Group By: </Text>
                  <Picker
                    style={{
                      width: '50%',
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
                  <Text className="text-center text-xl">Product Id: </Text>
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
                  <Text className="text-center text-lg text-white">Submit</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <ScrollView
              className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
              style={{elevation: 50}}>
              {storesFromBoApi && (
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
                    Profit without VAT: {storesFromBoApi.ProfitWithoutVat}
                  </Text>
                  <Text className="m-1 text-xl text-black">
                    Quantity: {storesFromBoApi.Quantity}
                  </Text>
                  <Text className="m-1 text-xl text-black">
                    Sales Product Chart: {storesFromBoApi.SalesProductChartDtos}
                  </Text>
                  <Text className="m-1 text-xl text-black">
                    Turnover with VAT: {storesFromBoApi.TurnOverWithVat}
                  </Text>
                  <Text className="m-1 text-xl text-black">
                    Turnover without VAT: {storesFromBoApi.TurnOverWithoutVat}
                  </Text>
                  <Text className="m-1 text-xl text-black">
                    VAT Total: {storesFromBoApi.VatTotal}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* New Search */}
            <TouchableOpacity
              onPress={() => {
                setOpenA(false);
                setOpenA2(false);
                setStores2FromBoApi();
              }}
              className="p-2 my-5 border border-solid bg-gray-200 border-purple-200 rounded-xl"
              style={{elevation: 10, marginTop: 85}}>
              <Text className="text-green-400 text-center font-bold text-3xl">
                {stores2FromBoApi ? 'New search' : 'Search for product details'}
              </Text>
            </TouchableOpacity>

            {/* Details View */}
            {!stores2FromBoApi ? (
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
                    date={date2}
                    mode={'date'}
                    onConfirm={date => {
                      setOpenA(false);
                      setFromDateA(
                        date.toISOString().slice(0, 10).concat(' 00:00:00'),
                      );
                    }}
                    onCancel={() => {
                      setOpenA(false);
                    }}
                  />
                  {fromDateA !== '' && (
                    <Text className="text-center text-xl text-white">
                      {fromDateA}
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
                    date={date2}
                    mode={'date'}
                    onConfirm={date => {
                      setOpenA2(false);
                      setToDateA(
                        date.toISOString().slice(0, 10).concat(' 23:59:59'),
                      );
                    }}
                    onCancel={() => {
                      setOpenA2(false);
                    }}
                  />
                  {toDateA !== '' && (
                    <Text className="text-center text-xl text-white">
                      {toDateA}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                  <Text className="text-center text-xl">Group By: </Text>
                  <Picker
                    style={{
                      width: '50%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                    selectedValue={groupByDate2}
                    onValueChange={(itemValue, itemIndex) =>
                      setGroupByDate2(itemValue)
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
                  onPress={() => fetchProductSalesDetailsDataFromBoApi()}>
                  <Text className="text-center text-lg text-white">Submit</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {stores2FromBoApi && (
              <ScrollView
                className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                style={{elevation: 50}}>
                {stores2FromBoApi && (
                  <View style={{marginTop: 15}} className="p-2 bg-gray-200">
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
                )}
              </ScrollView>
            )}

            {/* New Search */}
            <TouchableOpacity
              onPress={() => {
                setOpenB(false);
                setOpenB2(false);
                setStores3FromBoApi();
              }}
              className="p-2 my-5 border border-solid bg-gray-200 border-purple-200 rounded-xl"
              style={{elevation: 10, marginTop: 85}}>
              <Text className="text-orange-300 text-center font-bold text-3xl">
                {stores3FromBoApi
                  ? 'New search'
                  : 'Search for product category data'}
              </Text>
            </TouchableOpacity>

            {/* Details View */}
            {!stores3FromBoApi ? (
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
                    date={date3}
                    mode={'date'}
                    onConfirm={date => {
                      setOpenB(false);
                      setFromDateB(
                        date.toISOString().slice(0, 10).concat(' 00:00:00'),
                      );
                    }}
                    onCancel={() => {
                      setOpenB(false);
                    }}
                  />
                  {fromDateB !== '' && (
                    <Text className="text-center text-xl text-white">
                      {fromDateB}
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
                    date={date3}
                    mode={'date'}
                    onConfirm={date => {
                      setOpenB2(false);
                      setToDateB(
                        date.toISOString().slice(0, 10).concat(' 23:59:59'),
                      );
                    }}
                    onCancel={() => {
                      setOpenB2(false);
                    }}
                  />
                  {toDateB !== '' && (
                    <Text className="text-center text-xl text-white">
                      {toDateB}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Details View */}
                <View className="bg-gray-200 rounded-lg my-2 p-2">
                  <Text className="text-center text-xl">Category Id: </Text>
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
                  <Text className="text-center text-lg text-white">Submit</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {stores3FromBoApi && (
              <ScrollView
                className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                style={{elevation: 50}}>
                {stores3FromBoApi && (
                  <View style={{marginTop: 15}} className="p-2 bg-gray-200">
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
                )}
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>
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

export default ProductSalesScreen;
