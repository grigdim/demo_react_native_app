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
  ImageBackground,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useState, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {selectBox} from '../features/bootstrap';
import {selectToken} from '../features/bootstrap';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {setToken} from '../features/bootstrap';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Tabs from './SalesTabsScreen';
import {ScrollView} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DrawerHeader from './DrawerHeader';
import {useTranslation} from 'react-i18next';
import SwitchSelector from 'react-native-switch-selector';

const options = [
  {label: 'Ελληνικά', value: 'el'},
  {label: 'English', value: 'en'},
];

const LoginScreen = () => {
  const {t, i18n} = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleLanguageChange = newLanguage => {
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const togglePicker = () => {
    setPickerVisible(!isPickerVisible);
  };

  const {height, width} = Dimensions.get('screen');
  const {input, buttonText, disabledButton} = style;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vat, setVat] = useState('');
  const [loading, setLoading] = useState(false);
  const [emulator, setEmulator] = useState(null);
  // const [softKeysEnabled, setSoftKeysEnabled] = useState(false);
  // const [softKeys, setSoftKeys] = useState(null);
  const [login, setLogin] = useState(true);
  const [registeredEmail, setRegisteredEmail] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState();

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
      Alert.alert(t('warning'), t('validVatNumber'), [
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
      email === 'dgrigoriadis@intale.com' ||
      email === 'gsakellaropoulos@intale.com'
        ? setRegisteredEmail(true)
        : setRegisteredEmail(false);
      setLogin(false);
    } else {
      Alert.alert(t('warning'), t('validEmail'), [
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
      // username: 'intaleadmin',
      // password: '2NJDtm2w#nUh$+Hm',
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
    if (data.Code === null) {
      setLoginErrorMessage(data.Message);
    } else {
      dispatch(setToken(data));
    }
    setLoading(false);
  };

  const isRunningOnEmulator = async () => {
    setEmulator(await DeviceInfo.isEmulator());
  };
  useEffect(() => {
    isRunningOnEmulator();
  }, [emulator]);

  return (
    <ImageBackground
      source={require('../images/intale3.png')}
      className="flex-1 w-full h-full"
      resizeMode="stretch">
      <SafeAreaView className="flex-1 justify-center items-center">
        {loading ? (
          <View
            className="w-8/12 justify-center items-center mt-2"
            style={{height: height / 1.33}}>
            <ActivityIndicator color="#00CCBB" size="large" />
          </View>
        ) : !token ? (
          login ? (
            <View
              className="justify-center items-center space-y-6 w-10/12 rounded-lg py-10"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}>
              <View className="items-center">
                <Icon
                  name="user"
                  size={75}
                  color="white"
                  // color="rgb(59 130 246)"
                />
                <Text className="text-white text-3xl">
                  {t('helloIntalerLoginScreen')}
                </Text>
              </View>
              <TextInput
                onChangeText={handleChangeEmail}
                style={input}
                placeholder="email"
                placeholderTextColor={'white'}
                keyboardType="email-address"
                clearButtonMode={'always'}
                ref={inputRef}
              />
              <TouchableOpacity
                style={[isEmailDisabled && disabledButton]}
                onPress={handleCheckEmail}
                disabled={isEmailDisabled}
                className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
                <Text style={buttonText}>{t('submit')}</Text>
              </TouchableOpacity>
            </View>
          ) : registeredEmail ? (
            <View
              className="justify-center space-y-10 items-center w-10/12 py-10 rounded-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}>
              <Text className="text-center text-xl font-bold text-white">
                {t('oneTimePassword')}
              </Text>
              <TextInput
                onChangeText={handleChangePassword}
                style={input}
                placeholder={t('password')}
                placeholderTextColor={'white'}
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
                  <Text style={buttonText}>{t('backToLogin')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[isPasswordDisabled && disabledButton]}
                  onPress={handleLogin}
                  disabled={isPasswordDisabled}
                  className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
                  <Text style={buttonText}>{t('submit')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              className="justify-center space-y-10 items-center w-10/12 py-10 rounded-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}>
              <Text className="text-center text-xl font-bold text-white">
                {t('nonRegisteredEmail')}
              </Text>
              <TextInput
                onChangeText={handleChangeVat}
                style={input}
                placeholder={t('vat')}
                placeholderTextColor={'white'}
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
                  <Text style={buttonText}>{t('backToLogin')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmitVat}
                  style={[isVatDisabled && disabledButton]}
                  disabled={isVatDisabled}
                  className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
                  <Text style={buttonText}>{t('submit')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        ) : (
          <ScrollView className="flex-1 w-full h-full">
            <TouchableOpacity>
              <DrawerHeader />
            </TouchableOpacity>
            <View
              className="justify-center items-center"
              style={{height: height / 1.33}}>
              <TouchableOpacity
                className="bg-emerald-900 my-2 mx-auto p-2 mt-5 rounded-2xl"
                onPress={() => {
                  navigation.navigate('LineChartScreen');
                }}
                style={{elevation: 20}}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('goToLineChartScreen')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-cyan-300 mx-auto my-2 p-2 rounded-2xl"
                onPress={() => {
                  navigation.navigate('AuditScreen');
                }}
                style={{elevation: 20}}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('goToAuditScreen')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-indigo-300 my-2 mx-auto p-2 rounded-2xl"
                onPress={() => {
                  navigation.navigate('StoreScreen');
                }}
                style={{elevation: 20}}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('goToStoreScreen')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-orange-300 my-2 mx-auto p-2 rounded-2xl"
                onPress={() => {
                  navigation.navigate('ProductSalesScreen');
                }}
                style={{elevation: 20}}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('goToProductSalesScreen')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-900 mx-auto my-2 p-2 rounded-2xl"
                onPress={() => {
                  navigation.navigate('SalesTabsScreen');
                }}
                style={{elevation: 20}}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('goToSalesTabsScreen')}
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
                style={{elevation: 20}}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('deleteTokenAndLoginAgain')}
                </Text>
              </TouchableOpacity>

              {/* Attribute "Freepik" for rounded language flags */}

              <View style={languageStyle.container}>
                <View style={languageStyle.flagContainer}>
                  <TouchableOpacity onPress={togglePicker} activeOpacity={0.7}>
                    <Image
                      style={languageStyle.flag}
                      source={
                        i18n.language === 'en'
                          ? require('../images/england.png')
                          : require('../images/greece.png')
                      }
                    />
                  </TouchableOpacity>
                  {isPickerVisible && (
                    <View style={languageStyle.pickerContainer}>
                      <Picker
                        style={languageStyle.picker}
                        selectedValue={selectedLanguage}
                        onValueChange={handleLanguageChange}>
                        <Picker.Item label={t('english')} value="en" />
                        <Picker.Item label={t('greek')} value="el" />
                      </Picker>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const style = StyleSheet.create({
  input: {
    height: 40,
    width: '75%',
    borderWidth: 1,
    padding: 10,
    color: 'white',
    borderRadius: 5,
    textAlign: 'center',
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

const languageStyle = StyleSheet.create({
  container: {
    marginTop: 30,
    elevation: 30,
  },
  picker: {
    height: 30,
    width: 200,
    color: 'black',
    fontSize: 20,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    overflow: 'hidden',
    marginLeft: 10,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 52,
    height: 52,
  },
});

export default LoginScreen;
