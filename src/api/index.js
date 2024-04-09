import http from './httpInstance'
// import { getSession } from '@/common/util'
// import { dealStore } from '@/store/storeDeal'
// 如需拓展，将要拓展的方法添加至数组中
const HTTP_OPTIONS = ['get', 'post', 'put', 'delete']
const HTTP = {}

HTTP_OPTIONS.forEach((item, index) => {
  HTTP[item] = (url, params = {}, headers = {}) => {
    const { payload, $hideLoad = false, $token = true, $blob = false, header = {} } = params
    if ($token && sessionStorage.getItem('token')) {
      headers['Authorization'] = sessionStorage.getItem('token')
    }

    // 下载文件
    let responseType
    if ($blob) {
      responseType = 'blob'
    }

    return new Promise((resolve, reject) =>
      http({
        method: item.toUpperCase(),
        url,
        data: payload || params,
        responseType,
        dataType: 'JSON',
        headers: { ...headers, ...header },
      })
        .then(res => resolve(res))
        .catch(error => reject(error))
        .finally(() => {
          // dealStore.store.commit && dealStore.store.commit('SET_LODING', false)
        }),
    )
  }
})

export default HTTP
