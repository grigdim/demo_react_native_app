/* eslint-disable react-hooks/exhaustive-deps */
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
import {useSelector, useDispatch} from 'react-redux';
import {selectBox, selectToken} from '../features/bootstrap';
import {setToken, setStoreId} from '../features/bootstrap';
import {store} from '../store';
import Icon from 'react-native-vector-icons/FontAwesome';
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

const LoginScreen = () => {
  const options = [
    {label: 'Ελληνικά', value: 'el'},
    {label: 'English', value: 'en'},
  ];
  const {setInfoDomain, setInfoStoreId} = useInfo();
  const {t, i18n} = useTranslation();
  const scrollViewRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('el');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isScrolledToEnd, setScrolledToEnd] = useState(false);
  const acceptButtonStyle = isScrolledToEnd
    ? acceptButtonStyles.buttonEnabled
    : acceptButtonStyles.buttonDisabled;

  const loadSelectedLanguage = async () => {
    try {
      const storedSelectedLanguage = await AsyncStorage.getItem(
        '@selectedLanguage',
      );
      console.log('====================================');
      console.log(storedSelectedLanguage);
      console.log('====================================');

      if (storedSelectedLanguage) {
        setSelectedLanguage(storedSelectedLanguage);
        i18n.changeLanguage(storedSelectedLanguage);
        setLanguagePicked(true);
      } else {
        setSelectedLanguage('el');
        i18n.changeLanguage('el');
      }
    } catch (error) {
      console.error('Error loading selected language:', error);
    }
  };

  useEffect(() => {
    loadSelectedLanguage();
  }, []);
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

  useEffect(() => {
    // Check if the Terms of Service has been accepted
    if (isTermsOfServiceAccepted && scrollViewRef.current) {
      // If accepted, scroll to the top of the ScrollView for PrivacyPolicy
      scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
    }
  }, [isTermsOfServiceAccepted, scrollViewRef]);

  // Localization

  const [isLanguagePicked, setLanguagePicked] = useState(false);

  const handleLanguageChange = async (newLanguage = 'el') => {
    console.log('====================================');
    console.log(newLanguage);
    console.log('====================================');
    try {
      await AsyncStorage.setItem('@selectedLanguage', newLanguage);
      setSelectedLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
      setLanguagePicked(true);
    } catch (error) {
      console.error('Error accepting Language Selection:', error);
    }
  };

  const togglePicker = () => {
    setPickerVisible(!isPickerVisible);
  };

  const {height, width} = Dimensions.get('screen');
  const {input, buttonText, disabledButton} = style;
  // const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [storeId, setComponentStoreId] = useState('');
  // const [userInputObject, setUserInputObject] = useState(null);
  const [vat, setVat] = useState('');
  const [loading, setLoading] = useState(false);
  const [emulator, setEmulator] = useState(null);
  // const [softKeysEnabled, setSoftKeysEnabled] = useState(false);
  // const [softKeys, setSoftKeys] = useState(null);
  // const [login, setLogin] = useState(true);
  const [registeredEmail, setRegisteredEmail] = useState(false);

  const dispatch = useDispatch();
  // const navigation = useNavigation();
  // const box = useSelector(selectBox);
  // const token = useSelector(selectToken);

  // const inputRef = useRef(null);

  const handleChangeUsername = async inputText => {
    setUsername(inputText);
  };

  const handleChangePassword = async inputText => {
    setPassword(inputText);
  };

  const handleChangeDomain = async inputText => {
    setDomain(inputText);
    setInfoDomain(inputText);
  };

  const handleChangeStoreId = async inputText => {
    setComponentStoreId(inputText);
    setInfoStoreId(inputText);
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

  // const isEmailDisabled = email === '' || email === null;
  const isInputDisabled =
    username === '' ||
    username === null ||
    password === '' ||
    password === null ||
    domain === '' ||
    domain === null ||
    storeId === '' ||
    storeId === null;
  // const isPasswordDisabled = password === '' || password === null;
  // const isVatDisabled = vat === '' || vat === null;

  // const isValidEmail = () => {
  //   const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  //   return regex.test(email);
  // };

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

  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (
    retrievedUsername,
    retrievedPassword,
    retrievedDomain,
    retrievedStoreId,
  ) => {
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
      username: retrievedUsername,
      password: retrievedPassword,
      domain: retrievedDomain,
      storeId: retrievedStoreId,
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
      dispatch(setStoreId(storeId));
      await AsyncStorage.setItem(
        '@userObject',
        JSON.stringify({
          username: username,
          password: password,
          domain: domain,
          storeId: storeId,
        }),
      );
      setLoggedIn(true);
    }
    setLoading(false);
  };

  const checkLoginStatus = async () => {
    try {
      const retrievedUserString = await AsyncStorage.getItem('@userObject');
      const retrievedUserObject = JSON.parse(retrievedUserString);
      if (
        retrievedUserObject.username !== '' &&
        retrievedUserObject.username !== null
      ) {
        await handleLogin(
          retrievedUserObject.username,
          retrievedUserObject.password,
          retrievedUserObject.domain,
          retrievedUserObject.storeId,
        );
        await AsyncStorage.setItem(
          '@userObject',
          JSON.stringify({
            username: retrievedUserObject.username,
            password: retrievedUserObject.password,
            domain: retrievedUserObject.domain,
            storeId: retrievedUserObject.storeId,
          }),
        );
      } else {
        console.log('no user object');
      }
    } catch (error) {
      // Always a log when the user hasn't logged in, doesn't matter at all.
      // console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

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
        {/* Attribute "Freepik" for rounded language flags */}
        {!isLanguagePicked ? (
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
                </Picker>
              </View>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={languageStyle.languageButton}
                onPress={handleLanguageChange}
                className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
                <Text style={buttonText}>{t('submit')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : !isLanguagePicked ? (
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
                <TouchableOpacity
                  onPress={handlePrivacyPolicyLink}></TouchableOpacity>
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
        ) : !loggedIn ? (
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
              placeholder={t('usernameProvided')}
              placeholderTextColor={'white'}
              // keyboardType="email-address"
              clearButtonMode={'always'}
              // ref={inputRef}
            />
            <TextInput
              onChangeText={handleChangePassword}
              style={input}
              placeholder={t('passwordProvided')}
              // onTextInput="AHS1YZXT4mQ8fjpgbpoEd079DIs5KAmSNGTw7diWYhWLzzIh/SzOoF5T6zghQ4x95A=="
              placeholderTextColor={'white'}
              keyboardType="visible-password"
              clearButtonMode={'always'}
            />
            <TextInput
              onChangeText={handleChangeDomain}
              style={input}
              placeholder={t('domainProvided')}
              placeholderTextColor={'white'}
              clearButtonMode={'always'}
            />
            <TextInput
              onChangeText={handleChangeStoreId}
              style={input}
              placeholder={t('storeIdProvided')}
              placeholderTextColor={'white'}
              keyboardType="numeric"
              clearButtonMode={'always'}
            />
            <TouchableOpacity
              style={[isInputDisabled && disabledButton]}
              onPress={() => {
                handleLogin(username, password, domain, storeId);
              }}
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
              <ScrollView
                ref={scrollViewRef}
                className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
                style={{width: '80%', height: '75%'}}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                <View
                  style={{
                    backgroundColor: 'rgba(0, 180, 243, 0.9)',
                    padding: 20,
                    borderRadius: 10,
                    elevation: 40,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'white',
                      fontWeight: 'bold',
                      marginBottom: 20,
                      marginTop: 10,
                      textAlign: 'center',
                    }}>
                    {t('intaleStatisticsTitle')}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                    }}>
                    {t('intaleStatisticsContent')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'white',
                      fontWeight: 'bold',
                      marginBottom: 20,
                      marginTop: 10,
                      textAlign: 'center',
                    }}>
                    {t('intaleNews')}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                    }}>
                    {t('intaleNews1')}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {t('downloadLatestIntalePoint')}
                    {'   '}
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          'https://play.google.com/store/apps/details?id=ikiosk.com.intale&hl=el&gl=US',
                        )
                      }>
                      <View style={{borderRadius: 24, overflow: 'hidden'}}>
                        <Image
                          source={require('../images/intalePoint.png')}
                          style={{width: 48, height: 48}}
                        />
                      </View>
                    </TouchableOpacity>
                  </Text>
                  {/* AHS1YZXT4mQ8fjpgbpoEd079DIs5KAmSNGTw7diWYhWLzzIh/SzOoF5T6zghQ4x95A== */}
                </View>
              </ScrollView>
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
    zIndex: 1,
    position: 'absolute',
    alignContent: 'center',
    elevation: 30,
  },
  languageButton: {
    position: 'relative',
    alignContent: 'center',
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
