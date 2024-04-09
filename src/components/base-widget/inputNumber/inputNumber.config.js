// 组件配置
export const widgetConfig = {
  type: 'InputNumber',
  name: 'inputNumber',
  hasStyleConfig: true,
  activeStyle: {},
  formItemFlag: true,
  widgetList: [],
  defaultValue: '',
  value: 0,
  options: {
    label: 'InputNumber',
    fieldName: '',
    min: 0,
    max: 100,
    precision: 0,
    step: 1,
    disabled: false,
    suffix: '',
  },
  actions: [],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  {
    min: '最小值',
    type: 'number',
    isBaseProp: true,
  },
  {
    max: '最大值',
    type: 'number',
    isBaseProp: true,
  },
  {
    max: '数值精度',
    type: 'number',
    isBaseProp: true,
  },
  {
    step: '步长',
    type: 'number',
    isBaseProp: true,
  },
  {
    disabled: '禁用',
    type: 'switch',
    isBaseProp: true,
  },
  {
    suffix: '尾部内容',
    isBaseProp: true,
  },
]
