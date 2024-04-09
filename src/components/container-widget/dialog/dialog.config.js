// 组件配置
export const widgetConfig = {
  type: 'dialog',
  formItemFlag: true,
  notInWidgetPanel: true,
  name: 'dialog组件',
  widgetList: [],
  options: {
    name: 'dialog',
    visible: true,
    title: 'dialog标题',
    area: 480,
    modal: false,
    modalAppendToBody: true,
    appendToBody: false,
    showClose: true,
    customClass: '',
    addBtnName: '确 定',
    cancelBtnName: '取 消',
    hasAddBtnName: true,
    hasCancelBtnName: true,
  },
  actions: [
    { label: '点击确定回调', value: 'dialogConfirmClick' },
    { label: '关闭回调', value: 'dialogCancelClick' },
  ],
  triggerEvent: [{ label: '关闭dailog', value: 'dialogClose' }],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
