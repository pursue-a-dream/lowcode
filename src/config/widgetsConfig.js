import { deepClone, generateId, getDefaultFormConfig, overwriteObj } from '@/utils/util.js'
export const widgetTypeToFormItemArrMap = {}
const iconOptions = [
  'h-icon-add',
  'h-icon-delete',
  'h-icon-details',
  'h-icon-copy',
  'h-icon-edit',
  'h-icon-export',
  'h-icon-filter',
  'h-icon-import',
  'h-icon-search',
  'h-icon-reset',
  'h-icon-refresh',
]
export const defaultStyleConfig = {
  margin: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  padding: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  font: {
    size: 14,
    weight: 400,
  },
  color: '',
  lineHeight: 15,
  width: '',
  height: '',
}
// 此配置项是option每个字段对应的中文名
export const optionNameMap = {
  name: {
    label: '唯一标识',
    desc: '请谨慎修改，此操作会影响生成的代码',
  },
  paneLabel: 'pane标签',
  label: '标签',
  customClass: '自定义CSS样式',
  prop: '属性',
  type: '显示类型',
  displayStyle: '显示样式',
  size: {
    label: '尺寸/大小',
    inputDesc: '输入框尺寸，只在 type!="textarea" 时有效',
  },
  plain: '是否朴素按钮',
  radius: '是否圆角',
  loading: '是否加载',
  visible: '是否可见',
  inline: '行内模式',
  title: '标题',
  area: {
    label: '组件区域',
    desc: '指定宽度或同时指定宽高，使用了该参数则 size 自动失效；指定了高度时，内容超出区域会自动美化滚动条,传参为数字或数组',
  },
  modal: '是否需要遮罩层',
  modalAppendToBody: {
    label: '遮罩层插入',
    desc: '遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上',
  },
  appendToBody: {
    label: 'Dialog插入至body',
    desc: 'Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true',
  },
  showClose: '显示关闭按钮',
  labelWidth: {
    label: '标签宽度',
    desc: '表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值',
  },
  maxlength: '最大输入长度',
  minlength: '最小输入长度',
  placeholder: '输入框占位文本',
  disabled: '是否禁用',
  search: '是否创建搜索图标	',
  prefixIcon: '输入框头部图标',
  suffixIcon: '输入框尾部图标',
  icon: '图标',
  rows: {
    label: '输入框行数',
    desc: '输入框行数，只对 type="textarea" 有效',
  },
  autosize: '自适应高度',
  readonly: '只读',
  clearable: '增加删除图标',
  tips: '提示信息',
  tipsPlacement: '提示信息位置',
  labelPosition: '标签位置',
  fieldName: '字段名',
  childWidthPercent: {
    label: '子元素宽度',
    desc: '仅当form为行内模式时有效',
  },
  width: '宽度',
  message: '信息',
  showCancelButton: '显示取消按钮',
  showConfirmButton: '显示确定按钮',
  cancelButtonText: '取消的文本',
  confirmButtonText: '确定的文本',
  multiple: '是否多选',
  isRequired: {
    label: '是否必选',
    desc: '此项仅在form表单提交时有效',
  },
  valueKey: {
    label: '键名',
    desc: '作为 value 唯一标识的键名，绑定值为对象类型时必填',
  },
  clear: '单选可清空',
  multipleClearable: '多选可清空',
  collapseTags: {
    label: '多选文字展示',
    desc: '多选时是否将选中值按文字的形式展示',
  },
  multipleLimit: {
    label: '多选最大可选',
    desc: '多选时用户最多可以选择的项目数，为 0 则不限制',
  },
  multipleNowrap: {
    label: '多选截断',
    desc: '多选时选中项过多，超过一行时不进行换行，多出来的内容截断处理',
  },
  maxWidth: {
    label: '最大宽度',
    desc: '下拉框的最大宽度,要大于显示框的宽度,否则会失效',
  },
  filterable: '是否可搜索',
  closable: '标签是否可关闭',
  addable: '标签是否可增加',
  editable: '标签是否同时可增加和关闭',
  tabPosition: '选项卡所在位置',
  labelIcon: 'tab图标',
  labelMaxWidth: '最大宽度',
  fixWidth: '固定宽度',
  wrapperClosable: '点击遮罩层可关闭',
  hasFooter: '包含底部',
  emptyText: '内容为空文本',
  defaultExpandAll: '展开所有',
  showCheckbox: '节点可否勾选',
  nodeKey: '节点key',
}
// 此配置是每个组件的高级配置字段
export const advancedPropertiesNameMap = {
  addBtnName: '添加按钮名称',
  cancelBtnName: '取消按钮名称',
  hasAddBtnName: '展示添加按钮',
  hasCancelBtnName: '展示取消按钮',
  dataSource: '数据源',
  propsConf: '属性配置',
  selectOptions: '下拉数据',
  tableLineKey: '行key',
  reloadParameter: {
    label: '请求传参',
    desc: 'Table组件发送请求时携带的参数',
  },
}
// 根据optionName映射不同的formItem类型
export const optionNameToFormItem = {
  type: {
    type: 'select',
    buttonOptions: ['primary', 'success', 'warning', 'danger', 'info', 'text', 'link', 'ghost'],
    inputOptions: ['text', 'textarea'],
    'message-boxOptions': ['success', 'info', 'warning', 'question', 'error'],
    tabsOptions: ['card'], //隐藏 'border-card' 此模式有bug
  },
  icon: {
    type: 'select',
    buttonOptions: iconOptions,
  },
  labelIcon: {
    type: 'select',
    'tab-paneOptions': iconOptions,
  },
  size: {
    type: 'select',
    buttonOptions: ['large', 'small', 'mini'],
    dialogOptions: ['tiny', 'small', 'large', 'full'],
    inputOptions: ['large', 'small', 'mini'],
    'message-boxOptions': ['small', 'middle', 'large'],
    selectOptions: ['large', 'small', 'mini'],
    tabsOptions: ['small', 'middle', 'large'],
  },
  displayStyle: {
    type: 'radio',
    buttonOptions: [
      { label: '行内', val: 'inline-block' },
      { label: '块', val: 'block' },
    ],
  },
  labelPosition: {
    type: 'select',
    formOptions: ['right', 'left', 'top'],
  },
  tipsPlacement: {
    type: 'select',
    inputOptions: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
    ipOptions: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
  },
  area: { type: 'input' },
  dataSource: {
    type: 'dataSource',
  },
  selectOptions: {
    type: 'dataSource',
  },
  propsConf: { type: 'dataSource' },
  reloadParameter: {
    type: 'parameter',
  },
  tabPosition: {
    type: 'select',
    tabsOptions: ['top', 'right', 'bottom', 'left'],
  },
}
// 基础组件
/**
 * 关于option映射form表单编辑项的关系
 * 1、如果在optionNameToFormItem里有配置，采用optionNameToFormItem中的配置
 * 2、没有则字符串映射输入框  Boolean映射切换按钮
 */
