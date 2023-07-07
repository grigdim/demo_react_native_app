import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DrawerHeader = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            className="bg-blue-900 p-3 flex-row space-x-2 justify-center items-center"
            onPress={() => navigation.openDrawer()}>
            <Text className="text-center text-s text-bold text-white">
                Intale Statistics
            </Text>
            <FontAwesome
                name="bars"
                size={10}
                color="rgb(255 255 255)"
            ></FontAwesome>
        </TouchableOpacity>
    );
};

export default DrawerHeader;
