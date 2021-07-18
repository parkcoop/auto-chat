import axios from 'axios'

const signup = ({ username, password }) => {
  return axios.post('https://soft-liger-95.loca.lt/login', { username, password })
}

export {
  signup
}