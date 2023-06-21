/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { setBox } from '../features/bootstrap';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [discoveredServices, setDiscoveredServices] = useState([]);
  //   const [showWebView, setShowWebView] = useState(false);
  const [deviceUID, setDeviceUID] = useState(null);
  const [devicePlatform, setDevicePlatform] = useState(null);
  const [netInfo, setNetInfo] = useState({});
  const [version, setVersion] = useState(null);
  const [deviceManufacturer, setDeviceManufacturer] = useState(null);
  const [deviceModel, setDeviceModel] = useState(null);
  const [deviceVersion, setDeviceVersion] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isResolutionComplete, setIsResolutionComplete] = useState(false);
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
        setIsResolutionComplete(true);
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

  useEffect(() => {
    console.log(isResolutionComplete);
  }, [isResolutionComplete]);

  const setBoxAndRedirect = async box => {
    dispatch(setBox(box));
    navigation.navigate('LoginScreen');
  };

  return (
    <SafeAreaView className="flex-1 flex-column justify-center items-center bg-gray-100">
      <View className="bg-gray-200 my-5 rounded-2xl" style={{ elevation: 50 }}>
        <Text className="text-black p-5 underline text-4xl text-center">
          Discovered Services:
        </Text>
      </View>
      {discoveredServices !== null && discoveredServices.length !== 0 ? (
        <ScrollView className="mb-5">
          {discoveredServices.map((service, index) => (
            <View
              key={index}
              className="m-2 py-1.5 px-2 bg-gray-200 justify-center rounded-2xl"
              style={{ elevation: 10 }}>
              <TouchableOpacity onPress={() => setBoxAndRedirect(service)}>
                <Text
                  className="text-white text-lg text-center font-extrabold"
                  style={{ textShadowColor: 'black', textShadowRadius: 25 }}>
                  {index + 1}
                </Text>
                <Text
                  className="text-black py-1 text-center text-base underline"
                  style={{}}>
                  Device Name: {service.txt.device_name || service.txt.name}
                </Text>
                <Text
                  className="text-black py-1 text-center text-base underline"
                  style={{}}>
                  Mac Address: {service.txt.name}
                </Text>
                <Text
                  className="text-black py-1 text-center text-base underline"
                  style={{}}>
                  Host: {service.host}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        (
          <View
            style={{ elevation: 50 }}
            className="my-1.5 px-4 py-2 bg-gray-200 rounded-2xl">
            <TouchableOpacity onPress={() => setBoxAndRedirect(data)}>
              <Text className="text-black py-1 underline text-base">
                Host Name: {data.fullName}
              </Text>
              <Text className="text-black py-1 underline text-base">
                MacAddress: {data.txt.name}
              </Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </SafeAreaView>
  );
};

export default Home;
