/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import DrawerHeader from './DrawerHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';
import {TextSize} from 'victory-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageScreen = () => {
  const {t, i18n} = useTranslation();
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const {height, width} = Dimensions.get('screen');
  const {input, buttonText, disabledButton} = style;

  useEffect(() => {
    const storedLanguage = async () => {
      try {
        const storedSelectedLanguage = await AsyncStorage.getItem(
          '@selectedLanguage',
        );

        setSelectedLanguage(storedSelectedLanguage);
      } catch (error) {}
    };
    setSelectedLanguage(storedLanguage);
  }, []);

  const handleLanguageChange = async newLanguage => {
    console.log('type of new language is', typeof newLanguage);
    await AsyncStorage.setItem('@selectedLanguage', newLanguage);
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const togglePicker = () => {
    setPickerVisible(!isPickerVisible);
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity>
        <DrawerHeader />
      </TouchableOpacity>
      <View className="flex-1 justify-center items-center">
        <View style={languageStyle.container}>
          <View className="justify-center items-center py-3">
            <Text style={{fontSize: 16, color: 'black'}}>
              {t('chooseLanguageTitle')}
            </Text>
          </View>
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
        </View>
      </View>
    </View>
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
    zIndex: 1,
    position: 'absolute',
    alignContent: 'center',
    elevation: 60,
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

export default LanguageScreen;
