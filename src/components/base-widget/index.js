import Vue from 'vue'
const requireComponent = require.context('./', true, /\w+\.vue$/)

requireComponent.keys().map(fileName => {
  let comp = requireComponent(fileName).default
  Vue.component(comp.name, comp)
})
