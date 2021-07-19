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

  const [cachedConversations, setCachedConversations] = useState({})

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