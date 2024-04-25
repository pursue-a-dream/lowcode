// 组件配置
export const widgetConfig = {
  type: 'col',
  name: 'col容器',
  notInWidgetPanel: true,
  category: 'container',
  widgetList: [],
  options: {
    name: 'col',
    span: 12,
  },
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  {
    span: '宽度',
    isBaseProp: true,
    type: 'number',
  },
]
