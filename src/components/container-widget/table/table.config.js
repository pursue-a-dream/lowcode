import { creatWidgetByWidgetOption } from '@/config/widgetsConfig.js'
import { generateId } from '@/utils/util.js'
import * as tColWidgetConfig from '@/components/base-widget/tableColumn/tableColumn.config.js'
// 组件配置
export const widgetConfig = {
  type: 'table',
  name: 'table容器',
  hasStyleConfig: true,
  activeStyle: {
    padding: '5',
  },
  category: 'container',
  widgetProvideData: {},
  widgetList: [
    creatWidgetByWidgetOption(
      'table-column',
      {
        options: { name: 'table-column', label: '日期', prop: 'date', width: '', showType: 'time' },
      },
      tColWidgetConfig.widgetConfig,
    ),
    creatWidgetByWidgetOption(
      'table-column',
      {
        options: { name: 'table-column', label: '品牌', prop: 'name', width: '' },
      },
      tColWidgetConfig.widgetConfig,
    ),
    creatWidgetByWidgetOption(
      'table-column',
      {
        options: { name: 'table-column', label: '地址', prop: 'address', width: '' },
      },
      tColWidgetConfig.widgetConfig,
    ),
    creatWidgetByWidgetOption(
      'table-column',
      {
        options: { name: 'table-column', label: '标签', prop: 'tag', width: '', showType: 'filterArr' },
      },
      tColWidgetConfig.widgetConfig,
    ),
    creatWidgetByWidgetOption(
      'table-column',
      {
        options: { name: 'table-column', label: '状态', prop: 'status', width: '', showType: 'statusMap' },
      },
      tColWidgetConfig.widgetConfig,
    ),
    creatWidgetByWidgetOption(
      'table-column',
      {
        widgetList: [
          {
            type: 'button',
            name: 'button组件',
            widgetList: [],
            id: 'button' + generateId(),
            options: {
              name: 'button',
              label: '删除',
              size: null,
              displayStyle: 'inline-block',
              type: 'link',
              plain: false,
              radius: false,
              loading: false,
              // customClass: '', //自定义css类名
            },
            actions: [{ label: '单次点击', value: 'click' }],
            eventArr: [],
          },
        ],
        options: {
          name: 'table-column',
          label: '操作',
          prop: '',
          width: '',
        },
      },
      tColWidgetConfig.widgetConfig,
    ),
  ],
  options: {
    name: 'table',
    dataSource: [
      {
        id: generateId(),
        date: 1670911607786,
        name: '海康威视海康威视海康威视',
        address: '杭州市滨江区阡陌路555号',
        tag: 1,
        status: 1,
      },
    ],
    tableLineKey: 'id',
    // reloadParameter: [],
  },
  triggerEvent: [
    { label: '表格请求', value: 'tableReload', reqMethod: 'post', reqUrl: '', paramsList: [] },
    { label: '删除表格数据', value: 'tableDelete', reqMethod: 'post', reqUrl: '' },
    { label: '编辑表格数据', value: 'tableEdit' },
  ],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = []
