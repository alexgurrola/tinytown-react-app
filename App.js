/**
 * @format
 * @flow strict-local
 */

import { typography, colors } from './frontend/styles'
import React from 'react';
import {
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native';

import Splash from './frontend/splash';
// import Map from './frontend/mapbox';

const App = () =>
  <>
    <StatusBar barStyle='dark-content' />
    <SafeAreaView>
      <Text style={styles.test}>This is a piece of text</Text>
      <Splash></Splash>
      {/* <Map></Map> */}
    </SafeAreaView>
  </>
;

const styles = StyleSheet.create({
  test: {
    backgroundColor: '#FE4963',
    color: colors.asphaltGray,
    ...typography.button,
  },
});

export default App;
