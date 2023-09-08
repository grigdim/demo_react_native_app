/* eslint-disable react/self-closing-comp */
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
  Linking,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useInfo} from '../components/PersonalInfoTaken';
import {store} from '../store';

const LoginScreen = () => {
  const options = [
    {label: 'Ελληνικά', value: 'el'},
    {label: 'English', value: 'en'},
    {label: 'Românesc', value: 'ro'},
  ];
  const {setInfoVat, setInfoPrimaryEmail} = useInfo();
  const {t, i18n} = useTranslation();
  const scrollViewRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isScrolledToEnd, setScrolledToEnd] = useState(false);
  const acceptButtonStyle = isScrolledToEnd
    ? acceptButtonStyles.buttonEnabled
    : acceptButtonStyles.buttonDisabled;

  // // TO BE IMPLEMENTED - START

  // const [VATbyEmailFromBoApi, setVATbyEmailFromBoApi] = useState();
  // const [allVATsbyEmailFromBoApi, setAllVATsByEmailFromBoApi] = useState();
  // const [infoByVATfromBoApi, setInfoByVATfromBoApi] = useState();

  // // Correctly brings back the VAT (tested with button Fetch VAT)
  // const fetchVATbyEmail = async () => {
  //   setLoading(true);
  //   if (__DEV__ && token) {
  //     var myHeaders = new Headers();
  //     myHeaders.append('Token', token);
  //     myHeaders.append('Content-Type', 'application/json');
  //     var requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow',
  //     };

  //     const response = await fetch(
  //       `https://schemas.dev.cb.intalepoint.com/api/v1/schemas/intalecustomers/emailassignedvats/${email}`,
  //       requestOptions,
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //     setVATbyEmailFromBoApi(data);
  //   }
  //   setLoading(false);
  // };

  // const fetchAllVATsbyEmail = async () => {
  //   setLoading(true);
  //   if (__DEV__ && token) {
  //     var myHeaders = new Headers();
  //     myHeaders.append('Token', token);
  //     myHeaders.append('Content-Type', 'application/json');
  //     var requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow',
  //     };

  //     const response = await fetch(
  //       `https://schemas.dev.cb.intalepoint.com/api/v1/schemas/intalecustomers/emailserverassignedvats/inkat`, // HARD CODED ATM
  //       requestOptions,
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //     setAllVATsByEmailFromBoApi(data);
  //   }
  //   setLoading(false);
  // };

  // const fetchInfoByVAT = async () => {
  //   setLoading(true);
  //   if (__DEV__ && token) {
  //     var myHeaders = new Headers();
  //     myHeaders.append('Token', token);
  //     myHeaders.append('Content-Type', 'application/json');
  //     var requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow',
  //     };
  //     const queryParams = new URLSearchParams({
  //       // Needed to get the data for now
  //       loadDwStageInfo: false,
  //       loadPmiInfo: false,
  //     });

  //     const response = await fetch(
  //       `https://schemas.dev.cb.intalepoint.com/api/v1/schemas/intalecustomers/vat/038588921/intaleInfo?${queryParams}`, // HARD CODED ATM
  //       requestOptions,
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //     setInfoByVATfromBoApi(data);
  //   }
  //   setLoading(false);
  // };

  // // TO BE IMPLEMENTED - END

  // Privacy Policy
  const [isPrivacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  const handlePrivacyPolicy = async () => {
    setPrivacyPolicyAccepted(true);
    try {
      await AsyncStorage.setItem('@privacyPolicyAccepted', 'true');
    } catch (error) {
      console.error('Error accepting Privacy Policy:', error); // Never seen
    }
  };

  const handlePrivacyPolicyLink = () => {
    Linking.openURL('https://www.intale.com/privacy');
  };

  // Terms of Service

  const [isTermsOfServiceAccepted, setTermsOfServiceAccepted] = useState(false);

  const handleTermsOfService = async () => {
    setTermsOfServiceAccepted(true);
    try {
      await AsyncStorage.setItem('@termsOfServiceAccepted', 'true');
    } catch (error) {
      console.error('Error accepting Terms of Service:', error); // Never seen
    }
  };

  // New ToS to be added
  // const handleTermsOfServiceLink = () => {
  //   Linking.openURL('https://www.intale.com/terms');
  // };

  // Scroll

  const handleScroll = event => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    if (scrollOffset + scrollViewHeight >= contentHeight - 20) {
      setScrolledToEnd(true);
    } else {
      setScrolledToEnd(false);
    }
  };

  // Use Effects

  useEffect(() => {
    const loadTermsOfServiceAcceptedState = async () => {
      try {
        const storedTermsOfServiceAccepted = await AsyncStorage.getItem(
          '@termsOfServiceAccepted',
        );
        if (storedTermsOfServiceAccepted === 'true') {
          setTermsOfServiceAccepted(true);
        }
      } catch (error) {
        console.error('Error accepting Terms of Service:', error); // Never seen
      }
    };
    loadTermsOfServiceAcceptedState();
  }, []);

  useEffect(() => {
    const loadPrivacyPolicyAcceptedState = async () => {
      try {
        const storedPrivacyPolicyAccepted = await AsyncStorage.getItem(
          '@privacyPolicyAccepted',
        );
        if (storedPrivacyPolicyAccepted === 'true') {
          setPrivacyPolicyAccepted(true);
        }
      } catch (error) {
        console.error('Error accepting Privacy Policy:', error); // Never seen
      }
    };
    loadPrivacyPolicyAcceptedState();
  }, []);

  // useEffect(() => {
  //   // Check if the Terms of Service has been accepted
  //   if (isTermsOfServiceAccepted) {
  //     // If accepted, scroll to the top of the ScrollView for PrivacyPolicy
  //     scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
  //   }
  // }, [isTermsOfServiceAccepted]);

  useEffect(() => {
    // Check if the Terms of Service has been accepted
    if (isTermsOfServiceAccepted && scrollViewRef.current) {
      // If accepted, scroll to the top of the ScrollView for PrivacyPolicy
      scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
    }
  }, [isTermsOfServiceAccepted, scrollViewRef]);

  // Localization

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [storeId, setStoreId] = useState('');
  const [userInputObject, setUserInputObject] = useState(null);
  const [vat, setVat] = useState('');
  const [loading, setLoading] = useState(false);
  const [emulator, setEmulator] = useState(null);
  // const [softKeysEnabled, setSoftKeysEnabled] = useState(false);
  // const [softKeys, setSoftKeys] = useState(null);
  const [login, setLogin] = useState(true);
  const [registeredEmail, setRegisteredEmail] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const box = useSelector(selectBox);
  const token = useSelector(selectToken);

  // const inputRef = useRef(null);

  const handleChangeUsername = inputText => {
    setUsername(inputText);
  };

  const handleChangePassword = inputText => {
    setPassword(inputText);
  };

  const handleChangeDomain = inputText => {
    setDomain(inputText);
  };

  const handleChangeStoreId = inputText => {
    setStoreId(inputText);
  };

  const handleChangeVat = inputText => {
    setVat(inputText);
  };

  const handleSubmitVat = () => {
    if (vat.length === 9 && /^\d+$/.test(vat)) {
      setRegisteredEmail(true);
      setInfoVat(vat);
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
  const isInputDisabled =
    username === '' ||
    username === null ||
    password === '' ||
    password === null ||
    domain === '' ||
    domain === null ||
    storeId === '' ||
    storeId === null;
  const isPasswordDisabled = password === '' || password === null;
  const isVatDisabled = vat === '' || vat === null;

  const isValidEmail = () => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  // const handleCheckEmail = () => {
  //   const valid = isValidEmail();
  //   if (valid === true) {
  //     email === 'dgrigoriadis@intale.com' ||
  //     email === 'gsakellaropoulos@intale.com'
  //       ? setRegisteredEmail(true)
  //       : setRegisteredEmail(false);
  //     setInfoPrimaryEmail(email);
  //     // fetchVATbyEmail();
  //     setLogin(false);
  //   } else {
  //     Alert.alert(t('warning'), t('validEmail'), [
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           setEmail('');
  //           inputRef.current.clear();
  //         },
  //       },
  //     ]);
  //   }
  // };

  const handleLogin = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      // username: 'intaleadmin',
      // password: '2NJDtm2w#nUh$+Hm',
      // username: 'admin',
      // password:
      //   'AHS1YZXT4mQ8fjpgbpoEd079DIs5KAmSNGTw7diWYhWLzzIh/SzOoF5T6zghQ4x95A==',
      // domain: 'jzois',
      // storeId: 4043,
      username: username,
      password: password,
      domain: domain,
      storeId: storeId,
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
    console.log(data);
    const wordToFind = 'message';
    const regex = new RegExp(`\\b${wordToFind}\\b`, 'i');
    if (regex.test(data)) {
      Alert.alert(t('warning'), t('validCredentials'), [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    } else {
      dispatch(setToken(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    setUserInputObject({
      username: username,
      password: password,
      domain: domain,
      storeId: storeId,
    });
  }, [username, password, domain, storeId]);

  useEffect(() => {
    console.log(userInputObject);
  }, [userInputObject]);

  const isRunningOnEmulator = async () => {
    setEmulator(await DeviceInfo.isEmulator());
  };
  useEffect(() => {
    isRunningOnEmulator();
  }, [emulator]);
  const [isRenderVisible, setIsRenderVisible] = useState(true);

  useEffect(() => {
    // Using it since the language picker rerenders the screen to show the change
    const timeoutId = setTimeout(() => {
      setIsRenderVisible(false);
    }, 100);
    // Cleanup function to clear the timeout if the component unmounts before the delay finishes
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <ImageBackground
      source={require('../images/intale_statistics_home.png')}
      className="flex-1 w-full h-full"
      resizeMode="stretch">
      <SafeAreaView className="flex-1 justify-center items-center">
        {/* RERENDERED SCREEN FOR LANGUAGE CHANGE */}
        {isRenderVisible ? (
          <ScrollView
            ref={scrollViewRef}
            className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              opacity: 0.1,
            }}></ScrollView>
        ) : !isTermsOfServiceAccepted ? (
          <View className="justify-center items-center w-10/12">
            <ScrollView
              ref={scrollViewRef}
              className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
              style={{width: '85%', height: '75%'}}
              onScroll={handleScroll}
              scrollEventThrottle={16}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 10,
                  elevation: 40,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'black',
                    fontWeight: 'bold',
                    marginBottom: 20,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {t('termsOfService')}
                </Text>
                <TouchableOpacity onPress={handlePrivacyPolicyLink}>
                  {/* <Text style={{ fontSize: 16, color: 'blue', marginTop: 10, marginBottom: 20 }}>
                    {t("intaleTermsOfServiceLink")}
                  </Text> */}
                </TouchableOpacity>
                <Text>{t('termsOfServiceContent')}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={acceptButtonStyle}
              onPress={handleTermsOfService}
              disabled={!isScrolledToEnd}
              className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
              <Text style={buttonText}>{t('accept')}</Text>
            </TouchableOpacity>
          </View>
        ) : !isPrivacyPolicyAccepted ? (
          <View className="justify-center items-center w-10/12">
            <ScrollView
              ref={scrollViewRef}
              className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
              style={{width: '85%', height: '75%'}}
              onScroll={handleScroll}
              scrollEventThrottle={16}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 10,
                  elevation: 40,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'black',
                    fontWeight: 'bold',
                    marginBottom: 20,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {t('privacyPolicy')}
                </Text>
                <TouchableOpacity onPress={handlePrivacyPolicyLink}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'blue',
                      marginTop: 10,
                      marginBottom: 20,
                    }}>
                    {t('intalePrivacyPolicyLink')}
                  </Text>
                </TouchableOpacity>
                <Text>{t('privacyPolicyContent')}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={acceptButtonStyle}
              onPress={handlePrivacyPolicy}
              disabled={!isScrolledToEnd}
              className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
              <Text style={buttonText}>{t('accept')}</Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View
            className="w-8/12 justify-center items-center mt-2"
            style={{height: height / 1.33}}>
            <ActivityIndicator color="#00CCBB" size="large" />
          </View>
        ) : !token ? (
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
              onChangeText={handleChangeUsername}
              style={input}
              placeholder="username"
              placeholderTextColor={'white'}
              // keyboardType="email-address"
              clearButtonMode={'always'}
              // ref={inputRef}
            />
            <TextInput
              onChangeText={handleChangePassword}
              style={input}
              placeholder="password"
              placeholderTextColor={'white'}
              keyboardType="visible-password"
              clearButtonMode={'always'}
            />
            <TextInput
              onChangeText={handleChangeDomain}
              style={input}
              placeholder="domain"
              placeholderTextColor={'white'}
              clearButtonMode={'always'}
            />
            <TextInput
              onChangeText={handleChangeStoreId}
              style={input}
              placeholder="store id"
              placeholderTextColor={'white'}
              keyboardType="numeric"
              clearButtonMode={'always'}
            />
            <TouchableOpacity
              style={[isInputDisabled && disabledButton]}
              onPress={handleLogin}
              disabled={isInputDisabled}
              className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
              <Text style={buttonText}>{t('submit')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView className="flex-1 w-full h-full">
            <TouchableOpacity>
              <DrawerHeader />
            </TouchableOpacity>
            <View
              className="justify-center items-center"
              style={{height: height / 1.33}}>
              {/* <TouchableOpacity
                className="bg-emerald-900 my-2 mx-auto p-2 mt-5 rounded-2xl"
                onPress={() => {
                  navigation.navigate('LineChartScreen');
                }}
                style={{ elevation: 20 }}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('goToLineChartScreen')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-cyan-300 mx-auto my-2 p-2 rounded-2xl"
                onPress={() => {
                  navigation.navigate('AuditScreen');
                }}
                style={{ elevation: 20 }}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('goToAuditScreen')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-indigo-300 my-2 mx-auto p-2 rounded-2xl"
                onPress={() => {
                  navigation.navigate('StoreScreen');
                }}
                style={{ elevation: 20 }}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('goToStoreScreen')}
                </Text>
              </TouchableOpacity> */}

              {/* Correctly fetches the VAT (console.log) */}
              {/* <TouchableOpacity
                className="bg-gray-600 justify-center align-center my-2 p-2 rounded-lg"
                onPress={() => fetchVATbyEmail()}>
                <Text className="text-center text-lg text-white">Fetch VAT</Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                className="bg-orange-300 my-2 mx-auto p-2 rounded-2xl"
                onPress={() => {
                  navigation.navigate('ProductSalesScreen');
                }}
                style={{ elevation: 20 }}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('goToProductSalesScreen')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-900 mx-auto my-2 p-2 rounded-2xl"
                onPress={() => {
                  navigation.navigate('SalesTabsScreen');
                }}
                style={{ elevation: 20 }}>
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
                style={{ elevation: 20 }}>
                <Text className="text-center text-xl text-bold text-white">
                  {t('deleteTokenAndLoginAgain')}
                </Text>
              </TouchableOpacity> */}

              {/* Attribute "Freepik" for rounded language flags */}

              <View style={languageStyle.container}>
                <View style={languageStyle.flagContainer}>
                  <TouchableOpacity onPress={togglePicker} activeOpacity={0.7}>
                    <Image
                      style={languageStyle.flag}
                      source={
                        i18n.language === 'el'
                          ? require('../images/greece.png')
                          : require('../images/england.png')
                      }
                    />
                  </TouchableOpacity>
                  <View style={languageStyle.pickerContainer}>
                    <Picker
                      style={languageStyle.picker}
                      selectedValue={selectedLanguage}
                      onValueChange={handleLanguageChange}>
                      <Picker.Item label={t('greek')} value="el" />
                      <Picker.Item label={t('english')} value="en" />
                      {/* <Picker.Item label={t('romanian')} value="ro" /> */}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const acceptButtonStyles = StyleSheet.create({
  buttonEnabled: {
    borderRadius: 6,
    backgroundColor: '#3885E0',
    padding: 10,
    alignItems: 'center',
    opacity: 1,
    marginTop: 20,
  },
  buttonDisabled: {
    borderRadius: 2,
    backgroundColor: 'gray',
    padding: 10,
    alignItems: 'center',
    opacity: 0.8,
    marginTop: 20,
  },
});

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
    position: 'absolute',
    bottom: 50,
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
