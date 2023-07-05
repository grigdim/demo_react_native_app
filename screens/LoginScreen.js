/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectBox } from '../features/bootstrap';
import { selectToken } from '../features/bootstrap';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/bootstrap';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Tabs from './SalesTabsScreen';

const LoginScreen = () => {
  const { height, width } = Dimensions.get('screen');
  const { input, button, buttonText, disabledButton } = style;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vat, setVat] = useState('');
  const [loading, setLoading] = useState(false);
  const [emulator, setEmulator] = useState(null);
  const [softKeysEnabled, setSoftKeysEnabled] = useState(false);
  const [softKeys, setSoftKeys] = useState(null);
  const [login, setLogin] = useState(true);
  const [registeredEmail, setRegisteredEmail] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const box = useSelector(selectBox);
  const token = useSelector(selectToken);

  const inputRef = useRef(null);

  const handleChangeEmail = inputText => {
    setEmail(inputText);
  };

  const handleChangePassword = inputText => {
    setPassword(inputText);
  };

  const handleChangeVat = inputText => {
    setVat(inputText);
  };

  const handleSubmitVat = () => {
    if (vat.length === 9 && /^\d+$/.test(vat)) {
      setRegisteredEmail(true);
    } else {
      Alert.alert('Warning', 'Please enter a valid VAT number', [
        {
          text: 'OK',
          onPress: () => {
            setVat('');
          },
        },
      ]);
    }
  };

  const isEmailDisabled = email === '' || email === null;
  const isPasswordDisabled = password === '' || password === null;
  const isVatDisabled = vat === '' || vat === null;

  const isValidEmail = () => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  const handleCheckEmail = () => {
    const valid = isValidEmail();
    if (valid === true) {
      email === 'dgrigoriadis@intale.com'
        ? setRegisteredEmail(true)
        : setRegisteredEmail(false);
      setLogin(false);
    } else {
      Alert.alert('Warning', 'Please enter a valid email', [
        {
          text: 'OK',
          onPress: () => {
            setEmail('');
            inputRef.current.clear();
          },
        },
      ]);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      username: 'admin',
      password:
        'AHS1YZXT4mQ8fjpgbpoEd079DIs5KAmSNGTw7diWYhWLzzIh/SzOoF5T6zghQ4x95A==',
      domain: 'jzois',
      storeId: 4043,
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    const response = await fetch(
      'https://dev-bo-api-gr.azurewebsites.net/bo/account/authenticate',
      requestOptions,
    );
    const data = await response.text();
    dispatch(setToken(data));
    setLoading(false);
  };

  const isRunningOnEmulator = async () => {
    setEmulator(await DeviceInfo.isEmulator());
  };
  useEffect(() => {
    isRunningOnEmulator();
  }, [emulator]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
      {loading ? (
        <ActivityIndicator color="#00CCBB" size="large" />
      ) : !token ? (
        login ? (
          <View className="flex-1 justify-center items-center space-y-6 w-10/12">
            <View className="items-center">
              <Icon
                name="user"
                size={75}
                color="rgb(59 130 246)"
                className=""
              />
              <Text className="text-blue-500 text-3xl">Hello Intaler!</Text>
            </View>
            <TextInput
              onChangeText={handleChangeEmail}
              style={input}
              placeholder="email"
              placeholderTextColor={'darkgrey'}
              keyboardType="email-address"
              clearButtonMode={'always'}
              ref={inputRef}
            />
            <TouchableOpacity
              style={[isEmailDisabled && disabledButton]}
              onPress={handleCheckEmail}
              disabled={isEmailDisabled}
              className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
              <Text style={buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : registeredEmail ? (
          <View className="flex-1 justify-center space-y-10 items-center w-10/12">
            <Text className="text-center text-xl font-bold">
              A one-time password has been sent to your email. Please enter it
              below.
            </Text>
            <TextInput
              onChangeText={handleChangePassword}
              style={input}
              placeholder="password"
              placeholderTextColor={'darkgrey'}
              clearButtonMode={'always'}
              secureTextEntry
            />
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => {
                  setEmail('');
                  setRegisteredEmail(false);
                  setLogin(true);
                }}
                className="rounded-2xl bg-red-500 justify-center items-center w-2/5 h-10">
                <Text style={buttonText}>Back to login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[isPasswordDisabled && disabledButton]}
                onPress={handleLogin}
                disabled={isPasswordDisabled}
                className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
                <Text style={buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center space-y-10 items-center w-10/12">
            <Text className="text-center text-xl font-bold">
              Your email does not correspond to a registered VAT number. Please
              insert a valid VAT number to go with your email.
            </Text>
            <TextInput
              onChangeText={handleChangeVat}
              style={input}
              placeholder="VAT"
              placeholderTextColor={'darkgrey'}
              clearButtonMode={'always'}
            />
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => {
                  setEmail('');
                  setVat('');
                  setPassword('');
                  setRegisteredEmail(false);
                  setLogin(true);
                }}
                className="rounded-2xl bg-red-500 justify-center items-center w-2/5 h-10">
                <Text style={buttonText}>Back to login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitVat}
                style={[isVatDisabled && disabledButton]}
                disabled={isVatDisabled}
                className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
                <Text style={buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      ) : (
        <View>

          {/* Drawer Menu Start (Check App.js for headerShown: false to enable it and see the other option) */}
          <TouchableOpacity
            className="bg-blue-400 my-2 mx-auto p-2 rounded-2xl"
            onPress={() => navigation.openDrawer()}>
            <Text className="text-center text-xl text-bold text-white">
              Open Menu
            </Text>
          </TouchableOpacity>
          {/* Drawer Menu End */}

          <TouchableOpacity
            className="bg-emerald-900 my-2 mx-auto p-2 rounded-2xl"
            onPress={() => {
              navigation.navigate('LineChartScreen');
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Go to line chart screen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-800 my-2 mx-auto p-2 rounded-2xl"
            onPress={() => {
              navigation.navigate('BarChartScreen');
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Go to bar chart screen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-cyan-300 mx-auto my-2 p-2 rounded-2xl"
            onPress={() => {
              navigation.navigate('AuditScreen');
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Go to audit screen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-indigo-300 my-2 mx-auto p-2 rounded-2xl"
            onPress={() => {
              navigation.navigate('StoreScreen');
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Go to store screen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-yellow-300 my-2 mx-auto p-2 rounded-2xl"
            onPress={() => {
              navigation.navigate('TurnoverScreen');
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Go to turnover screen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-300 my-2 mx-auto p-2 rounded-2xl"
            onPress={() => {
              navigation.navigate('TotalProfitScreen');
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Go to total profit screen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-orange-300 my-2 mx-auto p-2 rounded-2xl"
            onPress={() => {
              navigation.navigate('ProductSalesScreen');
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Go to product sales screen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-300 mx-auto my-2 p-2 rounded-2xl"
            onPress={() => {
              dispatch(setToken(null));
              setPassword('');
              setEmail('');
              setVat('');
              setLogin(true);
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Delete token and login again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-900 mx-auto my-2 p-2 rounded-2xl"
            onPress={() => {
              navigation.navigate('SalesTabsScreen');
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Go to sales tabs screen
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 50,
    marginTop: 12,
    marginBottom: 12,
    color: 'darkgrey',
  },
  input: {
    height: 40,
    width: '75%',
    borderWidth: 1,
    padding: 10,
    color: 'black',
    borderRadius: 5,
    textAlign: 'center',
  },
  button: {
    height: 40,
    width: '50%',
    backgroundColor: '#4287f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
});

export default LoginScreen;
