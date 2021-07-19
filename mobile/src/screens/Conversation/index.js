import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FlatList } from 'react-native-gesture-handler';
import MessageInput from './components/MessageInput';
import MessagesList from './components/MessagesList';
import { io } from "socket.io-client";
import { ConversationContext, SessionContext } from '../../context';
import 'react-native-get-random-values';

import { v4 as uuidv4 } from 'uuid';
import { getConversations, getMessages } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Conversation = ({ navigation }) => {
  
  
  
  const { user } = useContext(SessionContext)
  const { currentConversation } = useContext(ConversationContext)
  const [userMessages, setUserMessages] = useState([])
  console.log('render')


  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      let savedMessages = await AsyncStorage.getItem(currentConversation._id)  
      setUserMessages(JSON.parse(savedMessages))
      const previousMessages = await getMessages({ conversationId: currentConversation._id })
      if (previousMessages.data && isSubscribed) {
        setUserMessages(previousMessages.data)
      }

    })()

    

    return () => {
      isSubscribed = false
      // socket.disconnect()
      // setCurrentSocket(null)
      // console.log("SETTING", userMessages)
      (async() => {
        // await AsyncStorage.setItem(currentConversation._id, JSON.stringify(userMessages))
      })()
    }
  }, [])

  useEffect(() => {
    if (!userMessages?.length) return
    AsyncStorage.setItem(currentConversation._id, JSON.stringify(userMessages))
  }, [userMessages])

  const sendMessage = (messageInput, cb) => {
    if (!messageInput) return
    const newMessage = {
      conversationId: currentConversation._id,
      author: user.username,
      body: messageInput,
    }
    // console.log("SENDING", newMessage, currentSocket)
    // currentSocket.emit('chat message', newMessage)
    cb()
  }
  


  
  return (
    <SafeAreaView style={{padding: 10, justifyContent: 'space-between', height: '100%'}}>
        {/* <Text>{navigation.state?.params?.title || "New conversation"}</Text> */}
        <MessagesList data={userMessages} />
        <MessageInput sendMessage={sendMessage} />
    </SafeAreaView>
  )

}

export default Conversation