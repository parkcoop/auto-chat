import axios from 'axios'

const login = ({ username, password }) => {
  return axios.post('http://3.239.40.119/login', { username, password })
}

const signup = ({ username, password }) => {
  return axios.post('http://3.239.40.119/signup', { username, password })
}

const getMessages = ({ conversationId }) => {
  return axios.get('http://3.239.40.119/messages?conversationId=' + conversationId)
}

// const newMessage = ({ conversationId, author, body }) => {
//   return axios.get('http://3.239.40.119/messages', { conversationId, author, body })
// }

const getConversations = ({ username }) => {
  return axios.get('http://3.239.40.119/conversations?username=' + username)
}

const newConversation = ({ members }) => {
  return axios.post('http://3.239.40.119/conversation', { members })
}

export {
  login,
  signup,
  // newMessage,
  getMessages,
  getConversations,
  newConversation
}