import React, { useState } from 'react'
import { Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FlatList } from 'react-native-gesture-handler';


const MessageInput = ({ sendMessage }) => {
  const [messageInput, setMessageInput] = useState('')
  console.log('messageslist render')


  
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
      <TextInput
        value={messageInput}
        onChangeText={setMessageInput}
        placeholder="Enter message"
        style={{backgroundColor: '#DDD', borderColor: '#111', padding: 10, width: '65%', borderRadius: 5}}
      />
      <TouchableOpacity
        onPress={() => sendMessage(messageInput, () => setMessageInput(""))}
        style={{
          backgroundColor: '#CDCDCD',
          padding: 10,
          alignContent: 'center',
          justifyContent: 'center',
          width: '25%',
          borderRadius: 5,
          textAlign: 'center',
        }}
      >
        <Text style={{textAlign: 'center'}}>SEND</Text>
      </TouchableOpacity>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: '85%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default MessageInput