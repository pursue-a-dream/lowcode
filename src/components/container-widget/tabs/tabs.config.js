import { creatWidgetByWidgetOption } from '@/config/widgetsConfig.js'
import * as tabPaneWidgetConfig from './tab-pane.config.js'
// 组件配置
export const widgetConfig = {
  type: 'tabs',
  name: 'Tabs标签页',
  hasStyleConfig: true,
  category: 'container',
  widgetList: [
    creatWidgetByWidgetOption('tab-pane', {}, tabPaneWidgetConfig.widgetConfig),
    creatWidgetByWidgetOption('tab-pane', {}, tabPaneWidgetConfig.widgetConfig),
  ],
  options: {
    name: '',
    type: '',
    tabPosition: 'top',
    fixWidth: 0,
  },
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
