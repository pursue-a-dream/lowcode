import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import routes from './router.config.js'

Vue.use(Router)

const createRoute = routes => {
  return routes.reduce((processedRoutes, currentRoute) => {
    processedRoutes.push(processRouteObj(currentRoute))
    return processedRoutes
  }, [])
}
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const processRouteObj = ({ menuCode, breadcrumb, children, component, ...args }) => {
  return Object.assign(
    {
      meta: { menuCode, breadcrumb },
      props: {
        breadcrumbObj: {
          content: breadcrumb,
          menuCode: menuCode,
        },
      },
      component: () => import(/* webpackInclude: /\.(vue|js)$/ */ `@/pages/${component}.vue`),
      children: children ? createRoute(children) : [],
    },
    args,
  )
}
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: createRoute(routes),
})

router.beforeEach(async (to, form, next) => {
  // 没有token 重定向到登录页
  // const token = sessionStorage.getItem('token')
  // if (!token && to.path != '/login') {
  //   sessionStorage.clear()
  //   return next({ path: '/login' })
  // }
  if (to.path === '/') {
    return next({ path: '/project' })
  }
  next()
})

export default router
