import React from 'react';
import Navigation from './src/navigations/Navigation';
import {LogBox} from 'react-native';

export default function App() {
  LogBox.ignoreAllLogs(true);
  return <Navigation />;
}
