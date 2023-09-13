/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, CommonActions} from '@react-navigation/native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawer = props => {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  const handleClearLoginStorage = async () => {
    try {
      // Keep language / Terms Of Service / Privacy Policy
      await AsyncStorage.removeItem('@userObject');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Root'}],
        }),
      );
      console.log('AsyncStorage data cleared successfully.');
    } catch (error) {
      console.error('Error clearing AsyncStorage data:', error);
    }
  };

  const logoutAlert = () => {
    Alert.alert(
      t('logoutApp'),
      t('areYouSureLogoutApp'),
      [
        {
          text: t('no'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: t('yes'),
          onPress: handleClearLoginStorage,
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#3885E0'}}>
        <Image
          source={require('../images/intale_statistics.png')}
          style={{
            padding: 20,
            height: 80,
            width: 100,
            marginBottom: 10,
            marginTop: 5,
            marginLeft: 10,
          }}></Image>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 18,
            fontFamily: 'Roboto-Medium',
            marginBottom: 10,
            marginLeft: 15,
          }}>
          {t('intaleStatistics')}
        </Text>
        <View style={{flex: 1, backgroundColor: '#FFFFFF', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: '#217BCC',
          marginLeft: -5,
        }}>
        <TouchableOpacity onPress={logoutAlert} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} color="#217BCC" />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
                color: '#217BCC',
              }}>
              {t('logoutDrawer')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
