import React, { useContext, useState } from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import Inbox from '../Inbox';
import { useNavigation } from '@react-navigation/native';
import Conversation from '../Conversation';
import { ConversationContext, SessionContext } from '../../context';

const Stack = createStackNavigator();

function MessagesRouter() {

  const [currentConversation, setCurrentConversation] = useState({
    members: [],
    conversationId: null
  })

  const { user } = useContext(SessionContext)


  return (
    <ConversationContext.Provider value={{ currentConversation, setCurrentConversation }}>
      <Stack.Navigator>
        <Stack.Screen name="Inbox" component={Inbox} />
        <Stack.Screen name="Conversation" component={Conversation} options={{
          title: currentConversation.members?.filter(item=>item !== user.username).join(', ') || "New"
        }} />
      </Stack.Navigator>
    </ConversationContext.Provider>
  );
}

export default MessagesRouter