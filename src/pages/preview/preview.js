import HTTP from '@/api/index'
import { BASE_URL } from '@/config/constant'
export default {
  addTem(_, data) {
    return HTTP.post(`${BASE_URL}/template/add`, data)
  },
  updateTem(_, data) {
    return HTTP.post(`${BASE_URL}/template/update`, data)
  },
  delTem(_, data) {
    return HTTP.post(`${BASE_URL}/template/delete`, data)
  },
  getCommonTem(_, type) {
    return HTTP.get(`${BASE_URL}/template/${type}`)
  },
  addCommonTem(_, data) {
    return HTTP.post(`${BASE_URL}/template/addCommonTem`, data)
  },
  updateCommonTem(_, data) {
    return HTTP.post(`${BASE_URL}/template/updateCommonTem`, data)
  },
}
