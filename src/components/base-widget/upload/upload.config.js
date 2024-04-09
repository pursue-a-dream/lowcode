// 组件配置
export const widgetConfig = {
  type: 'upload',
  name: 'upload组件',
  hasStyleConfig: true,
  activeStyle: {},
  formItemFlag: true,
  defaultValue: '',
  value: '',
  options: {
    label: 'upload',
    fieldName: '',
    isRequired: false,
    accept: '',
    slotContent: '',
    showFileList: true,
    limit: 5,
    drag: false,
    dragTitleDesc: '点击或将文件拖拽到这里上传',
    dragContentDesc: '支持拓展名',
  },
  actions: [],
  eventArr: [],
}
// 配置组件属性面板的fromItem
export const widgetPropsFromItemArr = [
  {
    showFileList: '展示上传列表',
    isBaseProp: true,
    type: 'switch',
  },
  {
    accept: '接受上传文件类型',
    isBaseProp: true,
  },
  {
    slotContent: '插槽提示',
    isBaseProp: true,
    show: formData => {
      return !formData.drag
    },
  },
  {
    drag: '开启拖拽上传',
    isBaseProp: true,
    type: 'switch',
  },
  {
    dragTitleDesc: '标题描述',
    isBaseProp: true,
    show: formData => {
      return formData.drag
    },
  },
  {
    dragContentDesc: '内容描述',
    isBaseProp: true,
    show: formData => {
      return formData.drag
    },
  },
]
