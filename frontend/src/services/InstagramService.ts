import { Message, User } from '../types'
import api from './api'

const getAuthHeader = (token: string) => ({ Authorization: `Bearer ${token}` })

const InstagramService = {
  login: async (user: User) => {
    const response = await api.post('/login', user)
    return response.data
  },

  sendMessage: async (message: Message, token: string) => {
    const response = await api.post('/send-message', message, {
      headers: getAuthHeader(token),
    })
    return response.data
  },

  checkTokenAuthorization: async (token: string) => {
    const response = await api.get('/authorized-token', {
      headers: getAuthHeader(token),
    })
    return response.data
  },
  logout: async () => {
    const response = await api.post('/logout')
    return response.data
  },
}

export default InstagramService
