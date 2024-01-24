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
  // Modal,
  // TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useState, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
// import {selectBox, selectToken} from '../features/bootstrap';
import {setToken, setStoreId, setStrId} from '../features/bootstrap';
// import {store} from '../store';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
// import DeviceInfo from 'react-native-device-info';
import {ScrollView} from 'react-native-gesture-handler';
// import DrawerHeader from './DrawerHeader';
import {useTranslation} from 'react-i18next';
// import SwitchSelector from 'react-native-switch-selector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useInfo} from '../components/PersonalInfoTaken';
// import TabsScreen from './TabsScreen';
// import {ip} from '@env';
import SelectDropdown from 'react-native-select-dropdown';
// import axios from 'axios';

const LoginScreen = () => {
  const [innerToken, setInnerToken] = useState();
  // const options = [
  //   {label: 'Ελληνικά', value: 'el'},
  //   {label: 'English', value: 'en'},
  // ];
  const {setInfoDomain, setInfoStoreId} = useInfo();
  const {t, i18n} = useTranslation();
  const scrollViewRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isScrolledToEnd, setScrolledToEnd] = useState(false);
  const acceptButtonStyle = isScrolledToEnd
    ? acceptButtonStyles.buttonEnabled
    : acceptButtonStyles.buttonDisabled;
  const [isPrivacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [isTermsOfServiceAccepted, setTermsOfServiceAccepted] = useState(false);
  const [isLanguagePicked, setLanguagePicked] = useState(false);
  const {height} = Dimensions.get('screen');
  const {input, buttonText, disabledButton} = style;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [userStoreData, setUserStoreData] = useState([]);
  const [userStoreData2, setUserStoreData2] = useState([]);
  const [storesArray, setStoresArray] = useState([]);
  const [storesToDisplay, setStoresToDisplay] = useState([]);
  const [
    storesArrayWithMasterIdAndStoreLocalId,
    setStoresArrayWithMasterIdAndStoreLocalId,
  ] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isInputDisabled =
    username === '' ||
    username === null ||
    password === '' ||
    password === null ||
    domain === '' ||
    domain === null;
  const [loggedIn, setLoggedIn] = useState(false);

  const loadSelectedLanguage = async () => {
    try {
      const storedSelectedLanguage = await AsyncStorage.getItem(
        '@selectedLanguage',
      );
      const languageConfirmed = await AsyncStorage.getItem(
        '@languageConfirmed',
      );

      if (storedSelectedLanguage !== null) {
        setSelectedLanguage(storedSelectedLanguage);
        i18n.changeLanguage(storedSelectedLanguage);
        languageConfirmed === 'true'
          ? setLanguagePicked(true)
          : setLanguagePicked(false);
      } else {
        await AsyncStorage.setItem('@selectedLanguage', 'el');
        setSelectedLanguage('el');
        i18n.changeLanguage('el');
      }
    } catch (error) {
      console.error('Error loading selected language:', error);
    }
  };

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

  const handleTermsOfService = async () => {
    setTermsOfServiceAccepted(true);
    try {
      await AsyncStorage.setItem('@termsOfServiceAccepted', 'true');
    } catch (error) {
      console.error('Error accepting Terms of Service:', error); // Never seen
    }
  };

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

  const handleLanguageChange = async lang => {
    try {
      await AsyncStorage.setItem('@selectedLanguage', lang);
      setSelectedLanguage(lang);
      i18n.changeLanguage(lang);
      //   setLanguagePicked(true);
    } catch (error) {
      console.error('Error accepting Language Selection:', error);
    }
  };

  const handleConfirmLanguage = async () => {
    try {
      await AsyncStorage.setItem('@languageConfirmed', 'true');
    } catch (error) {
      console.log(error);
    }
    setLanguagePicked(true);
  };

  const togglePicker = () => {
    setPickerVisible(!isPickerVisible);
  };

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

  const checkLoginStatus = async () => {
    try {
      const retrievedUserString = await AsyncStorage.getItem('@userObject');
      const retrievedUserObject = JSON.parse(retrievedUserString);
      if (
        retrievedUserObject.username !== '' &&
        retrievedUserObject.username !== null
      ) {
        setDomain(retrievedUserObject.domain);
        await handleLogin(
          retrievedUserObject.username,
          retrievedUserObject.password,
          retrievedUserObject.domain,
        );
        await AsyncStorage.setItem(
          '@userObject',
          JSON.stringify({
            username: retrievedUserObject.username,
            password: retrievedUserObject.password,
            domain: retrievedUserObject.domain,
          }),
        );
      } else {
        console.log('no user object');
      }
    } catch (error) {
      // Always a log when the user hasn't logged in, doesn't matter at all.
      console.error('Error checking login status:', error);
    }
  };

  const handleLogin = async (inputUsername, inputPassword, inputDomain) => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      username: inputUsername,
      password: inputPassword,
      domain: inputDomain,
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    const response = await fetch(
      // 'https://bo-api-gr.intalepoint.com/bo/account/authenticate',
      // `https://${inputDomain}.intalepoint.com/bo/account/authenticatewithoutstoreid`,
      'https://bo-api-gr.intalepoint.com/bo/account/authenticatewithoutstoreid',
      // `http://${ip}:4000/bo/account/authenticatewithoutstoreid`,
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
      setInnerToken(data);
      dispatch(setToken(data));
      await AsyncStorage.setItem(
        '@userObject',
        JSON.stringify({
          username: username,
          password: password,
          domain: domain,
        }),
      );
      setLoggedIn(true);
    }
    setLoading(false);
  };

  const getUserIdFromToken = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Token', innerToken);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    const data = await fetch(
      // `https://${domain}.intalepoint.com/bo/account/GetUserIdFromToken`,
      'https://bo-api-gr.intalepoint.com/bo/account/GetUserIdFromToken',
      requestOptions,
    );
    const userIdFromToken = await data.text();
    // console.log(userIdFromToken);
    setUserId(userIdFromToken);
  };

  const getUserStoreData = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Token', innerToken);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    const response = await fetch(
      `https://bo-api-gr.intalepoint.com/bo/Stores?$filter=Str_Active eq true and Str_Visible eq true&$expand=StoreUsers($filter=Stu_UserID eq ${userId})`,
      requestOptions,
    );
    const data = await response.json();
    // console.log('userStoreData1', data.value);
    setUserStoreData(data.value);
  };

  const getUserStoreData2 = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Token', innerToken);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    const response = await fetch(
      `https://bo-api-gr.intalepoint.com/bo/account/GetUserStoreData/?userId=${userId}`,
      requestOptions,
    );
    const data = await response.json();
    // console.log('userStoreData2', data);
    setUserStoreData2(data);
  };

  const getStoreIDs = async () => {
    let array = [];
    try {
      const fetchPromises = userStoreData.map(async item => {
        const storeIp = item.Str_Code.replace('ip', '');

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };

        const response = await fetch(
          `https://schemas.dev.cb.intalepoint.com/api/v1/schemas/intalecustomers/universalstore/${storeIp}/intaleInfo`,
          requestOptions,
        );

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const result = await response.json();
        // console.log(result);
        array.push({
          ArRetailPointId: result.ArRetailPointId,
          StoreLocalId: result.StoreLocalId,
          MasterId: result.MasterId,
        });
      });

      await Promise.all(fetchPromises);
      // Continue with any additional logic after all requests are complete
    } catch (error) {
      console.error('Error during fetch:', error);
      // Handle the error as needed
    }
    // console.log(array);
    setStoresArrayWithMasterIdAndStoreLocalId(array);
  };

  useEffect(() => {
    loadSelectedLanguage();
  }, []);

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

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    getUserIdFromToken();
  }, [innerToken]);

  useEffect(() => {
    getUserStoreData();
    getUserStoreData2();
  }, [userId]);

  useEffect(() => {
    userStoreData.length > 0 && getStoreIDs();
  }, [userStoreData]);

  useEffect(() => {
    let array = [];
    userStoreData2.map(item => {
      storesArrayWithMasterIdAndStoreLocalId.filter(entry => {
        if (entry.MasterId === item.StoreId) {
          array.push({CompanyDescription: item.CompanyDescription, ...entry});
        }
      });
    });
    setStoresArray(array);
  }, [storesArrayWithMasterIdAndStoreLocalId]);

  useEffect(() => {
    setLoading(true);
    let array = storesArray.map(item => item.CompanyDescription);
    setStoresToDisplay(array);
    setLoading(false);
  }, [storesArray]);

  const renderLanguagePicker = () => (
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
            onValueChange={newValue => {
              handleLanguageChange(newValue);
            }}>
            <Picker.Item label={t('greek')} value="el" />
            <Picker.Item label={t('english')} value="en" />
          </Picker>
        </View>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          style={languageStyle.languageButton}
          onPress={() => {
            handleConfirmLanguage(selectedLanguage);
          }}
          className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
          <Text style={buttonText}>{t('submit')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTermsOfService = () => (
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
            <Text
              style={{
                fontSize: 15,
                color: 'black',
                fontWeight: '400',
                marginBottom: 20,
                marginTop: 10,
                textAlign: 'center',
              }}>
              {t('termsOfServiceContent')}
            </Text>
          </Text>
          <TouchableOpacity
            onPress={handlePrivacyPolicyLink}></TouchableOpacity>
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
  );

  const renderPrivacyPolicy = () => (
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
                textAlign: 'center',
              }}>
              {t('intalePrivacyPolicyLink')}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: 'black',
                fontWeight: '400',
                marginBottom: 20,
                marginTop: 10,
                textAlign: 'center',
              }}>
              {t('privacyPolicyContent')}
            </Text>
          </TouchableOpacity>
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
  );

  const renderLogin = () => (
    <View
      className="justify-center items-center space-y-6 w-10/12 rounded-lg py-10"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}>
      <View className="items-center">
        <Icon name="user" size={75} color="white" />
        <Text className="text-white text-3xl">
          {t('helloIntalerLoginScreen')}
        </Text>
      </View>
      <TextInput
        onChangeText={handleChangeUsername}
        style={input}
        placeholder={t('usernameProvided')}
        placeholderTextColor={'white'}
        clearButtonMode={'always'}
      />
      <TextInput
        onChangeText={handleChangePassword}
        style={input}
        placeholder={t('passwordProvided')}
        placeholderTextColor={'white'}
        clearButtonMode={'always'}
        secureTextEntry={true}
      />
      <TextInput
        onChangeText={handleChangeDomain}
        style={input}
        placeholder={t('domainProvided')}
        placeholderTextColor={'white'}
        clearButtonMode={'always'}
      />
      <TouchableOpacity
        style={[isInputDisabled && disabledButton]}
        onPress={() => {
          handleLogin(username, password, domain);
        }}
        disabled={isInputDisabled}
        className="rounded-2xl bg-blue-500 justify-center items-center w-2/5 h-10">
        <Text style={buttonText}>{t('submit')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStorePicker = () =>
    !storesToDisplay.length > 0 ? (
      <ActivityIndicator color="#00CCBB" size="large" />
    ) : (
      <View>
        <SelectDropdown
          dropdownStyle={{
            backgroundColor: 'lightgray',
          }}
          data={storesToDisplay}
          onSelect={selectedItem => {
            const device = storesArray.filter(
              item => item.CompanyDescription === selectedItem,
            )[0];
            dispatch(setStoreId(parseInt(device.MasterId, 10)));
            dispatch(setStrId(parseInt(device.StoreLocalId, 10)));
            navigation.navigate(t('statistics'));
          }}
          buttonTextAfterSelection={selectedItem => {
            return selectedItem;
          }}
          rowTextForSelection={item => {
            return item;
          }}
          buttonStyle={{
            backgroundColor: 'rgb(36, 48, 61)',
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'rgb(0, 182, 240)',
            width: '75%',
          }}
          buttonTextStyle={{color: 'rgb(0, 182, 240)'}}
          defaultButtonText="Select a store to proceed"
        />
      </View>
    );

  return (
    <ImageBackground
      source={require('../images/intale_statistics_home.png')}
      className="flex-1 w-full h-full"
      resizeMode="stretch">
      <SafeAreaView className="flex-1 justify-center items-center">
        {!isLanguagePicked ? (
          renderLanguagePicker()
        ) : !isTermsOfServiceAccepted ? (
          renderTermsOfService()
        ) : !isPrivacyPolicyAccepted ? (
          renderPrivacyPolicy()
        ) : loading ? (
          <View
            className="w-8/12 justify-center items-center mt-2"
            style={{height: height / 1.33}}>
            <ActivityIndicator color="#00CCBB" size="large" />
          </View>
        ) : !loggedIn ? (
          renderLogin()
        ) : (
          renderStorePicker()
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

// const isRunningOnEmulator = async () => {
//   setEmulator(await DeviceInfo.isEmulator());
// };
// useEffect(() => {
//   isRunningOnEmulator();
// }, [emulator]);
// const [isRenderVisible, setIsRenderVisible] = useState(true);

// useEffect(() => {
//   // Using it since the language picker rerenders the screen to show the change
//   const timeoutId = setTimeout(() => {
//     setIsRenderVisible(false);
//   }, 100);
//   // Cleanup function to clear the timeout if the component unmounts before the delay finishes
//   return () => clearTimeout(timeoutId);
// }, []);
// const handleChangeStoreId = async inputText => {
//   setComponentStoreId(inputText);
//   setInfoStoreId(inputText);
// };
// const handleChangeVat = inputText => {
//   setVat(inputText);
// };
// const handleSubmitVat = () => {
//   if (vat.length === 9 && /^\d+$/.test(vat)) {
//     setRegisteredEmail(true);
//   } else {
//     Alert.alert(t('warning'), t('validVatNumber'), [
//       {
//         text: 'OK',
//         onPress: () => {
//           setVat('');
//         },
//       },
//     ]);
//   }
// };
//   <ScrollView className="flex-1 w-full h-full">
//     <TouchableOpacity>
//       <DrawerHeader />
//     </TouchableOpacity>
//     <View
//       className="justify-center items-center"
//       style={{height: height / 1.33}}>
//       <ScrollView
//         ref={scrollViewRef}
//         className="grow-0 divide-y-2 divide-cyan-400 rounded-2xl"
//         style={{width: '80%', height: '75%'}}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}>
//         <View
//           style={{
//             backgroundColor: 'rgba(0, 180, 243, 0.9)',
//             padding: 20,
//             borderRadius: 10,
//             elevation: 40,
//           }}>
//           <Text
//             style={{
//               fontSize: 20,
//               color: 'white',
//               fontWeight: 'bold',
//               marginBottom: 20,
//               marginTop: 10,
//               textAlign: 'center',
//             }}>
//             {t('intaleStatisticsTitle')}
//           </Text>
//           <Text
//             style={{
//               color: 'white',
//             }}>
//             {t('intaleStatisticsContent')}
//           </Text>
//           <Text
//             style={{
//               fontSize: 20,
//               color: 'white',
//               fontWeight: 'bold',
//               marginBottom: 20,
//               marginTop: 10,
//               textAlign: 'center',
//             }}>
//             {t('intaleNews')}
//           </Text>
//           <Text
//             style={{
//               color: 'white',
//             }}>
//             {t('intaleNews1')}
//           </Text>
//           <Text
//             style={{
//               color: 'white',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             {t('downloadLatestIntalePoint')}
//             {'   '}
//             <TouchableOpacity
//               onPress={() =>
//                 Linking.openURL(
//                   'https://play.google.com/store/apps/details?id=ikiosk.com.intale&hl=el&gl=US',
//                 )
//               }>
//               <View style={{borderRadius: 24, overflow: 'hidden'}}>
//                 <Image
//                   source={require('../images/intalePoint.png')}
//                   style={{width: 48, height: 48}}
//                 />
//               </View>
//             </TouchableOpacity>
//           </Text>
//         </View>
//       </ScrollView>
//     </View>
//   </ScrollView>
// );
