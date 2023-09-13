/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
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
import {selectToken, selectStoreId} from '../features/bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {debounce} from 'lodash';
import {Picker} from '@react-native-picker/picker';
import {ip} from '@env';
import DrawerHeader from './DrawerHeader';

const ReportsScreen = () => {
  // TEST RESULTS TO GET BACK DATA
  // Use '4043' as Store Id when needed
  // Check productSubCategoryOptions array to use for as Product Category Name when needed

  const navigation = useNavigation();
  const {width, height} = Dimensions.get('screen');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('GetSeasonality');
  const token = useSelector(selectToken);
  const storeId = useSelector(selectStoreId);

  // Products
  const [
    productCategoryNameForSubCategoryNames,
    setProductCategoryNameForSubCategoryNames,
  ] = useState(1);
  const [
    productCategoryNameForTopProductsInItemSales,
    setProductCategoryNameForTopProductsInItemSales,
  ] = useState(1);
  const [
    productCategoryNameForTopProductsInItemSalesPerStore,
    setProductCategoryNameForTopProductsInItemSalesPerStore,
  ] = useState(1);
  const [
    productCategoryNameForSeasonality,
    setProductCategoryNameForSeasonality,
  ] = useState(1);
  const [
    productCategoryNameForSeasonalityDetails,
    setProductCategoryNameForSeasonalityDetails,
  ] = useState(1);

  // Reports
  const [
    reportsGetProductCategoryNamesFromTopProductsFromBoApi,
    setReportsGetProductCategoryNamesFromTopProductsFromBoApi,
  ] = useState();
  const [
    reportsGetProductSubCategoryNamesFromTopProductsFromBoApi,
    setReportsGetProductSubCategoryNamesFromTopProductsFromBoApi,
  ] = useState();
  const [
    reportsGetTopProductsInItemSalesFromTopProductsFromBoApi,
    setReportsGetTopProductsInItemSalesFromTopProductsFromBoApi,
  ] = useState();
  const [
    reportsGetTopProductsInItemSalesPerStoreFromTopProductsFromBoApi,
    setReportsGetTopProductsInItemSalesPerStoreFromTopProductsFromBoApi,
  ] = useState();
  const [
    reportsGetProductCategoryNamesFromSeasonalityFromBoApi,
    setReportsGetProductCategoryNamesFromSeasonalityFromBoApi,
  ] = useState();
  const [reportsGetSeasonalityFromBoApi, setReportsGetSeasonalityFromBoApi] =
    useState();
  const [
    reportsGetSeasonalityDetailsFromBoApi,
    setReportsGetSeasonalityDetailsFromBoApi,
  ] = useState();
  const [
    reportsGetTransactionsWeeksFromBoApi,
    setReportsGetTransactionsWeeksFromBoApi,
  ] = useState();
  const [
    reportsGetTransactionsStoreNamesFromBoApi,
    setReportsGetTransactionsStoreNamesFromBoApi,
  ] = useState();
  const [
    reportsGetTransactionAnalysisTopHourFromBoApi,
    setReportsGetTransactionAnalysisTopHourFromBoApi,
  ] = useState();
  const [
    reportsGetTransactionAnalysisTopDayFromBoApi,
    setReportsGetTransactionAnalysisTopDayFromBoApi,
  ] = useState();
  const [
    reportsGetTransactionsPerHoursFromBoApi,
    setReportsGetTransactionsPerHoursFromBoApi,
  ] = useState();
  const [
    reportsGetTransactionsPerDayFromBoApi,
    setReportsGetTransactionsPerDayFromBoApi,
  ] = useState();
  const [
    reportsGetAnalysisWeekHourlyTransactionsFromBoApi,
    setReportsGetAnalysisWeekHourlyTransactionsFromBoApi,
  ] = useState();

  // Store Ids
  const [storeIdsForTransactionWeeks, setStoreIdsForTransactionWeeks] =
    useState([1]);
  const [
    storeIdsForTransactionStoresNames,
    setStoreIdsForTransactionStoresNames,
  ] = useState([1]);
  const [
    storeIdsForTransactionAnalysisTopHour,
    setStoreIdsForTransactionAnalysisTopHour,
  ] = useState([1]);
  const [
    storeIdsForTransactionAnalysisTopDay,
    setStoreIdsForTransactionAnalysisTopDay,
  ] = useState([1]);
  const [storeIdsForTransactionsPerHours, setStoreIdsForTransactionsPerHours] =
    useState([1]);
  const [storeIdsForTransactionsPerDay, setStoreIdsForTransactionsPerDay] =
    useState([1]);
  const [
    storeIdsForAnalysisWeekHourlyTransactions,
    setStoreIdsForAnalysisWeekHourlyTransactions,
  ] = useState([1]);

  // Week descriptions
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('SNACKS');
  const [selectedSubCategory, setSelectedSubCategory] = useState('BAR SNACKS');
  const [selectedCategoryData, setSelectedCategoryData] = useState([]);
  const [selectedSubCategoryData, setSelectedSubCategoryData] = useState([]);
  const [pickerWeekDescriptionData, setPickerWeekDescriptionData] = useState(
    [],
  );

  // Every Product Category Name Available
  const productSubCategoryOptions = [
    {label: 'ΑΝΑΨΥΚΤΙΚΑ - ΧΥΜΟΙ', value: 'ΑΝΑΨΥΚΤΙΚΑ - ΧΥΜΟΙ'},
    {label: 'SNACKS', value: 'SNACKS'},
    {label: 'ΓΑΛΑΚΤΟΚΟΜΙΚΑ', value: 'ΓΑΛΑΚΤΟΚΟΜΙΚΑ'},
    {label: 'ΚΑΡΑΜΕΛΕΣ - ΖΕΛΕΔΑΚΙΑ', value: 'ΚΑΡΑΜΕΛΕΣ - ΖΕΛΕΔΑΚΙΑ'},
    {
      label: 'ΜΠΙΣΚΟΤΑ - ΓΛΥΚΑ ΣΟΡΟΠΙΑΣΤΑ',
      value: 'ΜΠΙΣΚΟΤΑ - ΓΛΥΚΑ ΣΟΡΟΠΙΑΣΤΑ',
    },
    {
      label: 'ΜΠΥΡΕΣ - ΟΥΖΑ - ΤΣΙΠΟΥΡΑ - ΚΡΑΣΙΑ - ΠΟΤΑ',
      value: 'ΜΠΥΡΕΣ - ΟΥΖΑ - ΤΣΙΠΟΥΡΑ - ΚΡΑΣΙΑ - ΠΟΤΑ',
    },
    {label: 'ΝΕΡΟ ΠΑΓΑΚΙΑ', value: 'ΝΕΡΟ ΠΑΓΑΚΙΑ'},
    {label: 'ΠΑΓΩΤΑ', value: 'ΠΑΓΩΤΑ'},
    {label: 'ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΑ', value: 'ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΑ'},
    {
      label: 'ΣΟΚΟΛΑΤΕΣ -ΓΚΟΦΡΕΤΕΣ-ΣΟΚΟΛΑΤΑΚΙΑ',
      value: 'ΣΟΚΟΛΑΤΕΣ -ΓΚΟΦΡΕΤΕΣ-ΣΟΚΟΛΑΤΑΚΙΑ',
    },
    {label: 'ΤΣΙΧΛΕΣ', value: 'ΤΣΙΧΛΕΣ'},
    {
      label: 'ΧΑΡΤΑΚΙΑ - ΦΙΛΤΡΑΚΙΑ - ΕΙΔΗ ΚΑΠΝΙΣΤΟΥ',
      value: 'ΧΑΡΤΑΚΙΑ - ΦΙΛΤΡΑΚΙΑ - ΕΙΔΗ ΚΑΠΝΙΣΤΟΥ',
    },
  ];

  // Handlers

  const handleStoreIdsForTransactionWeeks = inputText => {
    setStoreIdsForTransactionWeeks(inputText);
  };

  const handleStoreIdsForTransactionStoresNames = inputText => {
    setStoreIdsForTransactionStoresNames(inputText);
  };

  const handleStoreIdsForTransactionAnalysisTopHour = inputText => {
    setStoreIdsForTransactionAnalysisTopHour(inputText);
  };

  const handleStoreIdsForTransactionAnalysisTopDay = inputText => {
    setStoreIdsForTransactionAnalysisTopDay(inputText);
  };

  const handleStoreIdsForTransactionsPerHours = inputText => {
    setStoreIdsForTransactionsPerHours(inputText);
  };

  const handleStoreIdsForTransactionsPerDay = inputText => {
    setStoreIdsForTransactionsPerDay(inputText);
  };

  const handleStoreIdsForAnalysisWeekHourlyTransactions = inputText => {
    setStoreIdsForAnalysisWeekHourlyTransactions(inputText);
  };

  const handleProductCategoryNameForProductsInItemSales = inputText => {
    setProductCategoryNameForTopProductsInItemSales(inputText);
  };

  const handleProductCategoryNameForProductsInItemSalesPerStore = inputText => {
    setProductCategoryNameForTopProductsInItemSalesPerStore(inputText);
  };

  const handleProductCategoryNameForSeasonality = inputText => {
    setProductCategoryNameForSeasonality(inputText);
  };

  const handleProductCategoryNameForSeasonalityDetails = inputText => {
    setProductCategoryNameForSeasonalityDetails(inputText);
  };
  //  Fetch Requests

  const fetchProductCategoryNamesFromBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetProductCategoryNamesFromTopProducts`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetProductCategoryNamesFromTopProducts`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetProductCategoryNamesFromTopProductsFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchProductSubCategoryNamesFromTopProductsBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetProductSubCategoryNamesFromTopProducts?productCategoryName=${selectedCategory}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetProductSubCategoryNamesFromTopProducts?productCategoryName=${selectedCategory}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetProductSubCategoryNamesFromTopProductsFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchTopProductsInItemSalesFromTopProductsBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTopProductsInItemSalesFromTopProducts?productCategoryName=${selectedCategory}&productSubCategoryName=${selectedSubCategory}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTopProductsInItemSalesFromTopProducts?productCategoryName=${selectedCategory}&productSubCategoryName=${selectedSubCategory}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetTopProductsInItemSalesFromTopProductsFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchTopProductsInItemSalesPerStoreFromTopProductsBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTopProductsInItemSalesPerStoreFromTopProducts?productCategoryName=${selectedCategory}&productSubCategoryName=${selectedSubCategory}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTopProductsInItemSalesPerStoreFromTopProducts?productCategoryName=${selectedCategory}&productSubCategoryName=${selectedSubCategory}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetTopProductsInItemSalesPerStoreFromTopProductsFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchProductCategoryNamesFromSeasonalityBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetProductCategoryNamesFromSeasonality`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetProductCategoryNamesFromSeasonality`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetProductCategoryNamesFromSeasonalityFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchSeasonalityBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetSeasonality?productCategoryName=${productCategoryNameForSeasonality}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetSeasonality?productCategoryName=${productCategoryNameForSeasonality}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetSeasonalityFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchSeasonalityDetailsBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetSeasonalityDetails?productCategoryName=${productCategoryNameForSeasonalityDetails}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetSeasonalityDetails?productCategoryName=${productCategoryNameForSeasonalityDetails}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetSeasonalityDetailsFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchTransactionsWeeksBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionsWeeks?storeIds=${storeIdsForTransactionWeeks}`,
        // `http://${ip}:3000/bo/Reports/GetTransactionsWeeks?storeIds=4043`, // Hard coded since we don't initialize the store at the moment
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionsWeeks?storeIds=${storeId}`, // Hard coded since we don't initialize the store at the moment
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);

      setReportsGetTransactionsWeeksFromBoApi(() => {
        let r = [];
        data.map(x => {
          r.push(x.WeekDescription);
        });
        return r;
      });
    }
    // end of request
    setLoading(false);
  };

  // Use Effects

  useEffect(() => {
    fetchTransactionsWeeksBoApi();
    fetchProductCategoryNamesFromBoApi();
    fetchProductSubCategoryNamesFromTopProductsBoApi();
  }, []);

  useEffect(() => {
    setPickerWeekDescriptionData(reportsGetTransactionsWeeksFromBoApi);
  }, [reportsGetTransactionsWeeksFromBoApi]);

  useEffect(() => {
    setSelectedCategoryData(
      reportsGetProductCategoryNamesFromTopProductsFromBoApi,
    );
  }, [reportsGetProductCategoryNamesFromTopProductsFromBoApi]);

  useEffect(() => {
    setSelectedSubCategoryData(
      reportsGetProductSubCategoryNamesFromTopProductsFromBoApi,
    );
  }, [
    reportsGetProductSubCategoryNamesFromTopProductsFromBoApi,
    reportsGetProductCategoryNamesFromTopProductsFromBoApi,
  ]);

  useEffect(() => {
    if (selectedCategory) {
      const delay = 500;
      const timer = setTimeout(() => {
        fetchProductSubCategoryNamesFromTopProductsBoApi(selectedCategory);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [selectedCategory]);

  const fetchTransactionsStoreNamesBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionsStoresNames?storeIds=${storeIdsForTransactionStoresNames}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionsStoresNames?storeIds=${storeIdsForTransactionStoresNames}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetTransactionsStoreNamesFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchTransactionAnalysisTopHourBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionAnalysisTopHour?storeIds=${storeIdsForTransactionAnalysisTopHour}&weekDescription=${selectedWeek}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionAnalysisTopHour?storeIds=${storeIdsForTransactionAnalysisTopHour}&weekDescription=${selectedWeek}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetTransactionAnalysisTopHourFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchTransactionAnalysisTopDayBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionAnalysisTopDay?storeIds=${storeIdsForTransactionAnalysisTopDay}&weekDescription=${selectedWeek}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionAnalysisTopDay?storeIds=${storeIdsForTransactionAnalysisTopDay}&weekDescription=${selectedWeek}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetTransactionAnalysisTopDayFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchTransactionsPerHoursBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionsPerHours?storeIds=${storeIdsForTransactionsPerHours}&weekDescription=${selectedWeek}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionsPerHours?storeIds=${storeIdsForTransactionsPerHours}&weekDescription=${selectedWeek}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetTransactionsPerHoursFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchTransactionsPerDayBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetTransactionsPerDay?storeIds=${storeIdsForTransactionsPerDay}&weekDescription=${selectedWeek}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetTransactionsPerDay?storeIds=${storeIdsForTransactionsPerDay}&weekDescription=${selectedWeek}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetTransactionsPerDayFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  const fetchAnalysisWeekHourlyTransactionsBoApi = async () => {
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
        // `http://${ip}:3000/bo/Reports/GetAnalysisWeekHourlyTransactions?storeIds=${storeIdsForAnalysisWeekHourlyTransactions}&weekDescription=${selectedWeek}`,
        `https://dev-bo-api-gr.azurewebsites.net/bo/Reports/GetAnalysisWeekHourlyTransactions?storeIds=${storeIdsForAnalysisWeekHourlyTransactions}&weekDescription=${selectedWeek}`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setReportsGetAnalysisWeekHourlyTransactionsFromBoApi(data);
    }
    // end of request
    setLoading(false);
  };

  return (
    <SafeAreaView className="bg-gray-100 justify-center items-center">
      <TouchableOpacity style={{width: width, zIndex: 1}}>
        <DrawerHeader />
      </TouchableOpacity>
      {loading ? (
        <View
          className="w-8/12 justify-center items-center mt-2"
          style={{height: height / 1.33}}>
          <ActivityIndicator color="rgb(34 211 238)" size="large" />
        </View>
      ) : (
        <View
          className="w-10/12 justify-center items-center mt-2"
          style={{height: height / 1.33}}>
          <TouchableOpacity
            onPress={() => {
              setOpen(false);
              setReportsGetTopProductsInItemSalesFromTopProductsFromBoApi(null);
              setReportsGetTopProductsInItemSalesPerStoreFromTopProductsFromBoApi(
                null,
              );
              setReportsGetProductCategoryNamesFromSeasonalityFromBoApi(null);
              setReportsGetSeasonalityFromBoApi(null);
              setReportsGetSeasonalityDetailsFromBoApi(null);
              setReportsGetTransactionsStoreNamesFromBoApi(null);
              setReportsGetTransactionAnalysisTopHourFromBoApi(null);
              setReportsGetTransactionAnalysisTopDayFromBoApi(null);
              setReportsGetTransactionsPerHoursFromBoApi(null);
              setReportsGetTransactionsPerDayFromBoApi(null);
              setReportsGetAnalysisWeekHourlyTransactionsFromBoApi(null);
            }}
            className="p-2 my-3 border border-solid bg-gray-200 border-purple-200 rounded-xl"
            style={{elevation: 10}}>
            <Text className="text-pink-500 text-center font-bold text-3xl">
              {reportsGetTopProductsInItemSalesFromTopProductsFromBoApi ||
              reportsGetTopProductsInItemSalesPerStoreFromTopProductsFromBoApi ||
              reportsGetProductCategoryNamesFromSeasonalityFromBoApi ||
              reportsGetSeasonalityFromBoApi ||
              reportsGetSeasonalityDetailsFromBoApi ||
              reportsGetTransactionsStoreNamesFromBoApi ||
              reportsGetTransactionAnalysisTopHourFromBoApi ||
              reportsGetTransactionAnalysisTopDayFromBoApi ||
              reportsGetTransactionsPerHoursFromBoApi ||
              reportsGetTransactionsPerDayFromBoApi ||
              reportsGetAnalysisWeekHourlyTransactionsFromBoApi
                ? 'New search'
                : 'Search for reports'}
            </Text>
          </TouchableOpacity>
          <View style={{elevation: 10, width: width / 1.33}}>
            {!reportsGetTopProductsInItemSalesFromTopProductsFromBoApi &&
            !reportsGetTopProductsInItemSalesPerStoreFromTopProductsFromBoApi &&
            !reportsGetProductCategoryNamesFromSeasonalityFromBoApi &&
            !reportsGetSeasonalityFromBoApi &&
            !reportsGetSeasonalityDetailsFromBoApi &&
            !reportsGetTransactionsStoreNamesFromBoApi &&
            !reportsGetTransactionAnalysisTopHourFromBoApi &&
            !reportsGetTransactionAnalysisTopDayFromBoApi &&
            !reportsGetTransactionsPerHoursFromBoApi &&
            !reportsGetTransactionsPerDayFromBoApi &&
            !reportsGetAnalysisWeekHourlyTransactionsFromBoApi ? (
              <TouchableOpacity
                style={{elevation: 10}}
                className="bg-pink-200 rounded-lg my-2 p-2 justify-center align-center">
                <Text className="text-center text-xl">Search for: </Text>
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
                    label="Top Products In Item Sales"
                    value="GetTopProductsInItemSalesFromTopProducts"
                  />
                  <Picker.Item
                    label="Top Products In Item Sales Per Store"
                    value="GetTopProductsInItemSalesPerStoreFromTopProducts"
                  />
                  <Picker.Item
                    label="Products Category Names From Seasonality"
                    value="GetProductCategoryNamesFromSeasonality"
                  />
                  <Picker.Item label="Seasonality" value="GetSeasonality" />
                  <Picker.Item
                    label="Seasonality Details"
                    value="GetSeasonalityDetails"
                  />
                  <Picker.Item
                    label="Transaction Store Names"
                    value="GetTransactionsStoreNames"
                  />
                  <Picker.Item
                    label="Transaction Analysis Top Hour"
                    value="GetTransactionAnalysisTopHour"
                  />
                  <Picker.Item
                    label="Transaction Analysis Top Day"
                    value="GetTransactionAnalysisTopDay"
                  />
                  <Picker.Item
                    label="Transactions Per Hours"
                    value="GetTransactionsPerHours"
                  />
                  <Picker.Item
                    label="Transactions Per Day"
                    value="GetTransactionsPerDay"
                  />
                  <Picker.Item
                    label="Analysis Week Hourly Transactions"
                    value="GetAnalysisWeekHourlyTransactions"
                  />
                </Picker>
              </TouchableOpacity>
            ) : null}
          </View>

          {!reportsGetTopProductsInItemSalesFromTopProductsFromBoApi &&
          !reportsGetTopProductsInItemSalesPerStoreFromTopProductsFromBoApi &&
          !reportsGetProductCategoryNamesFromSeasonalityFromBoApi &&
          !reportsGetSeasonalityFromBoApi &&
          !reportsGetSeasonalityDetailsFromBoApi &&
          !reportsGetTransactionsStoreNamesFromBoApi &&
          !reportsGetTransactionAnalysisTopHourFromBoApi &&
          !reportsGetTransactionAnalysisTopDayFromBoApi &&
          !reportsGetTransactionsPerHoursFromBoApi &&
          !reportsGetTransactionsPerDayFromBoApi &&
          !reportsGetAnalysisWeekHourlyTransactionsFromBoApi
            ? (() => {
                switch (selectedLabel) {
                  case 'GetTopProductsInItemSalesFromTopProducts':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <TouchableOpacity
                          style={{elevation: 10}}
                          className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">
                            CATEGORY:{' '}
                          </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                            selectedValue={selectedCategory}
                            onValueChange={value => {
                              setSelectedCategory(value);
                            }}>
                            {selectedCategoryData?.map(item => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{elevation: 10}}
                          className="bg-green-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">
                            SUB CATEGORY:{' '}
                          </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                            selectedValue={selectedSubCategory}
                            onValueChange={value =>
                              setSelectedSubCategory(value)
                            }>
                            {selectedSubCategoryData?.map(item => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() =>
                            fetchTopProductsInItemSalesFromTopProductsBoApi()
                          }>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetTopProductsInItemSalesPerStoreFromTopProducts':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <TouchableOpacity
                          style={{elevation: 10}}
                          className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">
                            CATEGORY:{' '}
                          </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                            selectedValue={selectedCategory}
                            onValueChange={value => {
                              fetchProductSubCategoryNamesFromTopProductsBoApi(
                                value,
                              );
                              setSelectedCategory(value);
                            }}>
                            {selectedCategoryData?.map(item => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{elevation: 10}}
                          className="bg-green-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">
                            SUB CATEGORY:{' '}
                          </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                            selectedValue={selectedSubCategory}
                            onValueChange={value =>
                              setSelectedSubCategory(value)
                            }>
                            {selectedSubCategoryData?.map(item => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </TouchableOpacity>
                        <TextInput
                          onChangeText={
                            handleProductCategoryNameForProductsInItemSalesPerStore
                          }
                          style={styles.input}
                          selectTextOnFocus
                          placeholder="Product Category Name"
                          placeholderTextColor={'darkgrey'}
                          keyboardType="default"
                          clearButtonMode={'always'}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() =>
                            fetchTopProductsInItemSalesPerStoreFromTopProductsBoApi()
                          }>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetProductCategoryNamesFromSeasonality':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() =>
                            fetchProductCategoryNamesFromSeasonalityBoApi()
                          }>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetSeasonality':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <Text className="text-center text-xl">
                          Product Category Name:{' '}
                        </Text>
                        <TextInput
                          onChangeText={handleProductCategoryNameForSeasonality}
                          style={styles.input}
                          selectTextOnFocus
                          placeholder="Product Category Name"
                          placeholderTextColor={'darkgrey'}
                          keyboardType="default"
                          clearButtonMode={'always'}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() => fetchSeasonalityBoApi()}>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetSeasonalityDetails':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <Text className="text-center text-xl">
                          Product Category Name:{' '}
                        </Text>
                        <TextInput
                          onChangeText={
                            handleProductCategoryNameForSeasonalityDetails
                          }
                          style={styles.input}
                          selectTextOnFocus
                          placeholder="Product Category Name"
                          placeholderTextColor={'darkgrey'}
                          keyboardType="default"
                          clearButtonMode={'always'}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() => fetchSeasonalityDetailsBoApi()}>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetTransactionsStoreNames':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <Text className="text-center text-xl">Store Id: </Text>
                        <TextInput
                          onChangeText={handleStoreIdsForTransactionStoresNames}
                          style={styles.input}
                          selectTextOnFocus
                          placeholder="Store Id"
                          placeholderTextColor={'darkgrey'}
                          keyboardType="default"
                          clearButtonMode={'always'}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() => fetchTransactionsStoreNamesBoApi()}>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetTransactionAnalysisTopHour':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <TouchableOpacity
                          style={{elevation: 10}}
                          className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">WEEK: </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                            selectedValue={selectedWeek}
                            onValueChange={value => setSelectedWeek(value)}>
                            {pickerWeekDescriptionData?.map(item => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </TouchableOpacity>
                        <Text className="text-center text-xl">Store Id: </Text>
                        <TextInput
                          onChangeText={
                            handleStoreIdsForTransactionAnalysisTopHour
                          }
                          style={styles.input}
                          selectTextOnFocus
                          placeholder="Store Id"
                          placeholderTextColor={'darkgrey'}
                          keyboardType="default"
                          clearButtonMode={'always'}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() =>
                            fetchTransactionAnalysisTopHourBoApi()
                          }>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetTransactionAnalysisTopDay':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <TouchableOpacity
                          style={{elevation: 10}}
                          className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">WEEK: </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                            selectedValue={selectedWeek}
                            onValueChange={value => setSelectedWeek(value)}>
                            {pickerWeekDescriptionData?.map(item => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </TouchableOpacity>
                        <Text className="text-center text-xl">Store Id: </Text>
                        <TextInput
                          onChangeText={
                            handleStoreIdsForTransactionAnalysisTopDay
                          }
                          style={styles.input}
                          selectTextOnFocus
                          placeholder="Store Id"
                          placeholderTextColor={'darkgrey'}
                          keyboardType="default"
                          clearButtonMode={'always'}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() => fetchTransactionAnalysisTopDayBoApi()}>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetTransactionsPerHours':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <TouchableOpacity
                          style={{elevation: 10}}
                          className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">WEEK: </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                            selectedValue={selectedWeek}
                            onValueChange={value => setSelectedWeek(value)}>
                            {pickerWeekDescriptionData?.map(item => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </TouchableOpacity>
                        <Text className="text-center text-xl">Store Id: </Text>
                        <TextInput
                          onChangeText={handleStoreIdsForTransactionsPerHours}
                          style={styles.input}
                          selectTextOnFocus
                          placeholder="Store Id"
                          placeholderTextColor={'darkgrey'}
                          keyboardType="default"
                          clearButtonMode={'always'}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() => fetchTransactionsPerHoursBoApi()}>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetTransactionsPerDay':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <TouchableOpacity
                          style={{elevation: 10}}
                          className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">WEEK: </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                            selectedValue={selectedWeek}
                            onValueChange={value => setSelectedWeek(value)}>
                            {pickerWeekDescriptionData?.map(item => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </TouchableOpacity>
                        <Text className="text-center text-xl">Store Id: </Text>
                        <TextInput
                          onChangeText={handleStoreIdsForTransactionsPerDay}
                          style={styles.input}
                          selectTextOnFocus
                          placeholder="Store Id"
                          placeholderTextColor={'darkgrey'}
                          keyboardType="default"
                          clearButtonMode={'always'}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() => fetchTransactionsPerDayBoApi()}>
                          <Text className="text-center text-lg text-white">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  case 'GetAnalysisWeekHourlyTransactions':
                    return (
                      <View style={{elevation: 10, width: width / 1.33}}>
                        <TouchableOpacity
                          style={{elevation: 10}}
                          className="bg-red-300 rounded-lg my-2 p-2 justify-center align-center">
                          <Text className="text-center text-xl">WEEK: </Text>
                          <Picker
                            style={{
                              width: '85%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                            selectedValue={selectedWeek}
                            onValueChange={value => setSelectedWeek(value)}>
                            {pickerWeekDescriptionData?.map(item => (
                              <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </TouchableOpacity>
                        <Text className="text-center text-xl">Store Id: </Text>
                        <TextInput
                          onChangeText={
                            handleStoreIdsForAnalysisWeekHourlyTransactions
                          }
                          style={styles.input}
                          selectTextOnFocus
                          placeholder="Store Id"
                          placeholderTextColor={'darkgrey'}
                          keyboardType="default"
                          clearButtonMode={'always'}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg ml-20 mr-20"
                          onPress={() =>
                            fetchAnalysisWeekHourlyTransactionsBoApi()
                          }>
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

          {reportsGetTopProductsInItemSalesFromTopProductsFromBoApi ||
          reportsGetTopProductsInItemSalesPerStoreFromTopProductsFromBoApi ||
          reportsGetProductCategoryNamesFromSeasonalityFromBoApi ||
          reportsGetSeasonalityFromBoApi ||
          reportsGetSeasonalityDetailsFromBoApi ||
          reportsGetTransactionsStoreNamesFromBoApi ||
          reportsGetTransactionAnalysisTopHourFromBoApi ||
          reportsGetTransactionAnalysisTopDayFromBoApi ||
          reportsGetTransactionsPerHoursFromBoApi ||
          reportsGetTransactionsPerDayFromBoApi ||
          reportsGetAnalysisWeekHourlyTransactionsFromBoApi
            ? (() => {
                switch (selectedLabel) {
                  case 'GetTopProductsInItemSalesFromTopProducts':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetTopProductsInItemSalesFromTopProductsFromBoApi?.map(
                            x => {
                              return (
                                <View
                                  className="p-3 bg-gray-200"
                                  key={x.Product}>
                                  <Text className="m-1 text-l text-black">
                                    Product: {x.Product}
                                  </Text>
                                  <Text className="m-1 text-l text-black">
                                    Rank: {x.Rank}
                                  </Text>
                                  <Text className="m-1 text-l text-black">
                                    Average Retail Price: {x.AverageRetailPrice}
                                  </Text>
                                </View>
                              );
                            },
                          )}
                        </View>
                      </ScrollView>
                    );
                  case 'GetTopProductsInItemSalesPerStoreFromTopProducts':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetTopProductsInItemSalesPerStoreFromTopProductsFromBoApi?.map(
                            x => {
                              return (
                                <View
                                  className="p-3 bg-gray-200"
                                  key={x.Product}>
                                  <Text className="m-1 text-l text-black">
                                    Product: {x.Product}
                                  </Text>
                                  <Text className="m-1 text-l text-black">
                                    Rank: {x.Rank}
                                  </Text>
                                  <Text className="m-1 text-l text-black">
                                    Average Retail Price: {x.AverageRetailPrice}
                                  </Text>
                                </View>
                              );
                            },
                          )}
                        </View>
                      </ScrollView>
                    );
                  case 'GetProductCategoryNamesFromSeasonality':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetProductCategoryNamesFromSeasonalityFromBoApi?.map(
                            x => {
                              return (
                                <View className="p-3 bg-gray-200" key={x}>
                                  <Text className="m-1 text-l text-black">
                                    {x}
                                  </Text>
                                </View>
                              );
                            },
                          )}
                        </View>
                      </ScrollView>
                    );
                  case 'GetSeasonality':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetSeasonalityFromBoApi?.map(x => {
                            return (
                              <View
                                className="p-3 bg-gray-200"
                                key={x.DateMonth}>
                                <Text className="m-1 text-l text-black">
                                  Category: {x.Category}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Date Month: {x.DateMonth}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Month Name: {x.MonthName}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Seasonality: {x.Seasonality}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    );
                  case 'GetSeasonalityDetails':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetSeasonalityDetailsFromBoApi?.map(x => {
                            return (
                              <View
                                className="p-3 bg-gray-200"
                                key={x.SubCategory}>
                                <Text className="m-1 text-l text-black">
                                  Category: {x.Category}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Sub Category: {x.Subcategory}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Date Month: {x.DateMonth}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Month Name: {x.MonthName}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Seasonality: {x.Seasonality}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    );
                  case 'GetTransactionsWeeks':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetTransactionsWeeksFromBoApi?.map(x => {
                            return (
                              <View className="p-3 bg-gray-200" key={x.IsoWeek}>
                                <Text className="m-1 text-l text-black">
                                  Iso Year: {x.IsoYear}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Iso Week: {x.IsoWeek}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Week Description: {x.WeekDescription}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    );
                  case 'GetTransactionsStoreNames':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetTransactionsStoreNamesFromBoApi?.map(x => {
                            return (
                              <View className="p-3 bg-gray-200" key={x.StoreId}>
                                <Text className="m-1 text-l text-black">
                                  Store Id: {x.StoreId}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Store Name: {x.StoreName}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    );
                  case 'GetTransactionAnalysisTopHour':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          <Text className="m-1 text-l text-black">
                            Transactions:{' '}
                            {
                              reportsGetTransactionAnalysisTopHourFromBoApi.Transactions
                            }
                          </Text>
                          <Text className="m-1 text-l text-black">
                            Military Hour:{' '}
                            {
                              reportsGetTransactionAnalysisTopHourFromBoApi.MilitaryHour
                            }
                          </Text>
                        </View>
                      </ScrollView>
                    );
                  case 'GetTransactionAnalysisTopDay':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          <Text className="m-1 text-l text-black">
                            Transactions:{' '}
                            {
                              reportsGetTransactionAnalysisTopDayFromBoApi.Transactions
                            }
                          </Text>
                          <Text className="m-1 text-l text-black">
                            Day Name:{' '}
                            {
                              reportsGetTransactionAnalysisTopDayFromBoApi.DayName
                            }
                          </Text>
                        </View>
                      </ScrollView>
                    );
                  case 'GetTransactionsPerHours':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetTransactionsPerHoursFromBoApi?.map(x => {
                            return (
                              <View
                                className="p-3 bg-gray-200"
                                key={x.MilitaryHour}>
                                <Text className="m-1 text-l text-black">
                                  Transactions: {x.Transactions}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Military Hour: {x.MilitaryHour}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    );
                  case 'GetTransactionsPerDay':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetTransactionsPerDayFromBoApi?.map(x => {
                            return (
                              <View className="p-3 bg-gray-200" key={x.DayName}>
                                <Text className="m-1 text-l text-black">
                                  Transactions: {x.Transactions}
                                </Text>
                                <Text className="m-1 text-l text-black">
                                  Day Name: {x.DayName}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </ScrollView>
                    );
                  case 'GetAnalysisWeekHourlyTransactions':
                    return (
                      <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{
                          elevation: 50,
                          height: height / 1.5,
                          marginTop: 20,
                        }}>
                        <View className="p-2 bg-gray-200">
                          {reportsGetAnalysisWeekHourlyTransactionsFromBoApi?.map(
                            (x, index) => {
                              return (
                                <View className="p-3 bg-gray-200" key={index}>
                                  <Text className="m-1 text-l text-black">
                                    Transactions: {x.Transactions}
                                  </Text>
                                  <Text className="m-1 text-l text-black">
                                    Day Name: {x.DayName}
                                  </Text>
                                  <Text className="m-1 text-l text-black">
                                    Military Hour: {x.MilitaryHour}
                                  </Text>
                                </View>
                              );
                            },
                          )}
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

export default ReportsScreen;
