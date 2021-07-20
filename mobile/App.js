
import React, { useState, useEffect, useReducer } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signup } from './src/api';
import { AuthContext, LoadingContext, SessionContext, ConversationContext } from './src/context';
import { SocketContext, socket } from './src/context/socket';
import Authenticate from './src/screens/Authenticate';
import moment from 'moment'
import MessagesRouter from './src/screens/MessagesRouter';
import { NavigationContainer } from '@react-navigation/native';
import { io } from "socket.io-client";

const App = () => {
  const [loading, setLoading] = useState(false)
  const [session, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          console.log("RESTORING TOKEN")
          return {
            ...prevState,
            token: action.token,
            isLoading: false,
            user: action.user,
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            token: action.token,
            user: action.user,
          }
        case 'SIGN_OUT':
            AsyncStorage.removeItem('userToken')
            AsyncStorage.removeItem('user')
            AsyncStorage.removeItem('tokenExpiration')
          return {
            ...prevState,
            isSignout: true,
            token: null,
            user: null,
          }
        default: return {}
      }
    },
    {
      isLoading: true,
      isSignout: false,
      token: null,
      user: null,
    },
  )


  useEffect(() => {
    const checkToken = async () => {
      let user
      let userToken
      let tokenExpiration
      // await AsyncStorage.removeItem('userToken')
      // await AsyncStorage.removeItem('tokenExpiration')

      try {
        userToken = await AsyncStorage.getItem('userToken')
        tokenExpiration = await AsyncStorage.getItem('tokenExpiration')
        console.log('Expires in: (minutes) ', moment.unix(tokenExpiration).diff(moment(), 'minutes'))
        if ((moment().diff(moment.unix(tokenExpiration), 'minutes') > 0) || !tokenExpiration) {
          await AsyncStorage.removeItem('userToken')
          await AsyncStorage.removeItem('tokenExpiration')
          userToken = null
        }
      } catch (err) {
        console.log('error retrieving token', err)
      }
      if (userToken && userToken !== 'undefined') {
        user = await AsyncStorage.getItem('user')
        user = JSON.parse(user)
      }
      console.log("ARE WE RESTORING", userToken, user)
      dispatch({ type: 'RESTORE_TOKEN', token: userToken, user: user })
    }

    checkToken()



    
  }, [])


  return (
    <AuthContext.Provider value={dispatch}>
      <SessionContext.Provider value={session}>
          <LoadingContext.Provider value={{ loading, setLoading }}>
            <SocketContext.Provider value={socket}>
              <NavigationContainer>
                {loading ? <View><Text>LOADING</Text></View> : session.user ? <MessagesRouter /> : <Authenticate />}
              </NavigationContainer>
            </SocketContext.Provider>
          </LoadingContext.Provider>
      </SessionContext.Provider>
    </AuthContext.Provider>
  )
}

export default App


