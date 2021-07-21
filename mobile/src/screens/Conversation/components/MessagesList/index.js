import React, { useState, useContext, useRef } from 'react'
import { Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FlatList } from 'react-native-gesture-handler';
import { ConversationContext, SessionContext } from '../../../../context';


const MessagesList = ({ data }) => {
  const myId = 123
  const listRef = useRef()
  const theirId = 456
  const { currentConversation } = useContext(ConversationContext)
  const { user } = useContext(SessionContext)
  console.log('messageslist render')
  
  
  const Item = ({ item, navigation }) => {
    let userAuthored = item.author === user.username
    return (
      <View>
        {currentConversation.members.length > 2 ? (
          <>
            <Text style={{
              width: '70%', 
              margin: 10, 
              marginBottom: 0, 
              ...userAuthored ? 
                { alignSelf: 'flex-end', textAlign: 'right' } : 
                { textAlign: 'left' }}}
              >
                {item.author}
            </Text>
          </>
        ) : null}
        <View style={{
          width: '70%', 
          margin: 10, 
          marginTop: 0, 
          borderRadius: 5, 
          padding: 10, 
          ...userAuthored ? 
            {backgroundColor: '#81afeb', alignSelf: 'flex-end'} : 
            {backgroundColor: '#DDD'}}}
        >
          <Text style={userAuthored ? {color: 'white'} : {color: '#111'}}>{item.body}</Text>
        </View>
      </View>
  )

};

  const renderItem = ({ item }) => (
    <Item item={item} />
  );

  
  return (
    <FlatList
        style={{height:'100%'}}
        nestedScrollEnabled
        keyboardDismissMode="on-drag"
        // keyboardShouldPersistTaps=""
        onContentSizeChange={() => {
          console.log(listRef); listRef.current.scrollToOffset({ animated: true, offset: 0 })}}
        inverted
        ref={listRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
  )

}

export default MessagesList