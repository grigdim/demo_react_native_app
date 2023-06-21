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
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectBox } from '../features/bootstrap';
import { selectToken } from '../features/bootstrap';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/bootstrap';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const LoginScreen = () => {
  const { input, button, buttonText, disabledButton } = style;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emulator, setEmulator] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const box = useSelector(selectBox);
  const token = useSelector(selectToken);

  const handleChangeUsername = inputText => {
    setUsername(inputText);
  };

  const handleChangePassword = inputText => {
    setPassword(inputText);
  };

  const isLoginDisabled =
    username === '' ||
    username === null ||
    password === null ||
    password === '';

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
    <SafeAreaView className="flex-1 justify-center">
      {loading ? (
        <ActivityIndicator color="#00CCBB" size="large" />
      ) : !token ? (
        <View>
          <View className="justify-center items-center">
            <Icon name="user" size={50} color="#575757" />
          </View>
          <View>
            <TextInput
              onChangeText={handleChangeUsername}
              style={input}
              placeholder="username"
              placeholderTextColor={'darkgrey'}
              keyboardType="default"
              clearButtonMode={'always'}
            />

            <TextInput
              onChangeText={handleChangePassword}
              style={input}
              placeholder="password"
              placeholderTextColor={'darkgrey'}
              secureTextEntry
            />
          </View>
          <View>
            <TouchableOpacity
              style={[button, isLoginDisabled && disabledButton]}
              onPress={handleLogin}
              disabled={isLoginDisabled}
              className="rounded-2xl">
              <Text style={buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
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
            className="bg-red-300 mx-auto my-2 p-2 rounded-2xl"
            onPress={() => {
              dispatch(setToken(null));
              setUsername(null);
              setPassword(null);
            }}
            style={{ elevation: 20 }}>
            <Text className="text-center text-xl text-bold text-white">
              Delete token and login again
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
    width: '50%',
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    padding: 10,
    color: 'black',
    borderRadius: 5,
  },
  button: {
    height: 40,
    width: '25%',
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
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
