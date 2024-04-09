import Drawer from './src/Drawer.vue';

const install = function(Vue) {
  Vue.component(Drawer.name, Drawer);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};
