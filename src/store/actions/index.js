/* Automatically generated by './script/bin/new.js' */
import main from './main'
import login from '@/pages/login/login.js'
import project from '@/pages/project/project.js'
import drag from '@/pages/drag/drag.js'
const modules = {
  main,
  login,
  project,
  drag,
}

// 根据上面配置的modules生成命名空间
for (var key in modules) {
  modules[key] = {
    namespaced: true,
    actions: modules[key],
  }
}

export default {
  modules,
}
