import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

import CameraScreen from '../screens/CameraScreen';
import ResultsScreen from '../screens/ResultsScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Camera"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
        }}>
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            cardStyle: { backgroundColor: '#fff' },
          }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{
            cardStyle: { backgroundColor: '#fff' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
