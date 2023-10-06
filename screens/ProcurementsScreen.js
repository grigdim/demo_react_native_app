/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import DrawerHeader from './DrawerHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

const ProcurementsScreen = () => {
    const { t, i18n } = useTranslation();

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity>
                <DrawerHeader />
            </TouchableOpacity>
            <View style={{ alignItems: 'center', marginTop: 25 }}>
                <Text> :) </Text>
            </View>
        </View>
    );
}

export default ProcurementsScreen;
