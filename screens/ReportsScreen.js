/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { selectToken } from '../features/bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import { ip } from '@env';

const ReportsScreen = () => {
    const navigation = useNavigation();
    const { width, height } = Dimensions.get('screen');
    const token = useSelector(selectToken);
    const [reportsFromBoApi, setReportsFromBoApi] = useState();
    const [reports2FromBoApi, setReports2FromBoApi] = useState();
    const [reports3FromBoApi, setReports3FromBoApi] = useState();
    const [reports4FromBoApi, setReports4FromBoApi] = useState();
    const [reports5FromBoApi, setReports5FromBoApi] = useState();
    const [reports6FromBoApi, setReports6FromBoApi] = useState();
    const [reports7FromBoApi, setReports7FromBoApi] = useState();
    const [reports8FromBoApi, setReports8FromBoApi] = useState();
    const [reports9FromBoApi, setReports9FromBoApi] = useState();
    const [loading, setLoading] = useState(false);
    const [storeIdsForTransactionWeeks, setStoreIdsForTransactionWeeks] = useState(1);
    const [productCategoryNameForSubCategoryNames, setProductCategoryNameForSubCategoryNames] = useState(1);
    const [productCategoryNameForTopProductsInItemSales, setProductCategoryNameForTopProductsInItemSales] = useState(1);
    const [productCategoryNameForTopProductsInItemSalesPerStore, setProductCategoryNameForTopProductsInItemSalesPerStore] = useState(1);
    const [productCategoryNameForSeasonality, setProductCategoryNameForSeasonality] = useState(1);
    const [productCategoryNameForSeasonalityDetails, setProductCategoryNameForSeasonalityDetails] = useState(1);
    const [productSubCategoryNameForTopProductsInItemSales, setProductSubCategoryNameForTopProductsInItemSales] = useState(1);
    const [productSubCategoryNameForTopProductsInItemSalesPerStore, setProductSubCategoryNameForTopProductsInItemSalesPerStore] = useState(1);
    const [selectedProductCategory, setSelectedProductCategory] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('GetProductCategoryNamesFromTopProducts');

    // Every Product Category Name Available 
    const productSubCategoryOptions = [
        { label: 'ΑΝΑΨΥΚΤΙΚΑ - ΧΥΜΟΙ', value: 'ΑΝΑΨΥΚΤΙΚΑ - ΧΥΜΟΙ' },
        { label: 'SNACKS', value: 'SNACKS' },
        { label: 'ΓΑΛΑΚΤΟΚΟΜΙΚΑ', value: 'ΓΑΛΑΚΤΟΚΟΜΙΚΑ' },
        { label: 'ΚΑΡΑΜΕΛΕΣ - ΖΕΛΕΔΑΚΙΑ', value: 'ΚΑΡΑΜΕΛΕΣ - ΖΕΛΕΔΑΚΙΑ' },
        { label: 'ΜΠΙΣΚΟΤΑ - ΓΛΥΚΑ ΣΟΡΟΠΙΑΣΤΑ', value: 'ΜΠΙΣΚΟΤΑ - ΓΛΥΚΑ ΣΟΡΟΠΙΑΣΤΑ' },
        { label: 'ΜΠΥΡΕΣ - ΟΥΖΑ - ΤΣΙΠΟΥΡΑ - ΚΡΑΣΙΑ - ΠΟΤΑ', value: 'ΜΠΥΡΕΣ - ΟΥΖΑ - ΤΣΙΠΟΥΡΑ - ΚΡΑΣΙΑ - ΠΟΤΑ' },
        { label: 'ΝΕΡΟ ΠΑΓΑΚΙΑ', value: 'ΝΕΡΟ ΠΑΓΑΚΙΑ' },
        { label: 'ΠΑΓΩΤΑ', value: 'ΠΑΓΩΤΑ' },
        { label: 'ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΑ', value: 'ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΑ' },
        { label: 'ΣΟΚΟΛΑΤΕΣ -ΓΚΟΦΡΕΤΕΣ-ΣΟΚΟΛΑΤΑΚΙΑ', value: 'ΣΟΚΟΛΑΤΕΣ -ΓΚΟΦΡΕΤΕΣ-ΣΟΚΟΛΑΤΑΚΙΑ' },
        { label: 'ΤΣΙΧΛΕΣ', value: 'ΤΣΙΧΛΕΣ' },
        { label: 'ΧΑΡΤΑΚΙΑ - ΦΙΛΤΡΑΚΙΑ - ΕΙΔΗ ΚΑΠΝΙΣΤΟΥ', value: 'ΧΑΡΤΑΚΙΑ - ΦΙΛΤΡΑΚΙΑ - ΕΙΔΗ ΚΑΠΝΙΣΤΟΥ' },
    ];


    const handleStoreIdsForTransactionWeeks = inputText => {
        setStoreIdsForTransactionWeeks(inputText);
    };

    const handleProductCategoryName = inputText => {
        setProductCategoryNameForSubCategoryNames(inputText);
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

    const handleProductSubCategoryNameForTopProductsInItemSales = (value) => {
        setProductSubCategoryNameForTopProductsInItemSales(value);
    };

    const handleProductSubCategoryNameForTopProductsInItemSalesPerStore = (value) => {
        setProductSubCategoryNameForTopProductsInItemSalesPerStore(value);
    };

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
                `http://${ip}:3000/bo/Reports/GetProductCategoryNamesFromTopProducts`,
                requestOptions,
            );
            const data = await response.json();
            console.log(data);
            setReportsFromBoApi(data);
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
                `http://${ip}:3000/bo/Reports/GetProductSubCategoryNamesFromTopProducts?productCategoryName=${productCategoryNameForSubCategoryNames}`,
                requestOptions,
            );
            const data = await response.json();
            console.log(data);
            setReports2FromBoApi(data);
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
                `http://${ip}:3000/bo/Reports/GetTopProductsInItemSalesFromTopProducts?productCategoryName=${productCategoryNameForTopProductsInItemSales}&productCategoryName=${productSubCategoryNameForTopProductsInItemSales}`,
                requestOptions,
            );
            const data = await response.json();
            console.log(data);
            setReports3FromBoApi(data);
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
                `http://${ip}:3000/bo/Reports/GetTopProductsInItemSalesPerStoreFromTopProducts?productCategoryName=${productCategoryNameForTopProductsInItemSalesPerStore}&productCategoryName=${productSubCategoryNameForTopProductsInItemSalesPerStore}`,
                requestOptions,
            );
            const data = await response.json();
            console.log(data);
            setReports4FromBoApi(data);
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
                `http://${ip}:3000/bo/Reports/GetProductCategoryNamesFromSeasonality`,
                requestOptions,
            );
            const data = await response.json();
            console.log(data);
            setReports5FromBoApi(data);
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
                `http://${ip}:3000/bo/Reports/GetSeasonality?productCategoryName=${productCategoryNameForSeasonality}`,
                requestOptions,
            );
            const data = await response.json();
            console.log(data);
            setReports6FromBoApi(data);
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
                `http://${ip}:3000/bo/Reports/GetSeasonalityDetails?productCategoryName=${productCategoryNameForSeasonalityDetails}`,
                requestOptions,
            );
            const data = await response.json();
            console.log(data);
            setReports7FromBoApi(data);
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
                `http://${ip}:3000/bo/Reports/GetTransactionsWeeks?productCategoryName=${storeIdsForTransactionWeeks}`,
                requestOptions,
            );
            const data = await response.json();
            console.log(data);
            setReports8FromBoApi(data);
        }
        // end of request
        setLoading(false);
    };

    useEffect(() => {
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
            {loading ? (
                <ActivityIndicator color="rgb(34 211 238)" size="large" />
            ) : (
                <View className="w-10/12">
                    <TouchableOpacity
                        onPress={() => {
                            // setOpen(false);
                            setReportsFromBoApi();
                            setReports2FromBoApi(null);
                            setReports3FromBoApi(null);
                            setReports4FromBoApi(null);
                            setReports5FromBoApi(null);
                            setReports6FromBoApi(null);
                            setReports7FromBoApi(null);
                            setReports8FromBoApi(null);
                        }}
                        className="p-2 my-3 border border-solid bg-gray-200 border-purple-200 rounded-xl"
                        style={{ elevation: 10 }}>
                        <Text className="text-pink-500 text-center font-bold text-3xl">
                            {reportsFromBoApi || reports2FromBoApi || reports3FromBoApi || reports4FromBoApi || reports5FromBoApi || reports6FromBoApi || reports7FromBoApi
                                || reports8FromBoApi
                                ? 'New search' : 'Search for reports'}
                        </Text>
                    </TouchableOpacity>
                    <View>
                        {!reportsFromBoApi && !reports2FromBoApi && !reports3FromBoApi && !reports4FromBoApi && !reports5FromBoApi && !reports6FromBoApi && !reports7FromBoApi
                            && !reports8FromBoApi
                            ? (
                                <TouchableOpacity className="bg-pink-200 rounded-lg my-2 p-2 justify-center align-center">
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
                                            label="Product Category Names"
                                            value="GetProductCategoryNamesFromTopProducts"
                                        />
                                        <Picker.Item
                                            label="Product Sub Category Names"
                                            value="GetProductSubCategoryNamesFromTopProducts"
                                        />
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
                                        <Picker.Item
                                            label="Seasonality"
                                            value="GetSeasonality"
                                        />
                                        <Picker.Item
                                            label="Seasonality Details"
                                            value="GetSeasonalityDetails"
                                        />
                                        <Picker.Item
                                            label="Transaction Weeks"
                                            value="GetTransactionsWeeks"
                                        />
                                    </Picker>
                                </TouchableOpacity>
                            ) : null}
                    </View>

                    {!reportsFromBoApi && !reports2FromBoApi && !reports3FromBoApi && !reports4FromBoApi && !reports5FromBoApi && !reports6FromBoApi && !reports7FromBoApi
                        && !reports8FromBoApi
                        ? (() => {
                            switch (selectedLabel) {
                                case 'GetProductCategoryNamesFromTopProducts':
                                    return (
                                        <View>
                                            <TouchableOpacity
                                                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                                                onPress={() => fetchProductCategoryNamesFromBoApi()}>
                                                <Text className="text-center text-lg text-white">
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                case 'GetProductSubCategoryNamesFromTopProducts':
                                    return (
                                        <View>
                                            <Text className="text-center text-xl">
                                                Product Category Name:{' '}
                                            </Text>
                                            <TextInput
                                                onChangeText={handleProductCategoryName}
                                                style={styles.input}
                                                selectTextOnFocus
                                                placeholder="Product Category Name"
                                                placeholderTextColor={'darkgrey'}
                                                keyboardType="default"
                                                clearButtonMode={'always'}
                                                returnKeyType="done"
                                            />
                                            <TouchableOpacity
                                                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                                                onPress={() => fetchProductSubCategoryNamesFromTopProductsBoApi()}>
                                                <Text className="text-center text-lg text-white">
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                case 'GetTopProductsInItemSalesFromTopProducts':
                                    return (
                                        <View>
                                            <Text className="text-center text-xl">
                                                Product Sub Category Name:{' '}
                                            </Text>
                                            <TextInput
                                                onChangeText={handleProductCategoryNameForProductsInItemSales}
                                                style={styles.input}
                                                selectTextOnFocus
                                                placeholder="Product Sub Category Name"
                                                placeholderTextColor={'darkgrey'}
                                                keyboardType="default"
                                                clearButtonMode={'always'}
                                                returnKeyType="done"
                                            />
                                            <TouchableOpacity
                                                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                                                onPress={() => fetchTopProductsInItemSalesFromTopProductsBoApi()}>
                                                <Text className="text-center text-lg text-white">
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                case 'GetTopProductsInItemSalesPerStoreFromTopProducts':
                                    return (
                                        <View>
                                            <Text className="text-center text-xl">
                                                Product Sub Category Name:{' '}
                                            </Text>
                                            <TextInput
                                                onChangeText={handleProductCategoryNameForProductsInItemSalesPerStore}
                                                style={styles.input}
                                                selectTextOnFocus
                                                placeholder="Product Sub Category Name"
                                                placeholderTextColor={'darkgrey'}
                                                keyboardType="default"
                                                clearButtonMode={'always'}
                                                returnKeyType="done"
                                            />
                                            <TouchableOpacity
                                                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                                                onPress={() => fetchTopProductsInItemSalesPerStoreFromTopProductsBoApi()}>
                                                <Text className="text-center text-lg text-white">
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                case 'GetProductCategoryNamesFromSeasonality':
                                    return (
                                        <View>
                                            <TouchableOpacity
                                                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                                                onPress={() => fetchProductCategoryNamesFromSeasonalityBoApi()}>
                                                <Text className="text-center text-lg text-white">
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                case 'GetSeasonality':
                                    return (
                                        <View>
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
                                                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                                                onPress={() => fetchSeasonalityBoApi()}>
                                                <Text className="text-center text-lg text-white">
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                case 'GetSeasonalityDetails':
                                    return (
                                        <View>
                                            <Text className="text-center text-xl">
                                                Product Category Name:{' '}
                                            </Text>
                                            <TextInput
                                                onChangeText={handleProductCategoryNameForSeasonalityDetails}
                                                style={styles.input}
                                                selectTextOnFocus
                                                placeholder="Product Category Name"
                                                placeholderTextColor={'darkgrey'}
                                                keyboardType="default"
                                                clearButtonMode={'always'}
                                                returnKeyType="done"
                                            />
                                            <TouchableOpacity
                                                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                                                onPress={() => fetchSeasonalityDetailsBoApi()}>
                                                <Text className="text-center text-lg text-white">
                                                    Submit
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                case 'GetTransactionsWeeks':
                                    return (
                                        <View>
                                            <Text className="text-center text-xl">
                                                Product Category Name:{' '}
                                            </Text>
                                            <TextInput
                                                onChangeText={handleStoreIdsForTransactionWeeks}
                                                style={styles.input}
                                                selectTextOnFocus
                                                placeholder="Store Id"
                                                placeholderTextColor={'darkgrey'}
                                                keyboardType="default"
                                                clearButtonMode={'always'}
                                                returnKeyType="done"
                                            />
                                            <TouchableOpacity
                                                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                                                onPress={() => fetchTransactionsWeeksBoApi()}>
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

                    {reportsFromBoApi || reports2FromBoApi || reports3FromBoApi || reports4FromBoApi || reports5FromBoApi || reports6FromBoApi || reports7FromBoApi
                        || reports8FromBoApi
                        ? (() => {
                            switch (selectedLabel) {
                                case 'GetProductCategoryNamesFromTopProducts':
                                    return (
                                        <ScrollView
                                            className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                                            style={{
                                                elevation: 50,
                                                height: height / 1.5,
                                                marginTop: 20,
                                            }}>
                                            <View className="p-2 bg-gray-200">
                                                {reportsFromBoApi.map(x => {
                                                    return (
                                                        <View className="p-3 bg-gray-200" key={x}>
                                                            <Text className="m-1 text-l text-black">
                                                                {x}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </ScrollView>
                                    );
                                case 'GetProductSubCategoryNamesFromTopProducts':
                                    return (
                                        <ScrollView
                                            className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                                            style={{
                                                elevation: 50,
                                                height: height / 1.5,
                                                marginTop: 20,
                                            }}>
                                            <View className="p-2 bg-gray-200">
                                                {reports2FromBoApi.map(x => {
                                                    return (
                                                        <View className="p-3 bg-gray-200" key={x}>
                                                            <Text className="m-1 text-l text-black">
                                                                {x}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </ScrollView>
                                    );
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
                                                {reports3FromBoApi.map(x => {
                                                    return (
                                                        <View className="p-3 bg-gray-200" key={x.Product}>
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
                                                })}
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
                                                {reports4FromBoApi.map(x => {
                                                    return (
                                                        <View className="p-3 bg-gray-200" key={x.Product}>
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
                                                })}
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
                                                {reports5FromBoApi.map(x => {
                                                    return (
                                                        <View className="p-3 bg-gray-200" key={x}>
                                                            <Text className="m-1 text-l text-black">
                                                                {x}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
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
                                                {reports6FromBoApi.map(x => {
                                                    return (
                                                        <View className="p-3 bg-gray-200" key={x.DateMonth}>
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
                                                {reports7FromBoApi.map(x => {
                                                    return (
                                                        <View className="p-3 bg-gray-200" key={x.SubCategory}>
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
                                                {reports8FromBoApi.map(x => {
                                                    return (
                                                        <View className="p-3 bg-gray-200" key={x}>
                                                            <Text className="m-1 text-l text-black">
                                                                {x}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </ScrollView>
                                    );
                                default:
                                    return null;
                            }
                        })()
                        : null}
                </View>
            )
            }
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
