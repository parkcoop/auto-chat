import axios from 'axios'

const signup = ({ username, password }) => {
  return axios.post('https://old-starfish-88.loca.lt', { username, password })
}

export {
  signup
}