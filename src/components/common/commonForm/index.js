import CommonForm from './src/commonForm.vue'

const install = function (Vue) {
  Vue.component(CommonForm.name, CommonForm)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
}
