import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext, useEffect } from 'react'
import { Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FlatList } from 'react-native-gesture-handler';
import { getConversations } from '../../api';
import { ConversationContext, SessionContext } from '../../context';


const Inbox = () => {
  const navigation = useNavigation()


  const [modalVisible, setModalVisible] = useState(false);
  const [conversations, setConversations] = useState([])

  const { setCurrentConversation } = useContext(ConversationContext)
  const { user } = useContext(SessionContext)


  useEffect(() => {
    (async() => {
      let previousConversations = await getConversations({ username: user.username })
      console.log(previousConversations.data)
      previousConversations.data.forEach(item => console.log(item.members))
      setConversations(previousConversations.data)

    })()

  }, [])

  
  const Item = ({ item, navigation }) => (
    <TouchableOpacity style={styles.item} onPress={() => {
      console.log("GO"); 
      navigation.push('Conversation')
      setCurrentConversation(item)
    }}
      
      >
      <Text style={styles.title}>{item.members?.toString()}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    console.log(item)
    return (
    <Item navigation={navigation} item={item} />
  )};



  return (
    <SafeAreaView style={{backgroundColor: '#333'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15}}>
        <Text style={{fontSize: 25, color: 'white'}}>Current chats</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}><Text style={{fontSize: 25}}>+</Text></TouchableOpacity>
      </View>
      {conversations.length ? <FlatList
        style={{height: '100%'}}
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      /> : null}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter recipient's username</Text>
            <TextInput style={{borderColor: 'black', padding: 15, backgroundColor: '#CDCDCD', margin: 10, width: '75%', textAlign: 'center'}} />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#999',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5
  },
  title: {
    fontSize: 15,
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

export default Inbox