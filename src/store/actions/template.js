import HTTP from '@/api/index'
const BASE_URL = '/api'
export default {
  getProjectTemById(_, { projectId }) {
    return HTTP.get(`${BASE_URL}/template?projectId=${projectId}`)
  },
  getTemByType(_, data) {
    return HTTP.get(`${BASE_URL}/template/${data}`, data)
  },

  updateProjectTem(_, data = {}) {
    return HTTP.post(`${BASE_URL}/template/update`, data)
  },

  delProject(_, data = {}) {
    return HTTP.delete(`${BASE_URL}/app`, data)
  },
}
