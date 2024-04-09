// 组件配置
export const widgetConfig = {
  type: 'alert',
  name: 'alert组件',
  widgetList: [],
  hasStyleConfig: true,
  activeStyle: {},
  options: {
    label: 'alert',
    alertType: 'success',
    title: '提示的文案',
    description: '辅助文案',
    simple: true,
    closable: false,
    center: false,
    showIcon: true,
  },
  actions: [],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  {
    alertType: '类型',
    isBaseProp: true,
    type: 'select',
    optionArr: [
      { label: 'success', val: 'success' },
      { label: 'warning', val: 'warning' },
      { label: 'info', val: 'info' },
      { label: 'error', val: 'error' },
    ],
  },
  {
    description: '辅助文案',
    isBaseProp: true,
  },
  {
    simple: '简单模式',
    type: 'switch',
    isBaseProp: true,
  },
  {
    showIcon: '展示图标',
    type: 'switch',
    isBaseProp: true,
  },
  {
    closable: '是否可关闭',
    type: 'switch',
    isBaseProp: true,
  },
  {
    center: '居中显示文本',
    type: 'switch',
    isBaseProp: true,
  },
]
