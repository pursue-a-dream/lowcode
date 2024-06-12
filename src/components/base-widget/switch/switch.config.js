// 组件配置
export const widgetConfig = {
  type: 'switch',
  name: 'switch组件',
  widgetList: [],
  hasStyleConfig: true,
  activeStyle: {},
  value: '',
  options: {
    name: 'switch',
    label: 'switch',
    // width: 52,
    disabled: false,
    size: 'normal',
    activeText: '',
    inactiveText: '',
    activeValue: 'true',
    inactiveValue: 'false',
  },
  actions: [
    { label: '切换状态前', value: 'changeBefore' },
    { label: '切换状态', value: 'change' },
  ],
  triggerEvent: [{ label: 'switch切换', value: 'switchChange' }],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  {
    size: '大小',
    isBaseProp: true,
    type: 'select',
    optionArr: [
      { label: '默认', val: 'normal' },
      { label: 'small', val: 'small' },
      { label: 'mini', val: 'mini' },
    ],
  },
  {
    width: '宽度',
    isBaseProp: true,
    type: 'number',
  },
  {
    value: '绑定值',
    isBaseProp: true,
  },
  {
    activeText: '右侧的文字',
    isBaseProp: true,
  },
  {
    inactiveText: '左侧的文字',
    isBaseProp: true,
  },
  { activeValue: '打开绑定值', isBaseProp: true },
  { inactiveValue: '关闭绑定值', isBaseProp: true },
]
