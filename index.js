/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App.tsx';
import App from './App.js';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
 
AppRegistry.registerComponent(appName, () => App);
