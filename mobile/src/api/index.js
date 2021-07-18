import axios from 'axios'

const login = ({ username, password }) => {
  return axios.post('https://silent-bullfrog-70.loca.lt/login', { username, password })
}
const signup = ({ username, password }) => {
  return axios.post('https://silent-bullfrog-70.loca.lt/signup', { username, password })
}

export {
  login,
  signup
}