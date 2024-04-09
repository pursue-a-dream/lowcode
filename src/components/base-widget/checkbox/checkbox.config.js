// 组件配置
export const widgetConfig = {
  type: 'Checkbox',
  name: 'checkbox组件',
  hasStyleConfig: true,
  activeStyle: {},
  formItemFlag: true,
  widgetList: [],
  defaultValue: '',
  value: [],
  options: {
    label: 'checkbox',
    fieldName: '',
    isRequired: false,
    showType: 'checkbox',
    checkboxArr: [
      {
        val: 1,
        label: '选项1',
        disabled: false,
      },
      { val: 2, label: '选项2' },
    ],
    // customClass: '', //自定义css类名
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
      { label: 'checkbox', val: 'checkbox' },
      { label: '按钮', val: 'button' },
    ],
  },
  {
    checkboxArr: '选项组数据',
    isBaseProp: true,
    type: 'dataSource',
  },
]
