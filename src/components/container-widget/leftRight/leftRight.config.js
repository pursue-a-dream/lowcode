import { generateId } from '@/utils/util.js'

const leftRightId = generateId('leftright')
// 组件配置
export const widgetConfig = {
  type: 'left-right',
  name: '左右布局',
  hasStyleConfig: true,
  activeStyle: {},
  category: 'container',
  options: { name: leftRightId },
  id: leftRightId,
  widgetList: [
    {
      type: 'operate',
      name: '操作区容器',
      emptyDesc: '左侧区域容器',
      hasStyleConfig: true,
      activeStyle: { width: '250px', height: 'calc(100vh - 48px - 67px)' },
      category: 'container',
      widgetList: [],
      options: { name: 'operate86667', label: 'operate' },
      id: 'operate86667',
      styleConfig: {
        margin: { top: 0, left: 0, right: 0, bottom: 0 },
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
        font: { size: 14, weight: 400 },
        color: '',
        lineHeight: 40,
        width: '250',
        height: 'calc(100vh - 48px - 67px)',
      },
    },
    {
      type: 'operate',
      name: '操作区容器',
      emptyDesc: '右侧区域容器',
      hasStyleConfig: true,
      activeStyle: { width: 'calc(100% - 250px)', height: 'calc(100vh - 48px - 67px)' },
      category: 'container',
      widgetList: [],
      options: { name: 'operate44058', label: 'operate' },
      id: 'operate44058',
      styleConfig: {
        margin: { top: 0, left: 0, right: 0, bottom: 0 },
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
        font: { size: 14, weight: 400 },
        color: '',
        lineHeight: 15,
        width: 'calc(100% - 250px)',
        height: 'calc(100vh - 48px - 67px)',
      },
    },
  ],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
