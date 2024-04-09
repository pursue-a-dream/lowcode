const path = require('path')
const fs = require('fs')
const pageDesigner = require('./test.json')
const uppercamelcase = require('uppercamelcase') // 字符串-风格的转驼峰
const FileSaver = require('file-saver')
const widgetMap = {}
// 生成method的辅助对象
const eventArrMap = {}
const triggerEventMap = {}
const methodNameMap = {}
const widgetTem = []
const widgetData = []
const widgetMethod = []
const mapActions = {}

const mapStyle = []
function compileActiveStyle(activeStyle) {
  const {
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom,
    width,
    height,
    fontSize,
    fontWeight,
    lineHeight,
  } = activeStyle
  const widthStr = width ? `width: ${width};` : ''
  const heightStr = height ? `height: ${height};` : ''
  const marginStr = marginTop ? `margin: ${marginTop} ${marginLeft} ${marginBottom} ${marginRight};` : ''
  const paddingStr = paddingTop
    ? `padding: ${paddingTop} ${paddingLeft} ${paddingBottom} ${paddingRight};`
    : ''
  // ${marginStr}${paddingStr}
  return `{
    ${widthStr}
    ${heightStr}
  }`
}
// 处理方法命名
function dealFunName(v1, v2, eventId) {
  if (v2 === 'formSubmit') {
    return v1 + 'Submit'
  }
  if (v2 === 'formReset') {
    return v1 + 'Reset'
  }
  if (v2 === 'drawer' || v2 === 'dialog') {
    return widgetMap[v2 + eventId].options.name + 'Show'
  }
  return v1 + v2
}
const widgetTemplates = {
  form: ctn => {
    const { name, inline } = ctn.options
    const inlineStr = inline ? ':inline="true"' : ':item-span="24"'
    const tem = `
    <common-form
      ref="${name}"
      class="${name}"
      :form-data="${name}Data"
      :form-item-arr="${name}ItemArr"
      ${inlineStr}
    >
    ${buildWidgetList(ctn)}
    </common-form>
    `
    const formData = {}
    const formItemArr = []
    ctn.widgetList.map(item => {
      if (item.formItemFlag) {
        const { fieldName, label, selectOptions, isRequired } = item.options
        formData[fieldName] = item.value
        const formItem = {
          [fieldName]: label,
          type: item.type === 'date' ? 'timeRange' : item.type,
        }
        if (item.type === 'select') {
          formItem['optionArr'] = selectOptions
        }
        isRequired && (formItem['isRequired'] = true)
        formItemArr.push(formItem)
        delete widgetMap[item.id]
      }
    })
    const data = `
       ${name}Data: ${JSON.stringify(formData)},
       ${name}ItemArr: ${JSON.stringify(formItemArr)}
    `
    widgetData.push(data)
    return tem
  },
  table: ctn => {
    const { name } = ctn.options
    const tem = `
    <common-table
      ref="table"
      :fetch="${name}Fetch"
      :table-column-arr="${name}ColumnArr"
      :table-loading="${name}Loading"
      @table-select="
        tableSelect => {
          ${name}SelectArr = tableSelect
        }
      "
    >
    ${buildWidgetList(ctn)}
    </common-table>
    `
    const tableColumnArr = []
    ctn.widgetList.map((item, index) => {
      if (item.type === 'table-column' && item.widgetList.length === 0) {
        const { label, prop } = item.options
        const formItem = {
          [prop]: label,
        }
        index === 0 && (formItem['hasSelect'] = true)
        label.includes('时间') && (formItem['type'] = 'time')
        tableColumnArr.push(formItem)
        delete widgetMap[item.id]
      }
    })
    const data = `
       ${name}Loading: false,
       ${name}SelectArr: [],
       ${name}ColumnArr: ${JSON.stringify(tableColumnArr)}
    `
    widgetData.push(data)
    return tem
  },
  'table-column': ctn => {
    const label = ctn.options.label
    return `
    <el-table-column label="${label}">
        <template slot-scope="scope">
        ${buildWidgetList(ctn)}
        </template>
    </el-table-column> 
    `
  },
  tabs: ctn => {
    const { name } = ctn.options
    const tem = `
    <el-tabs v-model="${name}ActiveName">
      ${buildWidgetList(ctn)}
    </el-tabs>
    `
    const data = `
       ${name}ActiveName: ${ctn.widgetList[0] ? ctn.widgetList[0].options.name : ''}
    `
    widgetData.push(data)
    return tem
  },
  'tab-pane': ctn => {
    const { paneLabel: label, name, labelIcon } = ctn.options
    const labelStr = label ? `label="${label}"` : ''
    const labelIconStr = labelIcon ? `label-icon="${labelIcon}"` : ''
    return `
    <el-tab-pane ${labelIconStr} ${labelStr} name="${name}">
    ${buildWidgetList(ctn)}
    </el-tab-pane>
    `
  },
  drawer: ctn => {
    const { title, showClose, hasFooter, hasAddBtnName, addBtnName, hasCancelBtnName, cancelBtnName, name } =
      ctn.options
    const showCloseStr = showClose ? 'show-close' : ''
    const hasFooterStr = !hasFooter ? ':hasFooter="false"' : ''
    const clickEventArr = ctn.eventArr.filter(item => item.effectAciton == 'drawerConfirmClick')
    const drawerCancelArr = ctn.eventArr.filter(item => item.effectAciton == 'drawerCancelClick')
    let drawerCancelStr = ''
    if (drawerCancelArr.length > 0) {
      const [v1, v2] = drawerCancelArr[0].toduAcitonArr[0].value
      drawerCancelStr = `@close="${dealFunName(v1, v2)}"`
    }
    let drawerConfirmMethodName = name + 'Confirm'
    if (clickEventArr[0] && clickEventArr[0].toduAcitonArr[0]) {
      const [v1, v2] = clickEventArr[0].toduAcitonArr[0].value
      drawerConfirmMethodName = dealFunName(v1, v2)
    }
    const footerStr = hasFooter
      ? `
    <span slot="footer" class="drawerFooter">
      ${
        hasAddBtnName
          ? `<el-button
          type="primary"
          @click.native.stop="${drawerConfirmMethodName}"
          >${addBtnName}</el-button
        >`
          : ''
      }
      ${
        hasCancelBtnName
          ? `<el-button
          @click.native.stop="()=>{${name}Visible = false}"
          >${cancelBtnName}</el-button
        >`
          : ''
      }
    </span>`
      : ''
    const tem = `
    <h-drawer ref="${name}" ${showCloseStr} ${hasFooterStr} :visible.sync="${name}Visible" ${drawerCancelStr} @confirmDrawer="${drawerConfirmMethodName}">
      <div slot="title">${title}</div>
      ${buildWidgetList(ctn)}
    </h-drawer>
    `
    // ${footerStr} 暂时不处理
    const data = `
    ${name}Visible: false
 `
    widgetData.push(data)
    return tem
  },
  dialog: ctn => {
    const { title, hasAddBtnName, addBtnName, hasCancelBtnName, cancelBtnName, name } = ctn.options
    const clickEventArr = ctn.eventArr.filter(item => item.effectAciton == 'dialogConfirmClick')
    const cancelEvent = ctn.eventArr.filter(item => item.effectAciton == 'dialogCancelClick')
    let closeStr = ''
    if (cancelEvent.length > 0) {
      const [v1, v2] = cancelEvent[0].toduAcitonArr[0].value
      closeStr = `@close="${dealFunName(v1, v2)}"`
    }
    const [v1, v2] = clickEventArr[0].toduAcitonArr[0].value
    const footerStr = `
    <span slot="footer">
      ${
        hasAddBtnName
          ? `<el-button
          type="primary"
          @click.native.stop="${dealFunName(v1, v2)}"
          >${addBtnName}</el-button
        >`
          : ''
      }
      ${
        hasCancelBtnName
          ? `<el-button
          @click.native.stop="()=>{${name}Visible = false}"
          >${cancelBtnName}</el-button
        >`
          : ''
      }
    </span>`
    const tem = `
    <el-dialog
      title="${title}"
      :visible.sync="${name}Visible"
      size="tiny"
      ${closeStr}
    >
      ${buildWidgetList(ctn)}
      ${footerStr}
    </el-dialog>
    `
    const data = `
    ${name}Visible: false
 `
    widgetData.push(data)
    return tem
  },
  tree: ctn => {
    const { defaultExpandAll, showCheckbox, name, nodeKey, dataSource, propsConf } = ctn.options
    const defaultExpandAllStr = defaultExpandAll ? 'defaultExpandAll' : ''
    const showCheckboxStr = showCheckbox ? 'show-checkbox' : ''
    const tem = `
    <el-input v-model="${name}FilterText" placeholder="输入关键字进行过滤"></el-input>
    <el-tree
      ref="${name}"
      :data="${name}DataSource"
      :props="${name}Props"
      node-key="${nodeKey}"
      ${defaultExpandAllStr}
      ${showCheckboxStr}
      :filter-node-method="${name}FilterNode"
    ></el-tree>
    `
    const data = `
    ${name}DataSource: ${JSON.stringify(dataSource)},
    ${name}Props: ${JSON.stringify(propsConf)},
    ${name}FilterText: ''
 `
    widgetData.push(data)
    widgetMethod.push(`
    ${name}FilterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
    `)
    return tem
  },
  'left-right': ctn => {
    return `<div class="leftRightContent" style="display: flex;">
    ${buildWidgetList(ctn)}
    </div>
    `
  },
  operate: ctn => {
    const { name } = ctn.options
    mapStyle.push(`
    .${name}Content ${compileActiveStyle(ctn.activeStyle)}
    `)
    return `<div class="${name}Content">
    ${buildWidgetList(ctn)}
    </div>
    `
  },
  input: ctn => {
    return `<el-input ></el-input>`
  },
  button: ctn => {
    const { type, size, icon, label } = ctn.options
    const typeStr = type ? `type="${type}"` : ''
    const sizeStr = size ? `size="${size}"` : ''
    const iconStr = icon ? `icon="${icon}"` : ''
    const clickEventArr = ctn.eventArr.filter(item => item.effectAciton == 'click')
    let clickStr = ''
    if (clickEventArr.length > 0) {
      const toduAcitonArr = clickEventArr[0].toduAcitonArr[0]
      const [v1, v2] = toduAcitonArr.value
      if (v2 === 'tableDelete') {
        // table行内删除
        const parentWidget = hasOneTypeParent(ctn, 'table')
        if (parentWidget) {
          clickStr = `@click="${v1 + 'Delete'}(scope.row)"`
        } else {
          // table外批量删除 添加提示信息及disable规则
          clickStr = `@click="${v1 + 'Delete'}Batch"`
          const disabledStr = `:disabled="${v1}SelectArr.length == 0"`
          return `${`<el-button ${typeStr} ${sizeStr} ${iconStr} ${disabledStr} ${clickStr}>${label}</el-button>`}`
        }
      } else if (v2 === 'tableReload') {
        clickStr = `@click="${v1 + 'Reload'}"`
      } else if (v2 === 'formSubmit') {
        clickStr = `@click="${v1 + 'Submit'}"`
      } else if (v2 === 'formReset') {
        clickStr = `@click="${v1 + 'Reset'}"`
      } else if (v2 === 'drawer' || v2 === 'dialog') {
        clickStr = `@click="${dealFunName(v1, v2, clickEventArr[0].eventId)}"`
      } else if (v2 === 'message-box') {
        clickStr = `@click="messageBox${clickEventArr[0].eventId}Show"`
      } else if (v2 === 'request') {
        clickStr = `@click="request${clickEventArr[0].eventId}"`
      } else {
        clickStr = `@click="${v1 + v2}"`
      }
    }
    return `${`<el-button ${typeStr} ${sizeStr} ${iconStr} ${clickStr}>${label}</el-button>`}`
  },
}
function buildWidget(widget) {
  return widgetTemplates[widget.type] ? widgetTemplates[widget.type](widget) : null
}
// 首先需对组件进行过滤，有些子组件是作为父组件的配置项存在
function buildWidgetList({ widgetList, type }) {
  if (!widgetList || widgetList.length === 0) {
    return ''
  }
  return widgetList
    .filter(cw => {
      if (type == 'form') {
        return !cw.formItemFlag
      }
      if (type == 'table') {
        return !(cw.type === 'table-column' && cw.widgetList.length === 0)
      }
      return true
    })
    .map(cw => {
      return buildWidget(cw)
    })
    .join('')
}
// 根据paramsList生成传参的字符串
function getParamsStr(paramsList) {
  if (paramsList.length === 0) {
    return '...{}'
  }
  const arr = []
  paramsList.map(list => {
    !Array.isArray(list) && (list = list.value)
    const [v1, v2] = list
    const widget = widgetMap[v1]
    if (v2 === 'formData') {
      arr.push(`...this.${widget.options.name}Data`)
    } else if (v2 === 'checkedRowKeys') {
      // arr.push(`{ids:this.${widget.options.name}SelectArr}`)
      arr.push(`this.${widget.options.name}SelectArr`)
    } else {
      arr.push('...{}')
    }
  })
  return arr.join('')
}
// 生成方法
function generateMethod() {
  const eventArr = Object.keys(eventArrMap)
  eventArr.map(key => {
    let curWidget = {}
    const getToduAcitonStr = (action, toduAcitonArr, index) => {
      if (!toduAcitonArr[index]) {
        return ''
      }
      const [v1, v2] = toduAcitonArr[index].value
      const name = widgetMap[v2 + action.eventId] ? widgetMap[v2 + action.eventId].options.name : ''
      if (v2 === 'tableDelete') {
        // table行内删除
        const parentWidget = hasOneTypeParent(curWidget, 'table')
        const { reqUrl } = triggerEventMap[v1 + v2]
        const reqName = uppercamelcase(reqUrl.split('/').join('-'))
        mapActions[reqName] = triggerEventMap[v1 + v2]
        if (parentWidget) {
          return `
            ${v1 + 'Delete'}(row) {
              this.$confirm('确定删除吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'question',
                onConfirm: () => {
                  this.${reqName}([row.id]).then(res => {
                    if (res.code === 1) {
                      res.msg && this.$message.success(res.msg)
                      this.$refs.${parentWidget.options.name}.reload()
                    }
                  })
                },
              })
            }`
        } else {
          // table外批量删除
          return `
            ${v1 + 'Delete'}Batch() {
              if (this.${v1}SelectArr.length > 0) {
                this.$confirm('确定删除所选数据吗？', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'question',
                  onConfirm: () => {
                    const ids = this.${v1}SelectArr.map(item => item.id)
                    this.${reqName}(ids).then(res => {
                      if (res.code === 1) {
                        res.msg && this.$message.success(res.msg)
                        this.$refs.${widgetMap[v1].options.name}.reload()
                      }
                    })
                  },
                })
              } else {
                this.$message.warning('请在table中选择要删除的数据')
              }
            }`
        }
      } else if (v2 === 'tableReload') {
        if (!methodNameMap[v1 + 'Fetch']) {
          const { reqUrl, paramsList } = triggerEventMap[v1 + v2]
          let reqName = uppercamelcase(reqUrl.split('/').join('-'))
          const paramsStr = getParamsStr(paramsList)
          mapActions[reqName] = triggerEventMap[v1 + v2]
          widgetMethod.push(`
            ${v1 + 'Fetch'}(url, ps = 20, pn = 1) {
              this.${v1}Loading = true
              return this.${reqName}({
                payload: {
                  ${paramsStr},
                  page: {
                    pageNumber: pn - 1,
                    pageSize: ps,
                  },
                },
              })
                .then(
                  res =>
                    new Promise(resolve => {
                      resolve(res)
                    }),
                )
                .finally(() => {
                  this.${v1}Loading = false
                })
            }
          `)
        }
        return `
            ${index === 0 ? ` ${v1 + 'Reload'}() {` : ''}
              this.$refs.${widgetMap[v1].options.name}.reload()
            ${index === 0 ? ' }' : ''}`
      } else if (v2 === 'formReset') {
        return `
            ${v1 + 'Reset'}() {
              this.$refs.${v1}.resetFields()
              ${getToduAcitonStr(action, toduAcitonArr, index + 1)}
            }`
      } else if (v2 === 'drawer' || v2 === 'dialog') {
        return `
            ${dealFunName(v1, v2, action.eventId)}() {
              this.${name}Visible = true
              ${getToduAcitonStr(action, toduAcitonArr, index + 1)}
            }`
      } else if (v2 === 'message-box') {
        let messageLayer = pageDesigner.layers.filter(item => {
          return item.id == item.type + action.eventId
        })[0]
        const { title, message, type, size } = messageLayer.options
        // 下面的代码主要是防止处理layers中message-box的eventArr
        delete eventArrMap[`message-box${action.eventId}`]
        eventArr.splice(eventArr.indexOf(`message-box${action.eventId}`), 1)
        messageLayer.eventArr[0].toduAcitonArr.splice(0, 0, 1)
        return `
           messageBox${action.eventId}Show() {
              this.$confirm('${title}', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: '${type}',
                size: '${size}',
                message: '${message}'
              })
                .then(() => {
                  ${getToduAcitonStr(messageLayer.eventArr[0], messageLayer.eventArr[0].toduAcitonArr, 1)}
                })
                .catch(() => {
                })
            }`
      } else if (v2 === 'drawerClose' || v2 === 'dialogClose') {
        return index == 0
          ? `
            ${name}Show() {
              this.${name}Visible = false
            }
            ${getToduAcitonStr(action, toduAcitonArr, index + 1)}`
          : `
            this.${v1}Visible = false
            ${getToduAcitonStr(action, toduAcitonArr, index + 1)}
            `
      } else if (v2 === 'formSubmit') {
        const { reqUrl } = triggerEventMap[v1 + v2]
        let reqName = uppercamelcase(reqUrl.split('/').join('-'))
        mapActions[reqName] = triggerEventMap[v1 + v2]
        return `
            ${index === 0 ? ` ${v1 + 'Submit'}() {` : ''}
              this.$refs['${v1}'].validate((valid) => {
                if (valid) {
                  this.${reqName}(this.${v1}Data)
                    .then(res => {
                      if (res.code === 1) {
                        res.msg && this.$message.success(res.msg)
                        ${getToduAcitonStr(action, toduAcitonArr, index + 1)}
                      }
                    })
                    .finally(() => {})
                }
              })
                ${index === 0 ? ' }' : ''}`
      } else if (v2 === 'request') {
        const { reqUrl, paramsList } = toduAcitonArr[index]
        let reqName = uppercamelcase(reqUrl.split('/').join('-'))
        const paramsStr = getParamsStr(paramsList)
        mapActions[reqName] = toduAcitonArr[index]
        return `
            ${v2 + action.eventId}() {
              this.${reqName}(${paramsStr})
                .then(res => {
                  if (res.code === 1) {
                    res.msg && this.$message.success(res.msg)
                  }
                })
                .finally(() => {
                })
            }`
      }
    }
    eventArrMap[key].map(action => {
      curWidget = widgetMap[key]
      const methodStr = getToduAcitonStr(action, action.toduAcitonArr, 0)
      const methodName = methodStr ? methodStr.substring(0, methodStr.indexOf('(')) : ''

      if (!methodNameMap[methodName]) {
        methodNameMap[methodName] = methodStr
        widgetMethod.push(methodStr)
      }
    })
  })
}
//解析生成template模板
function compilePage() {
  pageDesigner.widgetList.forEach(widget => {
    widgetTem.push(buildWidget(widget))
  })
  // 处理layers，如侧边弹框，dialog弹框等
  pageDesigner.layers.forEach(widget => {
    widgetTem.push(buildWidget(widget))
  })
  generateMethod()
  const pageTem = `
  <template>
    <div class="${pageDesigner.name}Content">
    ${widgetTem ? widgetTem.join('\n') : ''}
    </div>
  </template>
  <script>
  import { mapActions } from 'vuex'
    export default {
      components: {},
      props: {},
      data() {
        return {
          ${widgetData.join(',')}
        }
      },
      computed: {},
      watch: {},
      created() {
      },
      mounted() {
      },
      methods: {
        ...mapActions('${pageDesigner.name}', ['${Object.keys(mapActions).join('\', \'')}']),
        ${widgetMethod.join(',')}
      }
    }
  </script>
  <style lang="scss">
  .${pageDesigner.name}Content{
    background-color: #ffffff;
    ${mapStyle.join('')}
  }
  </style>
  `
  return pageTem
}
// 获取event添加的layers的id
function getLayersIdsByEventArr(eventArrMap) {
  let ids = []
  Object.keys(eventArrMap).map(key => {
    eventArrMap[key].map(action => {
      // 此处暂时只处理第一个
      const [v1, v2] = action.toduAcitonArr[0].value
      v1 === 'globalAction' && ids.push(v2 + action.eventId)
    })
  })
  return ids
}
// 对页面配置进行预处理
function dealPageDesigner(pageDesigner) {
  const widgetListMap = (widgetList, parentWidget) => {
    if (!Array.isArray(widgetList) || widgetList.length === 0) {
      return
    }
    widgetList.map(item => {
      widgetMap[item.id] = item
      item.options.name && (widgetMap[item.options.name] = item)
      if (item.eventArr && item.eventArr.length > 0) {
        eventArrMap[item.id] = item.eventArr
      }
      if (item.triggerEvent && item.triggerEvent.length > 0) {
        item.triggerEvent.map(event => {
          triggerEventMap[item.options.name + event.value] = event
        })
      }
      item.parentWidget = parentWidget
      item.widgetList && widgetListMap(item.widgetList, item)
    })
  }
  widgetListMap(pageDesigner.widgetList, null)
  let layersIds = getLayersIdsByEventArr(eventArrMap)
  pageDesigner.layers = pageDesigner.layers.filter(layer => {
    return layersIds.includes(layer.id)
  })
  widgetListMap(pageDesigner.layers)
}
// 是否包含某一类型的父节点，传参当前节点、父节点类型
function hasOneTypeParent(widget, type) {
  if (widget.parentWidget) {
    if (widget.parentWidget.type === type) {
      return widget.parentWidget
    } else {
      return hasOneTypeParent(widget.parentWidget, type)
    }
  } else {
    return false
  }
}

function compileRequest() {
  return `
  import HTTP from '@/commonFun/index.js'
  const BASE_URL = ''
  export default {
    ${Object.keys(mapActions).map(actionKey => {
      const { reqMethod, reqUrl } = mapActions[actionKey]
      return `async ${actionKey}(_, data) 
        {return await HTTP.${reqMethod}(\`\${BASE_URL}/${reqUrl}\`, data)
      }
      `
    })}
  }
    `
}

// fs.writeFileSync(path.join(__dirname, `./test.vue`), compilePage())
const pageName = pageDesigner.name
let pagePath = path.join(__dirname, '/' + pageName)
// dealPageDesigner(pageDesigner)
// if (!fs.existsSync(pagePath)) {
//   fs.mkdirSync(pagePath)
//   fs.mkdirSync(pagePath + '/components')
// }
// fs.writeFileSync(path.join(__dirname, `./${pageName}/${pageName}.vue`), compilePage())

// fs.writeFileSync(path.join(__dirname, `./${pageName}/${pageName}.js`), compileRequest())

export const generatePage = ({ layers, widgetList }) => {
  while (widgetList[0].type === 'commonTem') {
    widgetList = widgetList[0].widgetList
  }
  pageDesigner.layers = JSON.parse(JSON.stringify(layers))
  pageDesigner.widgetList = JSON.parse(JSON.stringify(widgetList))
  if (widgetList[0].type === 'commonTem') {
    pageDesigner.widgetList = JSON.parse(JSON.stringify(widgetList[0].widgetList))
  }
  // FileSaver.saveAs(
  //   new Blob([JSON.stringify([{ widgetList: pageDesigner.widgetList, layers: pageDesigner.layers }])], {
  //     type: 'text/plain;charset=utf-8',
  //   }),
  //   'test.json',
  // )
  dealPageDesigner(pageDesigner)
  var blobPage = new Blob([compilePage()], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blobPage, 'test.vue')

  var blobJs = new Blob([compileRequest()], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blobJs, 'test.js')
}
