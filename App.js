/**
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

// import Splash from './frontend/splash';
import Map from './src/screens/mapbox';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
      <View>
        {/* <Splash></Splash>*/}
        <Map></Map>
      </View>
  );
};

export default App;
