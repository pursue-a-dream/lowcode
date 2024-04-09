// 组件配置
export const widgetConfig = {
  type: 'drawer',
  formItemFlag: true,
  name: 'drawer组件',
  notInWidgetPanel: true,
  widgetList: [],
  options: {
    name: 'drawer',
    visible: true,
    title: 'drawer标题',
    modal: false,
    modalAppendToBody: false,
    appendToBody: false,
    showClose: true,
    customClass: '',
    wrapperClosable: false,
    addBtnName: '确 定',
    cancelBtnName: '取 消',
    hasAddBtnName: true,
    hasCancelBtnName: true,
    hasFooter: true,
  },
  actions: [
    { label: '点击确定回调', value: 'drawerConfirmClick' },
    { label: '关闭回调', value: 'drawerCancelClick' },
  ],
  triggerEvent: [{ label: '关闭drawer', value: 'drawerClose' }],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
