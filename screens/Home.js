/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Zeroconf from 'react-native-zeroconf';
// import io from 'socket.io-client';
// import {WebView} from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {setBox} from '../features/bootstrap';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [discoveredServices, setDiscoveredServices] = useState(null);
  //   const [showWebView, setShowWebView] = useState(false);
  const [deviceUID, setDeviceUID] = useState(null);
  const [devicePlatform, setDevicePlatform] = useState(null);
  const [netInfo, setNetInfo] = useState({});
  const [version, setVersion] = useState(null);
  const [deviceManufacturer, setDeviceManufacturer] = useState(null);
  const [deviceModel, setDeviceModel] = useState(null);
  const [deviceVersion, setDeviceVersion] = useState(null);
  const [socket, setSocket] = useState(null);
  const data = {
    addresses: ['192.168.1.40'],
    fullName: '192.168.1.40._ikiosk._tcp',
    host: '192.168.1.40',
    name: 'ikiosk_6f5bc37-6f5bc3',
    port: 8080,
    txt: {
      KEY: '00000-0000-00000',
      UID: '6f5bc37b7018f550929f2341f0065ecf',
      device_name: 'chainstore2-pi3',
      name: 'b8:27:eb:08:37:16',
    },
  };

  useEffect(() => {
    const zeroconf = new Zeroconf();

    const startZeroconfScan = async () => {
      setDeviceUID(await DeviceInfo.getUniqueId());
      setNetInfo(await NetInfo.fetch());
      setDevicePlatform(DeviceInfo.getSystemName);
      setVersion(DeviceInfo.getVersion());
      setDeviceManufacturer(await DeviceInfo.getManufacturer());
      setDeviceModel(DeviceInfo.getModel());
      setDeviceVersion(DeviceInfo.getSystemVersion());

      zeroconf.on('start', () => console.log('Zeroconf scan started.'));
      zeroconf.on('found', service => {
        // console.log('Service found:', service);
      });
      zeroconf.on('resolved', service => {
        setDiscoveredServices(prevServices => {
          // Check if the service already exists in the state
          const serviceExists = prevServices.some(
            existingService => existingService.name === service.name,
          );

          // If the service doesn't exist, add it to the state
          if (!serviceExists) {
            return [...prevServices, service];
          }

          return prevServices; // Service already exists, return the previous state
        });
      });
      zeroconf.on('remove', service =>
        console.log('Service removed:', service),
      );
      zeroconf.on('error', error => console.log('Zeroconf error:', error));

      zeroconf.scan('ikiosk', 'tcp', 'local.');
    };

    startZeroconfScan();

    return () => {
      zeroconf.stop();
      zeroconf.removeAllListeners();
    };
  }, []);

  const setBoxAndRedirect = async box => {
    dispatch(setBox(box));
    navigation.navigate('LoginScreen');
  };

  return (
    <SafeAreaView className="flex-1 flex-column justify-evenly items-center">
      <View className="bg-gray-400">
        <Text className="text-black p-3 underline m-3 text-3xl">
          Discovered Services:
        </Text>
      </View>
      {discoveredServices ? (
        <ScrollView className="grow-1">
          {discoveredServices.map((service, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => setBoxAndRedirect(service)}
                //   onPress={() => this.createServerConnection(service.host)}

                className="my-1.5 px-2.5 py-1.5 bg-gray-400">
                <Text
                  style={{
                    color: 'black',
                    paddingVertical: 5,
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                    fontSize: 16,
                  }}>
                  Device Name: {service.txt.device_name || service.txt.name}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    paddingVertical: 5,
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                    fontSize: 16,
                  }}>
                  Mac Address: {service.txt.name}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    paddingVertical: 5,
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                    fontSize: 16,
                  }}>
                  Host: {service.host}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View>
          <TouchableOpacity
            className="my-1.5 px-2.5 py-1.5 bg-gray-400"
            onPress={() => setBoxAndRedirect(data)}>
            <Text>Host Name: {data.fullName}</Text>
            <Text>MacAddress: {data.txt.name}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
