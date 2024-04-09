// 组件配置
export const widgetConfig = {
  type: 'message-box',
  name: 'message-box',
  notInWidgetPanel: true,
  widgetList: [],
  options: {
    name: 'message',
    visible: true,
    label: 'message',
    message: 'message',
    title: 'title',
    size: 'middle',
    type: 'success',
    showCancelButton: false,
    showConfirmButton: true,
    cancelButtonText: '取 消',
    confirmButtonText: '确 定',
  },
  actions: [{ label: '点击确定', value: 'click' }],
  triggerEvent: [{ label: '关闭message', value: 'messageClose' }],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
