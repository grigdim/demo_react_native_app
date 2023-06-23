/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
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

const StoresScreen = () => {
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const [storesFromBoApi, setStoresFromBoApi] = useState();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sftId, setSftId] = useState(1);
  const [groupByDate, setGroupByDate] = useState('WEEK');
  const [storesIds, setStoresIds] = useState([1]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [date, setDate] = useState(new Date());

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
        fromDate: fromDate,
        toDate: toDate,
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
<<<<<<< HEAD
        'http://192.168.1.69:3000/bo/Invoices/FetchSalesDataServerSide',
=======
        'http://192.168.1.184:3000/bo/Invoices/FetchSalesDataServerSide',
>>>>>>> d9a5f11ca06961f2daed60657cc7f88cc435c064
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
    // fetchDataFromBoApi();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View className="w-8/12 justify-center mt-2">
          <TouchableOpacity
            onPress={() => {
              setOpen(false);
              setOpen2(false);
              setStoresFromBoApi();
            }}
            className="p-2 my-5 bg-gray-200 border border-solid border-cyan-200 rounded-xl"
            style={{elevation: 50}}>
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
                    setOpen(false);
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
                  selectedValue={groupByDate}
                  style={{
                    height: 50,
                    width: '25%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
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
                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                onPress={() => fetchDataFromBoApi()}>
                <Text className="text-center text-lg text-white">Submit</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {storesFromBoApi && (
            <ScrollView
              className="divide-y-2 divide-cyan-400 rounded-2xl"
              style={{elevation: 50}}>
              {storesFromBoApi.CategoriesSalesDtos?.map(category => (
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
              ))}
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
