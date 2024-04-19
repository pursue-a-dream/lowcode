import HTTP from '@/api/index'
import { BASE_URL } from '@/config/constant'
const getUserInfo = () => {
  return HTTP.get(`${BASE_URL}/user/userInfo`)
}
export default {
  async getUserInfo(context) {
    let { data } = await getUserInfo({ noMsg: true })
    context.commit('SET_USER_INFO', data, { root: true })
    return data
  },
}
