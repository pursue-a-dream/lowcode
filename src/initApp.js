import store from '@/store'
import { mountVueInstance, errorLoadPage } from 'dolphin-plugin-tools'
import router from './router'
import App from './App'
import ErrorPage from '@/components/ErrorPage'
import { renderThemeFromCssUrl } from 'dolphin-plugin-tools'

function getUrlParams() {
  var url = window.location.href
  var params = {}
  var index = url.indexOf('?')
  if (index !== -1) {
    var queryStr = url.slice(index + 1)
    var queries = queryStr.split('&')
    for (var i = 0; i < queries.length; i++) {
      var pair = queries[i].split('=')
      if (pair.length === 2) {
        var key = decodeURIComponent(pair[0])
        var value = decodeURIComponent(pair[1])
        params[key] = value
      }
    }
  }
  return params
}
async function initApp(Vue) {
  try {
    if (process.env.NODE_ENV != 'development') {
      if (!window.location.href.includes('isLogin') && !sessionStorage.getItem('userName')) {
        window.location.href = window.location.origin + '/lowCode/userInfo'
        return
      }
      try {
        const { userName } = getUrlParams()
        if (userName) {
          store.commit('SET_USER', userName, { root: true })
          sessionStorage.setItem('userName', userName)
        }
      } catch (error) {}
      // 获取用户信息
      await store.dispatch('main/getUserInfo')
    } else {
      sessionStorage.setItem('userName', 'sunpeixian')
      await store.dispatch('main/getUserInfo')
    }

    await renderTheme({ skin: 'blue' })
    // 初始化vue实例
    mountVueInstance(Vue, App, {
      store,
      router,
    })
  } catch (error) {
    await renderTheme({ skin: 'blue' })
    console.error('init error:', error)
    errorLoadPage(Vue, ErrorPage)
  }
}

async function renderTheme({ skin }) {
  try {
    const assetsUrl = process.env.BASE_URL + process.env.VUE_APP_ASSETS
    // public/static/skin/xxx/skin.css
    const requestUrl = `${assetsUrl}/skin/${skin}/skin.css`
    await renderThemeFromCssUrl(requestUrl)
  } catch (error) {
    throw error
  }
}

export default initApp
