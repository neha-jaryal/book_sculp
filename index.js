/**
 * @format
 */

// Initialize Firebase FIRST — before ANYTHING else runs
import './Sources/Utility/Firebase';  // ← This MUST be the VERY FIRST line

import { AppRegistry } from 'react-native';
import App from './App';  // If App.js is in root — keep this
// If App.js is inside Sources/, change to:
// import App from './Sources/App';

import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);