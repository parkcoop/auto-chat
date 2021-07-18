import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Dashboard from '../screens/Dashboard';


const AppNavigator = createStackNavigator({
  Dashboard: {
    screen: Dashboard,
  },
});

const AppRouter = createAppContainer(AppNavigator)

export default AppRouter