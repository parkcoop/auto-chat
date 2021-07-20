import React, {useContext, useMemo, useState} from 'react';

import moment from 'moment';
import {AuthContext} from '../../context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {login, signup} from '../../api';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';

const Authenticate = ({navigation}) => {
  const dispatch = useContext(AuthContext);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const signIn = async (username, password) => {
    try {
      const authPayload = await login({username, password});
      console.log('LOGGED IN!', authPayload.data);
      const {user, token} = authPayload.data;
      console.log(user, token, ':LL');
      if (token) {
        try {
          console.log('SETTING TOKEN');
          console.log(token, moment().add(14, 'days').unix());
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          await AsyncStorage.setItem(
            'tokenExpiration',
            JSON.stringify(moment().add(14, 'days').unix()),
          );
          console.log('SET TOKENS');
        } catch (err) {
          console.log('error setting token in storage', err);
        }
        console.log('DISPATCHING');

        dispatch({
          type: 'SIGN_IN',
          token,
          user,
        });
      } else {
      }
    } catch (err) {
      console.log('There was an error logging in', err);
      // notify.error('LOGIN', err.message)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>time for a chat</Text>
      <TextInput
        style={styles.input}
        value={username}
        placeholder="Enter username"
        autoCapitalize='none'
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        autoCapitalize='none'
        value={password}
        secureTextEntry
        placeholder="Enter password"
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity
        style={{backgroundColor: '#EEE', padding: 10, marginBottom: 25, borderRadius: 4}}
        onPress={async () => {
          await signIn(username, password);
        }}>
        <Text>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: '#eee', padding: 10, borderRadius: 4}}
        onPress={async () => {
          console.log("???")
          let authPayload = await signup({username, password});
          console.log('lol', authPayload)
          await AsyncStorage.setItem('userToken', authPayload.token);
          await AsyncStorage.setItem('user', JSON.stringify(authPayload.user));

        }}>
        <Text>New user</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Authenticate;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: '10%',
  },
  input: {
    backgroundColor: 'white',
    width: '50%',
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
});
