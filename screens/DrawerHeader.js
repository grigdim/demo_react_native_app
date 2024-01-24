import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';

const DrawerHeader = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <TouchableOpacity
      // eslint-disable-next-line react-native/no-inline-styles
      style={{backgroundColor: '#207ff0'}}
      className="bg-blue-900 p-3 flex-row space-x-2 justify-center items-center"
      onPress={() => navigation.openDrawer()}>
      <Text className="text-center text-lg text-bold text-white">
        {t('Menu')}
      </Text>
      <FontAwesome name="bars" size={20} color="rgb(255 255 255)" />
    </TouchableOpacity>
  );
};

export default DrawerHeader;
