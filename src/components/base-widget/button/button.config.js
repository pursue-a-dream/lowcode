// 组件配置
export const widgetConfig = {
  type: 'button',
  name: 'button组件',
  widgetList: [],
  hasStyleConfig: true,
  activeStyle: {},
  options: {
    label: 'button',
    size: null,
    displayStyle: 'inline-block',
    icon: '',
    type: 'primary',
    plain: false,
    radius: false,
    loading: false,
    // customClass: '', //自定义css类名
  },
  actions: [{ label: '单次点击', value: 'click' }],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
