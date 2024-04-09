import Vue from 'vue'
import initApp from './initApp'
import './style/index.scss'
import locale from 'hui/lib/locale/lang/zh-CN'
import HUI from 'hui'
import 'hui/lib/hui.css'
Vue.use(HUI, { locale })
import page from '@hui-pro/page'
import '@hui-pro/page/theme/index.scss'
Vue.use(page)
import layout from '@hui-pro/layout'
import '@hui-pro/layout/theme/index.scss'
Vue.use(layout)
// 全局注册容器组件和基础组件
import './components/base-widget/index'
import './components/container-widget/index'
import './components/template/index'
// 注册自定义组件
import commonForm from './components/common/commonForm/index.js'
import Drawer from './components/common/drawer/index'
import dialogForm from './components/common/dialogForm/index'
import './components/common/drawer/theme/index.scss'
import dragEmpty from './components/common/dragEmpty/dragEmpty.vue'
Vue.use(commonForm)
Vue.use(Drawer)
Vue.use(dialogForm)
Vue.component(dragEmpty.name, dragEmpty)
Vue.config.productionTip = false
import Draggable from 'vuedraggable'
Vue.component(Draggable.name, Draggable)

initApp(Vue)
