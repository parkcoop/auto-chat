import React, { useState, useContext } from 'react'
import { Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FlatList } from 'react-native-gesture-handler';
import { ConversationContext, SessionContext } from '../../../../context';


const MessagesList = ({ data }) => {
  const myId = 123
  const theirId = 456
  const { currentConversation } = useContext(ConversationContext)
  const { user } = useContext(SessionContext)
  console.log('messageslist render')
  
  
  const Item = ({ item, navigation }) => {
    return (
    <View style={{width: '70%', margin: 10, borderRadius: 5, padding: 10, ...item.author === user.username ? {backgroundColor: '#81afeb', alignSelf: 'flex-end'} : {backgroundColor: '#CDCDCD'}}}>
      <Text style={item.sender == myId ? {color: 'white'} : {color: 'black'}}>{item.body}</Text>
    </View>
  )

};

  const renderItem = ({ item }) => (
    <Item item={item} />
  );

  
  return (
    <FlatList
        inverted
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
  )

}

export default MessagesList