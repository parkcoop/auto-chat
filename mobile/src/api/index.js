import axios from 'axios'

const login = ({ username, password }) => {
  return axios.post('https://loud-sloth-90.loca.lt/login', { username, password })
}
const signup = ({ username, password }) => {
  return axios.post('https://loud-sloth-90.loca.lt/signup', { username, password })
}

const getMessages = ({ conversationId }) => {
  return axios.get('https://loud-sloth-90.loca.lt/messages?conversationId=' + conversationId)
}

// const newMessage = ({ conversationId, author, body }) => {
//   return axios.get('https://loud-sloth-90.loca.lt/messages', { conversationId, author, body })
// }
const getConversations = ({ username }) => {
  return axios.get('https://loud-sloth-90.loca.lt/conversations', { username })
}

const newConversation = ({ members }) => {
  return axios.post('https://loud-sloth-90.loca.lt/conversation', { members })
}

export {
  login,
  signup,
  // newMessage,
  getMessages,
  getConversations,
  newConversation
}