// 组件配置
export const widgetConfig = {
  type: 'radio',
  name: 'radio组件',
  hasStyleConfig: true,
  activeStyle: {},
  formItemFlag: true,
  widgetList: [],
  defaultValue: '',
  value: '',
  options: {
    label: 'radio',
    fieldName: '',
    isRequired: false,
    showType: 'radio',
    radioArr: [
      {
        val: 1,
        label: '选项1',
      },
      { val: 2, label: '选项2' },
    ],
    customClass: '', //自定义css类名
  },
  actions: [],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  {
    showType: '展示类型',
    isBaseProp: true,
    type: 'select',
    optionArr: [
      { label: 'radio', val: 'radio' },
      { label: '按钮', val: 'button' },
    ],
  },
  {
    radioArr: '选项组数据',
    isBaseProp: true,
    type: 'dataSource',
  },
]
