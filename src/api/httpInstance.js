import axios from 'axios'
import { Message } from 'hui'
import { trimOnlySpace } from '@hui-pro/utils'
import router from '@/router'
const REQUEST_SUCCESS = 1
const http = axios.create({
  timeout: 20000,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
})

// 相应拦截器
http.interceptors.response.use(
  function (response) {
    // 请求多语言的json文件
    if (/.*\.json$/.test(response.config.url)) {
      return response
    }
    // 对错误进行统一处理
    if (response.data.code !== REQUEST_SUCCESS) {
      if (!response.config.noMsg && response.data.message) {
        Message.error(response.data.message)
      }
      if (response.data.status === 401) {
        sessionStorage.clear()
        router.replace('/login')
      }
      return Promise.reject(response)
    } else if (response.data.code === REQUEST_SUCCESS && response.config.successNotify && response.data.msg) {
      // 弹出成功提示
      Message.success(response.data.msg)
    }
    return Promise.resolve({
      code: response.data.code,
      msg: response.data.message,
      data: response.data.data,
    })
  },
  function (error) {
    if (sessionStorage.getItem('userName') && error.message == 'Network Error') {
      console.log(2323232, (Window.error = error), error.message, error.response)
      // 认证失败，直接走OA认证逻辑
      sessionStorage.clear()
      window.location.reload()
    }
    if (error.message.indexOf('timeout') > -1) {
      // 多语言需要自己在项目中配置
      Message.error('请求超时，请重试！')
    }
    if (error.message.indexOf('403') > -1) {
      // 多语言需要自己在项目中配置
      Message.error('无请求权限,请登录！')
    }
    return Promise.reject(error)
  },
)

// 请求拦截器
http.interceptors.request.use(
  function (config) {
    // 所有搜索框可输入元素，都不需要去掉前后空格，只有仅输入空格时，此字段搜索无效。(规范: http://iris.hikvision.com.cn/huidesign/bscs/issues/83)
    return trimOnlySpace(config)
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

export default http
