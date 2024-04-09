// 组件配置
export const widgetConfig = {
  type: 'form',
  name: 'form表单容器',
  hasStyleConfig: true,
  activeStyle: {},
  category: 'container',
  icon: 'form',
  cols: [],
  widgetProvideData: {},
  widgetList: [],
  options: {
    name: 'form',
    inline: false,
    childWidthPercent: '25%',
    labelPosition: 'top',
    labelWidth: '90px',
    customClass: '', //自定义css类名
  },
  triggerEvent: [
    { label: '表单提交', value: 'formSubmit', reqMethod: 'post', reqUrl: '' },
    { label: '表单重置', value: 'formReset' },
  ],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
