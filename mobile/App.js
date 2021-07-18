/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import type {Node} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signup } from './src/api';



const Dashboard = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [room, setRoom] = useState('')

  useEffect(() => {
    signup({username: "LOL", password: "LOL"}).then(res => console.log(res))

    (async() => {
      try {
        const currentUsername = await AsyncStorage.getItem('username')
        if (currentUsername) {
          console.log(currentUsername)
          setUsername(currentUsername)
          setLoggedIn(true)
        }
      } catch(err) {
        console.log("Error getting username", err)
      }

    })()
  }, [])

  const login = () => {
    (async() => {
      try {
        await AsyncStorage.setItem('username', username)
      } catch(err) {
        console.log('Error setting username in asyncstorage', err)
      }
    })()
    setLoggedIn(true)
  }

  if (loggedIn) {
    return (<View style={{paddingTop: 100, marginTop: 100}}><Text>Welcome, {username}</Text></View>)
  }

  else {
    return (
      <SafeAreaView style={styles.container}>
         <Text style={styles.text}>Join room</Text>
         <TextInput 
           style={styles.input} 
           value={username}
           placeholder="Enter username"
           onChangeText={(text) => setUsername(text)}
         />
         <TextInput 
           style={styles.input} 
           value={room}
           placeholder="Enter room ID"
           onChangeText={(text) => setRoom(text)}
         />
         <TouchableOpacity
           style={{backgroundColor: '#CDCDCD', color: 'white', padding: 10}}
           onPress={() => login()}
         >
           <Text>
             Enter room
           </Text>
         </TouchableOpacity>
      </SafeAreaView>
     );
  }
};

const Room = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Text>OMG</Text>
    </SafeAreaView>
  )
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: Dashboard,
  },
  Room: {
    screen: Room
  }
});

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {backgroundColor: '#333', height: '100%', width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {color: 'white', fontSize: 25, textAlign: 'center', marginBottom: '10%'},
  input: { backgroundColor: 'white', width: '50%', padding: 10, borderRadius: 2, marginBottom: 20 },
});

