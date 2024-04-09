// 组件配置
export const widgetConfig = {
  type: 'table-column',
  name: 't-col容器',
  notInWidgetPanel: true,
  category: 'container',
  widgetList: [],
  options: {
    label: 'table-column',
    prop: 'prop',
    width: '',
    showType: 'normal',
    statusMap: {
      // 测试数据
      1: { color: '#83cd5e', label: '成功' },
    },
    filterArr: {
      1: { text: '公司', type: 'warning' },
    },
  },
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  {
    showType: '表格类型',
    isBaseProp: true,
    type: 'select',
    optionArr: [
      { label: '默认', val: 'normal' },
      { label: '时间戳', val: 'time' },
      { label: '状态映射', val: 'statusMap' },
      { label: '标签筛选', val: 'filterArr' },
    ],
  },
  {
    statusMap: '状态映射',
    isBaseProp: true,
    type: 'dataSource',
    show: widgetOption => {
      return widgetOption.showType === 'statusMap'
    },
  },
  {
    filterArr: '标签筛选',
    isBaseProp: true,
    type: 'dataSource',
    show: widgetOption => {
      return widgetOption.showType === 'filterArr'
    },
  },
]
