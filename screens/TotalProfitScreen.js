/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { selectToken } from '../features/bootstrap';
import { useDispatch, useSelector } from 'react-redux';

const TotalProfitScreen = () => {
    const navigation = useNavigation();
    const token = useSelector(selectToken);
    const [storesFromBoApi, setStoresFromBoApi] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTotalProfitDataFromBoApi = async () => {
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
                'http://192.168.1.69:3000/bo/Invoices/GetTotalProfitDetailsServerSide?fromDate=2019-01-01 00:00:00&toDate=2019-01-31 23:59:59&storesIds=1',
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
        fetchTotalProfitDataFromBoApi();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
            {loading ? (
                <ActivityIndicator color="rgb(34 211 238)" size="large" />
            ) : (
                <View className="mb-20 mx-5">
                    <View
                        className="py-2 my-5 bg-gray-200 border border-solid border-green-200 rounded-xl"
                        style={{ elevation: 50 }}>
                        <Text className="text-green-400 text-center font-bold text-3xl">
                            Total Profit Data
                        </Text>
                    </View>
                    <ScrollView
                        className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                        style={{ elevation: 50 }}>
                        {storesFromBoApi?.map(x => (
                            <View className="p-2 bg-gray-200" key={x.Level}>
                                <Text className="m-1 text-xl text-black">
                                    Level: {x.Level}
                                </Text>
                                <Text className="m-1 text-xl text-black">
                                    VAT: {x.TotalProfitVat}
                                </Text>
                                <Text className="m-1 text-xl text-black">
                                    Total profit with vat: {x.TotalProfitWithVAT} €
                                </Text>
                                <Text className="m-1 text-xl text-black">
                                    Total profit without vat: {x.TotalProfitWithoutVAT} %
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </SafeAreaView>
    );
};

export default TotalProfitScreen;