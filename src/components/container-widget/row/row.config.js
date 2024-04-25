import { creatWidgetByWidgetOption } from '@/config/widgetsConfig.js'
import * as colWidgetConfig from './col.config.js'
// 组件配置
export const widgetConfig = {
  type: 'row',
  name: '栅格',
  hasStyleConfig: true,
  category: 'container',
  widgetList: [
    creatWidgetByWidgetOption('col', {}, colWidgetConfig.widgetConfig),
    creatWidgetByWidgetOption('col', {}, colWidgetConfig.widgetConfig),
  ],
  options: {
    name: '',
  },
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
