import { AppRegistry, Text } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import AppNavigator from './app/navigator/AppNavigator';
import bgActions from './app/bgMessaging';

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgActions);
AppRegistry.registerComponent(appName, () => AppNavigator);
//AppNavigator
console.disableYellowBox = true;

// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;