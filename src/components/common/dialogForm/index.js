import DialogForm from './src/dialogForm.vue'

const install = function (Vue) {
  Vue.component(DialogForm.name, DialogForm)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
}
