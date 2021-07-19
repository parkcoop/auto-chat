import React, { useState } from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import Inbox from '../Inbox';
import { useNavigation } from '@react-navigation/native';
import Conversation from '../Conversation';
import { ConversationContext } from '../../context';

const Stack = createStackNavigator();

function MessagesRouter() {

  const [currentConversation, setCurrentConversation] = useState({
    members: [],
    conversationId: null
  })

  const [cachedConversations, setCachedConversations] = useState({
    '60f4ea33252b94278dc57840': [
      {
        "_id": "60f4efb394d7e72dd13af339",
        "conversationId": "60f4ea33252b94278dc57840",
        "author": "parker",
        "body": "first msg thru postman",
        "createdAt": "2021-07-19T03:21:23.699Z",
        "updatedAt": "2021-07-19T03:21:23.699Z",
        "__v": 0
    },
    {
        "_id": "60f4f05344ebc4301ab50682",
        "conversationId": "60f4ea33252b94278dc57840",
        "author": "parker",
        "body": "second msg thru postman",
        "createdAt": "2021-07-19T03:24:03.472Z",
        "updatedAt": "2021-07-19T03:24:03.472Z",
        "__v": 0
    },
    {
        "_id": "60f4f05d44ebc4301ab50684",
        "conversationId": "60f4ea33252b94278dc57840",
        "author": "michelle",
        "body": "lol convo time",
        "createdAt": "2021-07-19T03:24:13.490Z",
        "updatedAt": "2021-07-19T03:24:13.490Z",
        "__v": 0
    }
    ]
  })

  return (
    <ConversationContext.Provider value={{ currentConversation, setCurrentConversation, cachedConversations, setCachedConversations }}>
      <Stack.Navigator>
        <Stack.Screen name="Inbox" component={Inbox} />
        <Stack.Screen name="Conversation" component={Conversation} options={{
          title: currentConversation.members?.join() || "New"
        }} />
      </Stack.Navigator>
    </ConversationContext.Provider>
  );
}

export default MessagesRouter