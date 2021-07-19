import React, { useState, useEffect, useContext } from 'react'
import { Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FlatList } from 'react-native-gesture-handler';
import MessageInput from './components/MessageInput';
import MessagesList from './components/MessagesList';
import { io } from "socket.io-client";
import { ConversationContext, SessionContext } from '../../context';
import 'react-native-get-random-values';

import { v4 as uuidv4 } from 'uuid';
import { getConversations, getMessages } from '../../api';


const Conversation = ({ navigation }) => {
  
  
  
  const { user } = useContext(SessionContext)
  const { currentConversation, setCachedConversations, cachedConversations } = useContext(ConversationContext)
  const [currentSocket, setCurrentSocket] = useState()
  const [messageInput, setMessageInput] = useState('')
  const [userMessages, setUserMessages] = useState([])

  // console.log("???", currentConversation._id, (cachedConversations && cachedConversations[currentConversation._id]))
  // if (cachedConversations && cachedConversations[currentConversation._id]) {
  //   setUserMessages(cachedConversations[currentConversation._id])
  // }

  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      
      const previousMessages = await getMessages({ conversationId: currentConversation._id })
      if (previousMessages.data && isSubscribed) {
        setUserMessages((prev) => prev.concat(previousMessages.data))
        // setCachedConversations((prev) => {
        //   console.log("PREVIOUS CACHE", prev)
        //   prev[currentConversation._id] = previousMessages.data
        //   return prev
        // })
      }

    })()

    const socket = io("https://lazy-puma-54.loca.lt");
    setCurrentSocket(socket)

    socket.on("connected", msg => {
      console.log("Connected", msg)
    })
    
    socket.on("chat message", (msg) => {
      console.log('Received on client', msg)
    })

    return () => {
      isSubscribed = false
      socket.disconnect()
      setCurrentSocket(null)
    }
  }, [])

  const sendMessage = () => {
    if (!messageInput) return
    const newMessage = {
      conversationId: currentConversation._id,
      author: user.username,
      body: messageInput,
    }
    console.log("SENDING", newMessage, currentSocket)
    currentSocket.emit('chat message', newMessage)
    setMessageInput("")
  }
  



  
  return (
    <SafeAreaView style={{padding: 10, justifyContent: 'space-between', height: '100%'}}>
        {/* <Text>{navigation.state?.params?.title || "New conversation"}</Text> */}
        <MessagesList data={userMessages} />
        <MessageInput sendMessage={sendMessage} messageInput={messageInput} setMessageInput={setMessageInput} />
    </SafeAreaView>
  )

}

export default Conversation