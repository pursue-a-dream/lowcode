// 组件配置
export const widgetConfig = {
  type: 'select',
  name: 'select组件',
  hasStyleConfig: true,
  activeStyle: {},
  formItemFlag: true,
  widgetList: [],
  defaultValue: '',
  value: '',
  options: {
    label: 'select',
    fieldName: '',
    isRequired: false,
    multiple: false,
    disabled: false,
    readonly: false,
    valueKey: '',
    size: '',
    clear: false,
    multipleClearable: false,
    collapseTags: false,
    multipleLimit: 0,
    multipleNowrap: false,
    maxlength: 200,
    placeholder: '请选择',
    filterable: false,
    selectOptions: [
      {
        value: 'Beijing',
        label: '北京',
      },
      {
        value: 'Shanghai',
        label: '上海',
      },
      {
        value: 'Nanjing',
        label: '南京',
      },
    ],
  },
  actions: [],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
