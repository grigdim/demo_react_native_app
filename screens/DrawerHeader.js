import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

const DrawerHeader = () => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();

    return (
        <TouchableOpacity
            style={{ backgroundColor: '#207ff0' }}
            className="bg-blue-900 p-3 flex-row space-x-2 justify-center items-center"
            onPress={() => navigation.openDrawer()}>
            <Text className="text-center text-m text-bold text-white">
                {t("intaleStatistics")}
            </Text>
            <FontAwesome
                name="bars"
                size={13}
                color="rgb(255 255 255)"
            ></FontAwesome>
        </TouchableOpacity>
    );
};

export default DrawerHeader;
