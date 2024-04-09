// 组件配置
export const widgetConfig = {
  type: 'tree',
  name: 'tree组件',
  widgetList: [],
  hasStyleConfig: true,
  widgetProvideData: {},
  activeStyle: {},
  options: {
    name: 'tree',
    emptyText: '',
    defaultExpandAll: false,
    showCheckbox: false,
    nodeKey: 'id',
    dataSource: [
      {
        id: 1,
        label: '一级 1',
        children: [
          {
            id: 2,
            label: '二级 1-1',
            children: [{ id: 3, label: '三级 1-1-1' }],
          },
        ],
      },
      {
        id: 5,
        label: '一级 2',
      },
    ],
    propsConf: {
      children: 'children',
      label: 'label',
      disabled: () => {
        return false
      },
    },
  },
  actions: [{ label: '节点点击', value: 'nodeClick' }],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