const baseConfig = require.context('@/components/base-widget', true, /\w+\.config.js$/)
const baseConfigArr = []
baseConfig.keys().map(fileName => {
  const { widgetConfig, widgetPropsFromItemArr } = baseConfig(fileName)
  baseConfigArr.push(widgetConfig)
  widgetPropsFromItemArr && (widgetTypeToFormItemArrMap[widgetConfig.type] = widgetPropsFromItemArr)
})
export var basicFields = [...baseConfigArr]
// 容器组件
// 读取container-widget关于容器组件的配置，合并本地配置
const containerConfig = require.context('@/components/container-widget', true, /\w+\.config.js$/)
const containerConfigArr = []
containerConfig.keys().map(fileName => {
  const { widgetConfig, widgetPropsFromItemArr } = containerConfig(fileName)
  containerConfigArr.push(widgetConfig)
  widgetPropsFromItemArr && (widgetTypeToFormItemArrMap[widgetConfig.type] = widgetPropsFromItemArr)
})
export var containers = [...containerConfigArr]
// 全局ACTIONS事件
export const globalAction = [
  {
    label: '路由跳转',
    value: 'router',
  },
  {
    label: '发送请求',
    value: 'request',
  },
  {
    label: '打开Dialog 对话框',
    value: 'dialog',
  },
  {
    label: '打开侧边弹框',
    value: 'drawer',
  },
  {
    label: 'Message 消息提示',
    value: 'message-box',
  },
]
// 事件触发组件比如 dialog弹框、message弹框、侧边弹框等，这里的组件不展示在组件库，只能通过事件绑定添加
export const eventTriggeredWidget = {
  creatDialog: eventId => {
    return {
      type: 'dialog',
      formItemFlag: true,
      name: 'dialog组件',
      id: 'dialog' + eventId,
      widgetList: [],
      options: {
        name: 'dialog' + eventId,
        visible: true,
        title: 'dialog标题',
        area: 480,
        modal: false,
        modalAppendToBody: true,
        appendToBody: false,
        showClose: true,
        customClass: '',
        addBtnName: '确 定',
        cancelBtnName: '取 消',
        hasAddBtnName: true,
        hasCancelBtnName: true,
      },
      actions: [
        { label: '点击确定回调', value: 'dialogConfirmClick' },
        { label: '关闭回调', value: 'dialogCancelClick' },
      ],
      triggerEvent: [{ label: '关闭dailog', value: 'dialogClose' }],
      eventArr: [],
    }
  },
  creatMessage: eventId => {
    let widget = getWidgetByType('message-box', eventId)
    return {
      id: 'message-box' + eventId,
      ...widget,
    }
  },
  creatDrawer: eventId => {
    return {
      type: 'drawer',
      formItemFlag: true,
      name: 'drawer组件',
      id: 'drawer' + eventId,
      widgetList: [],
      options: {
        // label: 'drawer' + eventId,
        name: 'drawer' + eventId,
        visible: true,
        title: 'drawer标题',
        modal: false,
        modalAppendToBody: false,
        appendToBody: false,
        showClose: true,
        customClass: '',
        wrapperClosable: false,
        addBtnName: '确 定',
        cancelBtnName: '取 消',
        hasAddBtnName: true,
        hasCancelBtnName: true,
        hasFooter: true,
      },
      actions: [
        { label: '点击确定回调', value: 'drawerConfirmClick' },
        { label: '关闭回调', value: 'drawerCancelClick' },
      ],
      triggerEvent: [{ label: '关闭drawer', value: 'drawerClose' }],
      eventArr: [],
    }
  },
}
// 公共函数
function getWidgetByType(type, eventId) {
  const allWidgets = [...basicFields, ...containers]
  let getWidget = allWidgets.filter(widget => {
    return widget.type === type
  })[0]
  getWidget.options.label = type + eventId
  getWidget.options.name = type + eventId
  return getWidget
}
// 通过组件类型创建组件
export function creatWidgetByWidgetOption(type, config = {}, WidgetOption) {
  let getWidget = { ...WidgetOption }
  const newWidget = { ...deepClone(getWidget) }
  let id = type + generateId()
  newWidget?.options && (newWidget.options = { ...getWidget.options, name: id })
  Object.keys(config).forEach(key => {
    if (newWidget[key]) {
      if (Array.isArray(newWidget[key])) {
        newWidget[key] = [...newWidget[key], ...config[key]]
      } else if (typeof newWidget[key] === 'object') {
        newWidget[key] = { ...newWidget[key], ...config[key] }
      }
    } else {
      newWidget[key] = config[key]
    }
  })
  newWidget.id = id
  return newWidget
}

