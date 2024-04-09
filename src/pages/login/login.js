import HTTP from '@/api/index'
import { BASE_URL } from '@/config/constant'
export default {
  login(_, data) {
    return HTTP.post(`${BASE_URL}/auth/login`, data)
  },
}
