import axios from 'axios'
import { API_URL } from '@/utils/config'

const AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export default AxiosInstance
