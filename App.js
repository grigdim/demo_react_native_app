/* eslint-disable react-native/no-inline-styles */

import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Zeroconf from 'react-native-zeroconf';
import io from 'socket.io-client';
import {WebView} from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

class App extends Component {
  constructor(props) {
    super(props);

    this.zeroconf = new Zeroconf();
    this.state = {
      discoveredServices: [],
      showWebView: false,
      deviceUID: null,
      devicePlatform: null,
      netInfo: {},
      version: null,
      deviceManufacturer: null,
      deviceModel: null,
      deviceVersion: null,
      socket: null,
    };
  }
  openInAppBrowser = () => {
    this.setState({showWebView: true});
  };
  closeInAppBrowser = () => {
    this.setState({showWebView: false});
  };

  startsWithNumber = str => {
    return /^\d/.test(str);
  };

  createServerConnection = async host => {
    if (this.socket !== undefined && this.socket !== null) {
      console.log('Disconnecting from server ', this.socket.io.opts.hostname);
      await this.socket.disconnect();
      this.socket = null;
    }
    if (this.startsWithNumber(host)) {
      console.log('Connecting to server', host);
      this.socket = await io(`http://${host}:8080`, {
        transports: ['websocket'],
        reconnection: false,
        upgrade: false,
      });
      this.socket.on('connect', () => {
        console.log('Socket connected to ', host);
      });
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected from ', host);
      });
      this.socket.on('message', data => {
        console.log('Message received', data);
      });
      this.socket.on('connect_error', error =>
        console.log('Socket error:', error),
      );
    }
  };

  async componentDidMount() {
    this.deviceUID = await DeviceInfo.getUniqueId();
    this.netInfo = await NetInfo.fetch();
    this.devicePlatform = DeviceInfo.getSystemName();
    this.version = DeviceInfo.getVersion();
    this.deviceManufacturer = await DeviceInfo.getManufacturer();
    this.deviceModel = DeviceInfo.getModel();
    this.deviceVersion = DeviceInfo.getSystemVersion();
    this.zeroconf.on('start', () => console.log('Zeroconf scan started.'));
    this.zeroconf.on('found', service => {
      //   console.log('Service found:', service);
    });
    this.zeroconf.on('resolved', service => {
      // console.log('Service resolved:', service);

      this.setState(prevState => ({
        discoveredServices: [...prevState.discoveredServices, service],
      }));
    });
    this.zeroconf.on(
      'remove',
      service => console.log('Service removed:', service),
      // console.log(this.zeroconf.getServices()),
    );
    this.zeroconf.on('error', error => console.log('Zeroconf error:', error));

    // Start the zeroconf scan
    this.zeroconf.scan('ikiosk', 'tcp', 'local.');
  }

  componentWillUnmount() {
    // Stop the zeroconf scan and clean up listeners
    this.zeroconf.stop();
    this.zeroconf.removeAllListeners();
  }

  render() {
    const {discoveredServices} = this.state;
    const {socket} = this.state;
    // if (this.state.showWebView) {
    //   return (
    //     <View style={{flex: 1}}>
    //       <WebView
    //         source={{
    //           uri: '192.168.1.46/br/index.php?lang=el_GR&socketNsp=9641a2b6ccfb7629',
    //         }}
    //         javaScriptEnabled={true}
    //         domStorageEnabled={true}
    //         clearCache={true}
    //       />
    //       {/* 'http://' + url + '/br/index.php?lang=' + app.current_language + '&socketNsp=' + authApp.deviceUID) */}
    //       <TouchableOpacity
    //         onPress={this.closeInAppBrowser}
    //         style={{
    //           position: 'absolute',
    //           top: 20,
    //           right: 20,
    //           backgroundColor: 'rgba(0, 0, 0, 0.7)',
    //           padding: 10,
    //         }}>
    //         <Text style={{color: 'white', fontSize: 18}}>Close</Text>
    //       </TouchableOpacity>
    //     </View>
    //   );
    // }

    return (
      <SafeAreaView
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 24,
            margin: 20,
            backgroundColor: 'lightgray',
            color: 'black',
            padding: 20,
            textDecorationLine: 'underline',
          }}>
          Discovered Services:
        </Text>
        <ScrollView>
          {discoveredServices.map((service, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => this.createServerConnection(service.host)}
                style={{
                  marginVertical: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor:
                    service.txt.device_name === 'Xera-analyst' ||
                    service.txt.name === 'Xera_analyst'
                      ? 'green'
                      : 'lightgray',
                }}>
                <Text
                  style={{
                    color:
                      service.txt.device_name === 'Xera-analyst' ||
                      service.txt.name === 'Xera_analyst'
                        ? 'white'
                        : 'black',
                    paddingVertical: 5,
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                    fontSize: 16,
                  }}>
                  Device Name: {service.txt.device_name || service.txt.name}
                </Text>
                <Text
                  style={{
                    color:
                      service.txt.device_name === 'Xera-analyst' ||
                      service.txt.name === 'Xera_analyst'
                        ? 'white'
                        : 'black',
                    paddingVertical: 5,
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                    fontSize: 16,
                  }}>
                  Mac Address: {service.txt.name}
                </Text>
                <Text
                  style={{
                    color:
                      service.txt.device_name === 'Xera-analyst' ||
                      service.txt.name === 'Xera_analyst'
                        ? 'white'
                        : 'black',
                    paddingVertical: 5,
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                    fontSize: 16,
                  }}>
                  Host: {service.host}
                </Text>
              </TouchableOpacity>

              {this.socket && this.socket.io.opts.hostname === service.host ? (
                <TouchableOpacity
                  style={{margin: 10}}
                  onPress={() => {
                    this.socket.emit('message', 'hello world');
                  }}>
                  <Text>Emit message</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </ScrollView>

        {/*  <TouchableOpacity
          onPress={this.openInAppBrowser}
          style={{marginTop: 20}}>
          <Text style={{fontSize: 18}}>Open YouTube</Text>
        </TouchableOpacity>*/}
      </SafeAreaView>
    );
  }
}

export default App;
