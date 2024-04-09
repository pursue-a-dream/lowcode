// 组件配置
export const widgetConfig = {
  type: 'date',
  name: '日期组件',
  hasStyleConfig: true,
  activeStyle: {},
  formItemFlag: true,
  widgetList: [],
  defaultValue: '',
  value: new Date(),
  options: {
    label: 'date',
    isRequired: false,
    datetype: 'year',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
  },
  actions: [],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  {
    datetype: '日期类型',
    isBaseProp: true,
    type: 'select',
    optionArr: [
      { label: '年', val: 'year' },
      { label: '月', val: 'month' },
      { label: '日', val: 'date' },
      // { label: '多日期', val: 'dates' },
      { label: '周', val: 'week' },
      { label: '时刻选择', val: 'datetime' },
      { label: '日期范围选择', val: 'daterange' },
      { label: '时间范围选择', val: 'datetimerange' },
    ],
  },
  // {
  //   startPlaceholder: '日期类型',
  //   isBaseProp: true,
  // },
  // {
  //   endPlaceholder: '日期类型',
  //   isBaseProp: true,
  // },
]
