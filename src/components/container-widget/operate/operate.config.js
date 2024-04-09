// 组件配置
export const widgetConfig = {
  type: 'operate',
  name: '操作区容器',
  hasStyleConfig: true,
  activeStyle: {},
  category: 'container',
  widgetList: [],
  options: {
    name: 'operate',
    widgetshow: formData => {
      return true
    },
  },
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  {
    widgetshow: '显隐控制函数',
    isBaseProp: true,
    type: 'dataSource',
    show: (widgetOption, widget) => {
      return true
    },
  },
]
