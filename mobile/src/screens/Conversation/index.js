import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FlatList } from 'react-native-gesture-handler';
import MessageInput from './components/MessageInput';
import MessagesList from './components/MessagesList';
import { ConversationContext, SessionContext } from '../../context';
import { SocketContext } from '../../context/socket';
import 'react-native-get-random-values';

import { getConversations, getMessages } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Conversation = ({ navigation }) => {
  const { user } = useContext(SessionContext)
  const { currentConversation } = useContext(ConversationContext)
  const socket = useContext(SocketContext)
  const [userMessages, setUserMessages] = useState([])
  console.log('messages render')

  useEffect(() => {
    let isSubscribed = true
    socket.on("chat message", (msg) => {
      if (msg.conversationId === currentConversation._id) {
        if (!isSubscribed) return
        setUserMessages((prev) => {
          if (!prev) return [msg]
          return [ msg, ...prev ]
        })
      }
    });

    return () => {
      isSubscribed = false
    }
  }, [socket])

  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      try {
        let savedMessages = await AsyncStorage.getItem(currentConversation._id)  
        setUserMessages(JSON.parse(savedMessages))
        const previousMessages = await getMessages({ conversationId: currentConversation._id })
        if (previousMessages?.data && isSubscribed && previousMessages.data.length !== savedMessages?.length) {
          if (!isSubscribed) return
          setUserMessages(previousMessages.data)
        }
      } catch(err) {
        console.log(err)
      }

    })()
    return () => {
      isSubscribed = false
    }
  }, [currentConversation])

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
    socket.emit('chat message', newMessage)
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