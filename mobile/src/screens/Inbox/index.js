import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext, useEffect } from 'react'
import { Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { FlatList } from 'react-native-gesture-handler';
import { getConversations, newConversation } from '../../api';
import { AuthContext, ConversationContext, SessionContext } from '../../context';


const Inbox = () => {
  const navigation = useNavigation()

  const [newConversationInput, setNewConversationInput] = useState('')
  const [newConversationModalVisible, setNewConversationModalVisible] = useState(false);
  const [signoutModalVisible, setSignoutModalVisible] = useState(false);
  const [conversations, setConversations] = useState([])

  const { setCurrentConversation } = useContext(ConversationContext)
  const { user } = useContext(SessionContext)
  const dispatch = useContext(AuthContext)


  useEffect(() => {
    let isSubscribed = true;
    (async() => {
      try {
        let savedConversations = await AsyncStorage.removeItem('conversations')
        if (savedConversations) {
          if (!isSubscribed) return
          setConversations(JSON.parse(savedConversations))
        }
        let previousConversations = await getConversations({ username: user.username })
        if (!isSubscribed) return
        setConversations(previousConversations.data)
      } catch(err) {
        console.log(err)
      }
    })()

    return () => {
      isSubscribed = false
    }

  }, [])

  useEffect(() => {
    if (!conversations.length) return
    AsyncStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  
  const Item = ({ item, navigation }) => (
    <TouchableOpacity style={styles.item} onPress={() => {
      navigation.push('Conversation');
      setCurrentConversation(item);
    }}
      
      >
      <Text style={styles.title}>{item.members?.filter(item => item !== user.username).toString()}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    return (
    <Item navigation={navigation} item={item} />
  )};

  const startConversation = async() => {
    if (!newConversationInput.trim()) {
      setNewConversationInput("")
      return
    }
    try {
      let members = newConversationInput.toLowerCase().split(',')
      members = members.map(item => item.trim())
      members.push(user.username)
      let conversation = await newConversation({ members })
      setNewConversationInput('')
      setCurrentConversation(conversation.data)
      navigation.navigate('Conversation')
      setConversations((prev) => prev.concat(conversation.data))
    } catch(err) {
      console.log(err)
    }
  }


  return (
    <SafeAreaView style={{backgroundColor: '#333', height: '100%'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15}}>
        <Text style={{fontSize: 25, color: 'white'}}>inbox</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setNewConversationModalVisible(true)}><Text style={{fontSize: 25, color: '#DDD', marginLeft: 25}}>+</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setSignoutModalVisible(true)}><Text style={{fontSize: 25, color: '#DDD', marginLeft: 25}}>signout</Text></TouchableOpacity>
        </View>
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
        visible={newConversationModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setNewConversationModalVisible(!newConversationModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter recipient's username, or multiple usernames separated by a comma</Text>
            <TextInput 
              value={newConversationInput}
              onChangeText={setNewConversationInput}
              style={{borderColor: 'black', padding: 15, backgroundColor: '#EEE', margin: 10, width: '75%', textAlign: 'center', borderRadius: 4}} 
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                startConversation()
                setNewConversationModalVisible(!newConversationModalVisible)
              }}
            >
              <Text style={styles.textStyle}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setNewConversationModalVisible(!newConversationModalVisible)
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={signoutModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setSignoutModalVisible(!signoutModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirm signout</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                dispatch({type: "SIGN_OUT"})
                setSignoutModalVisible(!signoutModalVisible)
              }}
            >
              <Text style={styles.textStyle}>sign out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setSignoutModalVisible(!signoutModalVisible)
              }}
            >
              <Text style={styles.textStyle}>cancel</Text>
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
    borderRadius: 5,
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
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginBottom: 10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#555",
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