import { creatWidgetByWidgetOption } from '@/config/widgetsConfig.js'
import * as collapseItemWidgetConfig from './collapse-item.config'
// 组件配置
export const widgetConfig = {
  type: 'collapse',
  formItemFlag: true,
  name: 'collapse组件',
  widgetList: [
    creatWidgetByWidgetOption('collapse-item', {}, collapseItemWidgetConfig.widgetConfig),
    creatWidgetByWidgetOption('collapse-item', {}, collapseItemWidgetConfig.widgetConfig),
  ],
  options: {
    accordion: true,
  },
  actions: [
    // { label: '点击确定回调', value: 'collapseConfirmClick' },
    // { label: '关闭回调', value: 'collapseCancelClick' },
  ],
  // triggerEvent: [{ label: '关闭dailog', value: 'collapseClose' }],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  // {
  //   accordion: '手风琴模式',
  //   isBaseProp: true,
  //   // type: 'dataSource',
  //   // show: (widgetOption, widget) => {
  //   //   return true
  //   // },
  // },
]
