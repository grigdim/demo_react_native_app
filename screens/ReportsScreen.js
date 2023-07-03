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
    const [reportsFromBoApi, setStoresFromBoApi] = useState();
    const [reports2FromBoApi, setStores2FromBoApi] = useState();
    const [reports3FromBoApi, setStores3FromBoApi] = useState();
    const [reports4FromBoApi, setStores4FromBoApi] = useState();
    const [reports5FromBoApi, setStores5FromBoApi] = useState();
    const [reports6FromBoApi, setStores6FromBoApi] = useState();
    const [loading, setLoading] = useState(false);
    const [productCategoryName, setProductCategoryName] = useState(1);
    const [productSubCategoryName, setProductSubCategoryName] = useState(1);
    const [selectedLabel, setSelectedLabel] = useState('GetProductCategoryNamesFromTopProducts');

    const handleProductCategoryName = inputText => {
        setProductCategoryName(inputText);
    };

    const handleProductSubCategoryName = inputText => {
        setProductSubCategoryName(inputText);
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
            setStoresFromBoApi(data);
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
                `http://${ip}:3000/bo/Reports/GetProductSubCategoryNamesFromTopProducts?productCategoryName=${productCategoryName}`,
                requestOptions,
            );
            const data = await response.json();
            console.log(data);
            setStores2FromBoApi(data);
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
                `http://${ip}:3000/bo/Reports/GetTopProductsInItemSalesFromTopProducts?productCategoryName=${productCategoryName}&productCategoryName=${productSubCategoryName}`,
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
                            setStoresFromBoApi();
                        }}
                        className="p-2 my-3 border border-solid bg-gray-200 border-purple-200 rounded-xl"
                        style={{ elevation: 10 }}>
                        <Text className="text-pink-500 text-center font-bold text-3xl">
                            {reportsFromBoApi ? 'New search' : 'Search for reports'}
                        </Text>
                    </TouchableOpacity>
                    <View>
                        {!reportsFromBoApi && !reports2FromBoApi && !reports3FromBoApi ? (
                            <TouchableOpacity className="bg-pink-200 rounded-lg my-2 p-2 justify-center align-center">
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
                                </Picker>
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    {!reportsFromBoApi && !reports2FromBoApi && !reports3FromBoApi
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
                                            {/* Every Product Gategory Name Available */}
                                            {/* <Picker
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
                                                    label="SNACKS"
                                                    value="SNACKS"
                                                /> 
                                                <Picker.Item
                                                    label="ΑΝΑΨΥΚΤΙΚΑ - ΧΥΜΟΙ"
                                                    value="ΑΝΑΨΥΚΤΙΚΑ - ΧΥΜΟΙ"
                                                /> 
                                                <Picker.Item
                                                    label="ΓΑΛΑΚΤΟΚΟΜΙΚΑ"
                                                    value="ΓΑΛΑΚΤΟΚΟΜΙΚΑ"
                                                /> 
                                                <Picker.Item
                                                    label="ΚΑΡΑΜΕΛΕΣ - ΖΕΛΕΔΑΚΙΑ"
                                                    value="ΚΑΡΑΜΕΛΕΣ - ΖΕΛΕΔΑΚΙΑ"
                                                /> 
                                                <Picker.Item
                                                    label="ΜΠΙΣΚΟΤΑ - ΓΛΥΚΑ ΣΟΡΟΠΙΑΣΤΑ"
                                                    value="ΜΠΙΣΚΟΤΑ - ΓΛΥΚΑ ΣΟΡΟΠΙΑΣΤΑ"
                                                /> 
                                                <Picker.Item
                                                    label="ΜΠΥΡΕΣ - ΟΥΖΑ - ΤΣΙΠΟΥΡΑ - ΚΡΑΣΙΑ - ΠΟΤΑ"
                                                    value="ΜΠΥΡΕΣ - ΟΥΖΑ - ΤΣΙΠΟΥΡΑ - ΚΡΑΣΙΑ - ΠΟΤΑ"
                                                /> 
                                                <Picker.Item
                                                    label="ΝΕΡΟ ΠΑΓΑΚΙΑ"
                                                    value="ΝΕΡΟ ΠΑΓΑΚΙΑ"
                                                /> 
                                                <Picker.Item
                                                    label="ΠΑΓΩΤΑ"
                                                    value="ΠΑΓΩΤΑ"
                                                /> 
                                                <Picker.Item
                                                    label="ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΑ"
                                                    value="ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΑ"
                                                /> 
                                                <Picker.Item
                                                    label="ΣΟΚΟΛΑΤΕΣ -ΓΚΟΦΡΕΤΕΣ-ΣΟΚΟΛΑΤΑΚΙΑ"
                                                    value="ΣΟΚΟΛΑΤΕΣ -ΓΚΟΦΡΕΤΕΣ-ΣΟΚΟΛΑΤΑΚΙΑ"
                                                /> 
                                                <Picker.Item
                                                    label="ΤΣΙΧΛΕΣ"
                                                    value="ΤΣΙΧΛΕΣ"
                                                /> 
                                                <Picker.Item
                                                    label="ΧΑΡΤΑΚΙΑ - ΦΙΛΤΡΑΚΙΑ - ΕΙΔΗ ΚΑΠΝΙΣΤΟΥ"
                                                    value="ΧΑΡΤΑΚΙΑ - ΦΙΛΤΡΑΚΙΑ - ΕΙΔΗ ΚΑΠΝΙΣΤΟΥ"
                                                /> 
                                            </Picker> */}

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
                                                onChangeText={handleProductSubCategoryName}
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
                                default:
                                    return null;
                            }
                        })()
                        : null}

                    {reportsFromBoApi || reports2FromBoApi
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
                                    {/* case 'GetTopProductsInItemSalesFromTopProducts':
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
                                                        <View className="p-3 bg-gray-200" key={x}>
                                                            <Text className="m-1 text-l text-black">
                                                                {x}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </ScrollView>
                                    ); */}
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
