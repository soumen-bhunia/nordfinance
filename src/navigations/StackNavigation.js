import React from 'react';
import Home from '../screen/Home';
import {createStackNavigator} from '@react-navigation/stack';

export default function StackNavigation() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
