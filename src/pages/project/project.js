import HTTP from '@/api/index'
import { BASE_URL } from '@/config/constant'
export default {
  getProject(_, data) {
    return HTTP.get(`${BASE_URL}/project`, data)
  },
  addProject(_, data) {
    return HTTP.post(`${BASE_URL}/project`, data)
  },
}
