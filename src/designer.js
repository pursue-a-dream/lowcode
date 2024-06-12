/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */

import {
  deepClone,
  generateId,
  getDefaultFormConfig,
  overwriteObj,
  getLastNumber,
  transStrFnToFn,
} from '@/utils/util.js'
import { containers, basicFields, eventTriggeredWidget, defaultStyleConfig } from '@/config/widgetsConfig.js'

export function createDesigner(vueInstance) {
  let defaultFormConfig = deepClone(getDefaultFormConfig())

  return {
    widgetList: [],
    layers: [],
    formConfig: { cssCode: '' },
    selectedId: null,
    selectedWidget: null,
    selectedWidgetName: null, //选中组件名称（唯一）
    vueInstance: vueInstance,

    formWidget: null, //表单设计容器

    cssClassList: [], //自定义样式列表
    toduAcitonArr: [], // 触发事件执行数组
    stopToduAcitonArrTodo: false, //停止触发事件执行数组执行事件
    historyData: {
      index: -1, //index: 0,
      maxStep: 20,
      steps: [],
    },
    triggerEventStatus: {},
    initDesigner(resetFormJson) {
      this.widgetList = []
      this.formConfig = deepClone(defaultFormConfig)

      if (!resetFormJson) {
        this.initHistoryData()
      }
    },

    clearDesigner(skipHistoryChange) {
      let emptyWidgetListFlag = this.widgetList.length === 0
      this.widgetList = []
      this.layers = []
      this.selectedId = null
      this.selectedWidgetName = null
      this.selectedWidget = {} //this.selectedWidget = null
      overwriteObj(this.formConfig, defaultFormConfig) //

      if (skipHistoryChange) {
        //什么也不做！！
      } else if (!emptyWidgetListFlag) {
        this.emitHistoryChange()
      } else {
        this.saveCurrentHistoryStep()
      }
    },

    loadPresetCssCode(preCssCode) {
      if (this.formConfig.cssCode === '' && !!preCssCode) {
        this.formConfig.cssCode = preCssCode
      }
    },

    getLayoutType() {
      return this.formConfig.layoutType || 'PC'
    },

    changeLayoutType(newType) {
      this.formConfig.layoutType = newType
    },

    getImportTemplate() {
      return {
        widgetList: [],
        // formConfig: deepClone(this.formConfig)
        formConfig: deepClone(defaultFormConfig),
      }
    },

    loadFormJson(formJson) {
      let modifiedFlag = false

      if (!!formJson && !!formJson.widgetList) {
        this.widgetList = formJson.widgetList
        modifiedFlag = true
      }
      if (!!formJson && !!formJson.formConfig) {
        //this.formConfig = importObj.formConfig
        overwriteObj(
          this.formConfig,
          formJson.formConfig,
        ) /* 用=赋值，会导致inject依赖注入的formConfig属性变成非响应式 */
        modifiedFlag = true
      }

      if (modifiedFlag) {
        this.emitEvent('form-json-imported', []) // 通知其他组件
      }

      return modifiedFlag
    },

    setSelected(selected) {
      if (!selected) {
        this.clearSelected()
        return
      }

      this.selectedWidget = selected
      if (selected.id) {
        this.selectedId = selected.id
        this.selectedWidgetName = selected.options.name
      }
    },

    updateSelectedWidgetNameAndLabel(selectedWidget, newName, newLabel) {
      this.selectedWidgetName = newName
      //selectedWidget.options.name = newName  //此行多余
      if (!!newLabel && Object.keys(selectedWidget.options).indexOf('label') > -1) {
        selectedWidget.options.label = newLabel
      }
    },

    clearSelected() {
      this.selectedId = null
      this.selectedWidgetName = null
      this.selectedWidget = {} //this.selectedWidget = null
    },

    checkWidgetMove(evt) {
      /* Only field widget can be dragged into sub-form */
      if (!!evt.draggedContext && !!evt.draggedContext.element) {
        let wgCategory = evt.draggedContext.element.category
        // let wgType = evt.draggedContext.element.type
        if (evt.to) {
          if (evt.to.className === 'sub-form-table' && wgCategory === 'container') {
            //this.$message.info(this.vueInstance.i18nt('designer.hint.onlyFieldWidgetAcceptable'))
            return false
          }
        }
      }

      return true
    },

    checkFieldMove(evt) {
      if (!!evt.draggedContext && !!evt.draggedContext.element) {
        // let wgCategory = evt.draggedContext.element.category
        let wgType = evt.draggedContext.element.type + ''
        if (evt.to) {
          if (evt.to.className === 'sub-form-table' && wgType === 'slot') {
            //this.$message.info(this.vueInstance.i18nt('designer.hint.onlyFieldWidgetAcceptable'))
            return false
          }
        }
      }

      return true
    },

    /**
     * 追加表格新列
     * @param widget
     */
    appendTableCol(parentWidget, indexOfParentList) {
      let newCol = deepClone(this.getContainerByType('table-column'))
      newCol.id = 'table-column-' + generateId()
      parentWidget.widgetList.splice(indexOfParentList + 1, 0, newCol)
      this.emitHistoryChange()
    },

    /**
     * 插入新的tabPane
     */
    appendTabPane(widget) {
      let newTabPane = deepClone(this.getContainerByType('tab-pane'))
      newTabPane.id = 'tab-pane-' + generateId()
      newTabPane.options.name = 'tab-pane-' + generateId()
      widget.widgetList.push(newTabPane)
      this.emitHistoryChange()
    },
    // 插入新的折叠CollapseItem
    appendCollapseItem(widget) {
      let newCollapseItem = deepClone(this.getContainerByType('collapse-item'))
      newCollapseItem.id = 'collapseitem' + generateId()
      newCollapseItem.options.name = 'collapseitem' + generateId()
      widget.widgetList.push(newCollapseItem)
      this.emitHistoryChange()
    },
    //  添加row的col
    appendRowItem(widget) {
      let newColItem = deepClone(this.getContainerByType('col'))
      newColItem.id = 'col' + generateId()
      newColItem.options.name = 'col' + generateId()
      widget.widgetList.push(newColItem)
      this.emitHistoryChange()
    },
    setPropsOfMergedCols(rowArray, startRowIndex, startColIndex, newColspan, rowspan) {
      for (let i = startRowIndex; i < startRowIndex + rowspan; i++) {
        for (let j = startColIndex; j < startColIndex + newColspan; j++) {
          if (i === startRowIndex && j === startColIndex) {
            rowArray[i].cols[j].options.colspan = newColspan //合并后的主单元格
            continue
          }

          rowArray[i].cols[j].merged = true
          rowArray[i].cols[j].options.colspan = newColspan
          rowArray[i].cols[j].widgetList = []
        }
      }
    },

    setPropsOfMergedRows(rowArray, startRowIndex, startColIndex, colspan, newRowspan) {
      for (let i = startRowIndex; i < startRowIndex + newRowspan; i++) {
        for (let j = startColIndex; j < startColIndex + colspan; j++) {
          if (i === startRowIndex && j === startColIndex) {
            rowArray[i].cols[j].options.rowspan = newRowspan
            continue
          }

          rowArray[i].cols[j].merged = true
          rowArray[i].cols[j].options.rowspan = newRowspan
          rowArray[i].cols[j].widgetList = []
        }
      }
    },

    setPropsOfSplitCol(rowArray, startRowIndex, startColIndex, colspan, rowspan) {
      for (let i = startRowIndex; i < startRowIndex + rowspan; i++) {
        for (let j = startColIndex; j < startColIndex + colspan; j++) {
          rowArray[i].cols[j].merged = false
          rowArray[i].cols[j].options.rowspan = 1
          rowArray[i].cols[j].options.colspan = 1
        }
      }
    },

    setPropsOfSplitRow(rowArray, startRowIndex, startColIndex, colspan, rowspan) {
      for (let i = startRowIndex; i < startRowIndex + rowspan; i++) {
        for (let j = startColIndex; j < startColIndex + colspan; j++) {
          rowArray[i].cols[j].merged = false
          rowArray[i].cols[j].options.rowspan = 1
          rowArray[i].cols[j].options.colspan = 1
        }
      }
    },

    mergeTableCol(rowArray, colArray, curRow, curCol, leftFlag, cellWidget) {
      let mergedColIdx = leftFlag ? curCol : curCol + colArray[curCol].options.colspan

      // let remainedColIdx = !!leftFlag ? curCol - colArray[curCol - 1].options.colspan : curCol
      let remainedColIdx = leftFlag ? curCol - 1 : curCol
      if (leftFlag) {
        //继续向左寻找同行未被合并的第一个单元格
        let tmpColIdx = remainedColIdx
        while (tmpColIdx >= 0) {
          if (!rowArray[curRow].cols[tmpColIdx].merged) {
            remainedColIdx = tmpColIdx
            break
          } else {
            tmpColIdx--
          }
        }
      }

      if (!!colArray[mergedColIdx].widgetList && colArray[mergedColIdx].widgetList.length > 0) {
        //保留widgetList
        if (!colArray[remainedColIdx].widgetList || colArray[remainedColIdx].widgetList.length === 0) {
          colArray[remainedColIdx].widgetList = deepClone(colArray[mergedColIdx].widgetList)
        }
      }

      let newColspan =
        colArray[mergedColIdx].options.colspan * 1 + colArray[remainedColIdx].options.colspan * 1
      this.setPropsOfMergedCols(rowArray, curRow, remainedColIdx, newColspan, cellWidget.options.rowspan)

      this.emitHistoryChange()
    },

    mergeTableWholeRow(rowArray, colArray, rowIndex, colIndex) {
      //需要考虑操作的行存在已合并的单元格！！
      //整行所有单元格行高不一致不可合并！！
      let startRowspan = rowArray[rowIndex].cols[0].options.rowspan
      let unmatchedFlag = false
      for (let i = 1; i < rowArray[rowIndex].cols.length; i++) {
        if (rowArray[rowIndex].cols[i].options.rowspan !== startRowspan) {
          unmatchedFlag = true
          break
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message
          .info
          // this.vueInstance.i18nt('designer.hint.rowspanNotConsistentForMergeEntireRow'),
          ()
        return
      }

      let widgetListCols = colArray.filter(colItem => {
        return !colItem.merged && !!colItem.widgetList && colItem.widgetList.length > 0
      })
      if (!!widgetListCols && widgetListCols.length > 0) {
        //保留widgetList
        if (
          widgetListCols[0].id !== colArray[0].id &&
          (!colArray[0].widgetList || colArray[0].widgetList.length <= 0)
        ) {
          colArray[0].widgetList = deepClone(widgetListCols[0].widgetList)
        }
      }

      this.setPropsOfMergedCols(rowArray, rowIndex, 0, colArray.length, colArray[colIndex].options.rowspan)

      this.emitHistoryChange()
    },

    mergeTableRow(rowArray, curRow, curCol, aboveFlag, cellWidget) {
      let mergedRowIdx = aboveFlag ? curRow : curRow + cellWidget.options.rowspan

      //let remainedRowIdx = !!aboveFlag ? curRow - cellWidget.options.rowspan : curRow
      let remainedRowIdx = aboveFlag ? curRow - 1 : curRow
      if (aboveFlag) {
        //继续向上寻找同列未被合并的第一个单元格
        let tmpRowIdx = remainedRowIdx
        while (tmpRowIdx >= 0) {
          if (!rowArray[tmpRowIdx].cols[curCol].merged) {
            remainedRowIdx = tmpRowIdx
            break
          } else {
            tmpRowIdx--
          }
        }
      }

      if (
        !!rowArray[mergedRowIdx].cols[curCol].widgetList &&
        rowArray[mergedRowIdx].cols[curCol].widgetList.length > 0
      ) {
        //保留widgetList
        if (
          !rowArray[remainedRowIdx].cols[curCol].widgetList ||
          rowArray[remainedRowIdx].cols[curCol].widgetList.length === 0
        ) {
          rowArray[remainedRowIdx].cols[curCol].widgetList = deepClone(
            rowArray[mergedRowIdx].cols[curCol].widgetList,
          )
        }
      }

      let newRowspan =
        rowArray[mergedRowIdx].cols[curCol].options.rowspan * 1 +
        rowArray[remainedRowIdx].cols[curCol].options.rowspan * 1
      this.setPropsOfMergedRows(rowArray, remainedRowIdx, curCol, cellWidget.options.colspan, newRowspan)

      this.emitHistoryChange()
    },

    mergeTableWholeCol(rowArray, colArray, rowIndex, colIndex) {
      //需要考虑操作的列存在已合并的单元格！！
      //整列所有单元格列宽不一致不可合并！！
      let startColspan = rowArray[0].cols[colIndex].options.colspan
      let unmatchedFlag = false
      for (let i = 1; i < rowArray.length; i++) {
        if (rowArray[i].cols[colIndex].options.colspan !== startColspan) {
          unmatchedFlag = true
          break
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message
          .info
          // this.vueInstance.i18nt('designer.hint.colspanNotConsistentForMergeEntireColumn'),
          ()
        return
      }

      let widgetListCols = []
      rowArray.forEach(rowItem => {
        let tempCell = rowItem.cols[colIndex]
        if (!tempCell.merged && !!tempCell.widgetList && tempCell.widgetList.length > 0) {
          widgetListCols.push(tempCell)
        }
      })

      let firstCellOfCol = rowArray[0].cols[colIndex]
      if (!!widgetListCols && widgetListCols.length > 0) {
        //保留widgetList
        if (
          widgetListCols[0].id !== firstCellOfCol.id &&
          (!firstCellOfCol.widgetList || firstCellOfCol.widgetList.length <= 0)
        ) {
          firstCellOfCol.widgetList = deepClone(widgetListCols[0].widgetList)
        }
      }

      this.setPropsOfMergedRows(rowArray, 0, colIndex, firstCellOfCol.options.colspan, rowArray.length)

      this.emitHistoryChange()
    },

    undoMergeTableCol(rowArray, rowIndex, colIndex, colspan, rowspan) {
      this.setPropsOfSplitCol(rowArray, rowIndex, colIndex, colspan, rowspan)

      this.emitHistoryChange()
    },

    undoMergeTableRow(rowArray, rowIndex, colIndex, colspan, rowspan) {
      this.setPropsOfSplitRow(rowArray, rowIndex, colIndex, colspan, rowspan)

      this.emitHistoryChange()
    },

    deleteTableWholeCol(rowArray, colIndex) {
      //需考虑删除的是合并列！！
      let onlyOneColFlag = true
      rowArray.forEach(ri => {
        if (ri.cols[0].options.colspan !== rowArray[0].cols.length) {
          onlyOneColFlag = false
        }
      })
      //仅剩一列则不可删除！！
      if (onlyOneColFlag) {
        // this.vueInstance.$message.info(this.vueInstance.i18nt('designer.hint.lastColCannotBeDeleted'))
        return
      }

      //整列所有单元格列宽不一致不可删除！！
      let startColspan = rowArray[0].cols[colIndex].options.colspan
      let unmatchedFlag = false
      for (let i = 1; i < rowArray.length; i++) {
        if (rowArray[i].cols[colIndex].options.colspan !== startColspan) {
          unmatchedFlag = true
          break
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message
          .info
          // this.vueInstance.i18nt('designer.hint.colspanNotConsistentForDeleteEntireColumn'),
          ()
        return
      }

      rowArray.forEach(rItem => {
        rItem.cols.splice(colIndex, startColspan)
      })

      this.emitHistoryChange()
    },

    deleteTableWholeRow(rowArray, rowIndex) {
      //需考虑删除的是合并行！！
      let onlyOneRowFlag = true
      rowArray[0].cols.forEach(ci => {
        if (ci.options.rowspan !== rowArray.length) {
          onlyOneRowFlag = false
        }
      })
      //仅剩一行则不可删除！！
      if (onlyOneRowFlag) {
        // this.vueInstance.$message.info(this.vueInstance.i18nt('designer.hint.lastRowCannotBeDeleted'))
        return
      }

      //整行所有单元格行高不一致不可删除！！
      let startRowspan = rowArray[rowIndex].cols[0].options.rowspan
      let unmatchedFlag = false
      for (let i = 1; i < rowArray[rowIndex].cols.length; i++) {
        if (rowArray[rowIndex].cols[i].options.rowspan !== startRowspan) {
          unmatchedFlag = true
          break
        }
      }
      if (unmatchedFlag) {
        this.vueInstance.$message
          .info
          // this.vueInstance.i18nt('designer.hint.rowspanNotConsistentForDeleteEntireRow'),
          ()
        return
      }

      rowArray.splice(rowIndex, startRowspan)

      this.emitHistoryChange()
    },

    getContainerByType(typeName) {
      let allWidgets = [...containers, ...basicFields]
      let foundCon = null
      allWidgets.forEach(con => {
        if (!!con.category && !!con.type && con.type === typeName) {
          foundCon = con
        }
      })

      return foundCon
    },

    getFieldWidgetByType(typeName) {
      let allWidgets = [...containers, ...basicFields]
      let foundWidget = null
      allWidgets.forEach(widget => {
        if (!widget.category && !!widget.type && widget.type === typeName) {
          foundWidget = widget
        }
      })

      return foundWidget
    },

    hasConfig(widget, configName) {
      let originalWidget = null
      if (widget.category) {
        originalWidget = this.getContainerByType(widget.type)
      } else {
        originalWidget = this.getFieldWidgetByType(widget.type)
      }

      if (!originalWidget || !originalWidget.options) {
        return false
      }

      return Object.keys(originalWidget.options).indexOf(configName) > -1
    },

    upgradeWidgetConfig(oldWidget) {
      let newWidget = null
      if (oldWidget.category) {
        newWidget = this.getContainerByType(oldWidget.type)
      } else {
        newWidget = this.getFieldWidgetByType(oldWidget.type)
      }

      if (!newWidget || !newWidget.options) {
        return
      }

      // Object.keys(newWidget.options).forEach(ck => {
      //   if (!oldWidget.hasOwnProperty(ck)) {
      //     oldWidget.options[ck] = deepClone(newWidget.options[ck])
      //   }
      // })
    },

    cloneGridCol(widget, parentWidget) {
      let newGridCol = deepClone(this.getContainerByType('grid-col'))
      newGridCol.options.span = widget.options.span
      let tmpId = generateId()
      newGridCol.id = 'grid-col-' + tmpId
      newGridCol.options.name = 'gridCol' + tmpId

      parentWidget.cols.push(newGridCol)
    },

    cloneContainer(containWidget) {
      if (containWidget.type === 'grid') {
        let newGrid = deepClone(this.getContainerByType('grid'))
        newGrid.id = newGrid.type + generateId()
        newGrid.options.name = newGrid.id
        containWidget.cols.forEach(gridCol => {
          let newGridCol = deepClone(this.getContainerByType('grid-col'))
          let tmpId = generateId()
          newGridCol.id = 'grid-col-' + tmpId
          newGridCol.options.name = 'gridCol' + tmpId
          newGridCol.options.span = gridCol.options.span
          newGrid.cols.push(newGridCol)
        })

        return newGrid
      } else if (containWidget.type === 'table') {
        let newTable = deepClone(this.getContainerByType('table'))
        newTable.id = newTable.type + generateId()
        newTable.options.name = newTable.id
        containWidget.rows.forEach(tRow => {
          let newRow = deepClone(tRow)
          newRow.id = 'table-row-' + generateId()
          newRow.cols.forEach(col => {
            col.id = 'table-cell-' + generateId()
            col.options.name = col.id
            col.widgetList = [] //清空组件列表
          })
          newTable.rows.push(newRow)
        })

        return newTable
      } else {
        //其他容器组件不支持clone操作
        return null
      }
    },

    moveUpWidget(parentList, indexOfParentList) {
      if (parentList) {
        if (indexOfParentList === 0) {
          // this.vueInstance.$message(this.vueInstance.i18nt('designer.hint.moveUpFirstChildHint'))
          return
        }

        let tempWidget = parentList[indexOfParentList]
        parentList.splice(indexOfParentList, 1)
        parentList.splice(indexOfParentList - 1, 0, tempWidget)
      }
    },

    moveDownWidget(parentList, indexOfParentList) {
      if (parentList) {
        if (indexOfParentList === parentList.length - 1) {
          // this.vueInstance.$message(this.vueInstance.i18nt('designer.hint.moveDownLastChildHint'))
          return
        }

        let tempWidget = parentList[indexOfParentList]
        parentList.splice(indexOfParentList, 1)
        parentList.splice(indexOfParentList + 1, 0, tempWidget)
      }
    },
    // 拖拽拷贝模板
    copyTemWidget(origin) {
      // 找到所有的ID 2、转成字符串 3、对所有ID进行全局替换
      // !origin.id && (origin.id = origin.type + generateId())
      // Array.isArray(origin.layers) && (this.layers = [...this.layers, ...origin.layers])
      // return deepClone(origin.widgetList)
      let widgetStr = JSON.stringify(origin)
      let { widgetList, layers } = JSON.parse(widgetStr)
      let newWidgetStr = widgetStr
      // 深度递归遍历获取所有ID、替换所有ID
      let idAndNewIdArr = this.deepRecursionAndGenerateNewId(widgetList)
      let idAndNewIdArr2 = this.deepRecursionAndGenerateNewId(layers, true)
      idAndNewIdArr.map(({ id, newId }) => {
        newWidgetStr = newWidgetStr.replaceAll(id, newId)
      })
      idAndNewIdArr2.map(({ id, newId }) => {
        newWidgetStr = newWidgetStr.replaceAll(id, newId)
      })
      // 将字符串函数转换为函数
      // targetWidgetList.push(...transStrFnToFn([...JSON.parse(newWidgetStr).widgetList]))
      this.layers.push(...transStrFnToFn([...JSON.parse(newWidgetStr).layers]))
      return { ...JSON.parse(newWidgetStr), id: origin.type + generateId() }
    },
    // 拖拽拷贝新的组件
    copyNewFieldWidget(origin) {
      let newWidget = deepClone(origin)
      let tempId = generateId()
      newWidget.id = newWidget.type.replace(/-/g, '') + tempId
      newWidget.options.name && (newWidget.options.name = newWidget.id)
      newWidget.options.label &&
        (newWidget.options.label = newWidget.options.label || newWidget.type.toLowerCase())
      if (origin.formItemFlag) {
        newWidget.options.fieldName = origin.type + tempId
      }
      // 如果配置了样式属性可配
      if (origin.hasStyleConfig) {
        newWidget.styleConfig = origin.styleConfig
          ? deepClone({ ...defaultStyleConfig, ...origin.styleConfig })
          : deepClone({ ...defaultStyleConfig })
      }
      delete newWidget.displayName
      return newWidget
    },

    copyNewContainerWidget(origin) {
      let newCon = deepClone(origin)
      newCon.id = newCon.type.replace(/-/g, '') + generateId()
      newCon.options.name = newCon.id
      if (newCon.type === 'grid') {
        let newCol = deepClone(this.getContainerByType('grid-col'))
        let tmpId = generateId()
        newCol.id = 'grid-col-' + tmpId
        newCol.options.name = 'gridCol' + tmpId
        newCon.cols.push(newCol)
        //
        newCol = deepClone(newCol)
        tmpId = generateId()
        newCol.id = 'grid-col-' + tmpId
        newCol.options.name = 'gridCol' + tmpId
        newCon.cols.push(newCol)
      } else if (newCon.type === 'tab') {
        let newTabPane = deepClone(this.getContainerByType('tab-pane'))
        newTabPane.id = 'tab-pane-' + generateId()
        newTabPane.options.name = 'tab1'
        newTabPane.options.label = 'tab1'
        newCon.tabs.push(newTabPane)
      }
      // 如果配置了样式属性可配
      if (origin.hasStyleConfig) {
        newCon.styleConfig = origin.styleConfig
          ? deepClone({ ...defaultStyleConfig, ...origin.styleConfig })
          : deepClone({ ...defaultStyleConfig })
      }
      //newCon.options.customClass = []

      delete newCon.displayName
      return newCon
    },
    deepRecursionAndGenerateNewId(arr, isLayers = false, idAndNewIdArr = []) {
      if (Array.isArray(arr)) {
        arr.map(item => {
          let newId = generateId()
          idAndNewIdArr.push({ id: item.id, newId: item.type + newId })
          if (isLayers) {
            idAndNewIdArr.push({ id: getLastNumber(item.id), newId: newId })
          }
          this.deepRecursionAndGenerateNewId(item['widgetList'], isLayers, idAndNewIdArr)
        })
        return idAndNewIdArr
      }
    },
    // 处理组件添加逻辑
    dealWidgetAdd(ev, targetWidgetList) {
      let { 'widget-type': widgettype, 'widget-str': widgetStr, widgetindex } = ev.clone.attributes
      let widgetOrwidgetArr
      if (widgettype?.value == 'container') {
        widgetOrwidgetArr = this.copyNewContainerWidget(containers[widgetindex.value])
      }
      if (widgettype?.value == 'basic') {
        widgetOrwidgetArr = this.copyNewFieldWidget(basicFields[widgetindex.value])
      }
      // 处理模板的情况
      if (widgettype.value == 'tem' && widgetStr.value) {
        let { widgetList, layers } = JSON.parse(widgetStr.value)
        let newWidgetStr = widgetStr.value
        // 深度递归遍历获取所有ID、替换所有ID
        let idAndNewIdArr = this.deepRecursionAndGenerateNewId(widgetList)
        let idAndNewIdArr2 = this.deepRecursionAndGenerateNewId(layers, true)
        idAndNewIdArr.map(({ id, newId }) => {
          newWidgetStr = newWidgetStr.replaceAll(id, newId)
        })
        idAndNewIdArr2.map(({ id, newId }) => {
          newWidgetStr = newWidgetStr.replaceAll(id, newId)
        })
        // 将字符串函数转换为函数
        targetWidgetList.push(...transStrFnToFn([...JSON.parse(newWidgetStr).widgetList]))
        this.layers.push(...transStrFnToFn([...JSON.parse(newWidgetStr).layers]))
        return
      }

      targetWidgetList.push(widgetOrwidgetArr)
    },
    addContainerByDbClick(container) {
      let newCon = this.copyNewContainerWidget(container)
      this.widgetList.push(newCon)
      this.setSelected(newCon)
    },

    addFieldByDbClick(widget) {
      let newWidget = this.copyNewFieldWidget(widget)
      if (!!this.selectedWidget && this.selectedWidget.type === 'tab') {
        //获取当前激活的tabPane
        let activeTab = this.selectedWidget.tabs[0]
        this.selectedWidget.tabs.forEach(tabPane => {
          if (tabPane.options.active) {
            activeTab = tabPane
          }
        })

        !!activeTab && activeTab.widgetList.push(newWidget)
      } else if (!!this.selectedWidget && !!this.selectedWidget.widgetList) {
        this.selectedWidget.widgetList.push(newWidget)
      } else {
        this.widgetList.push(newWidget)
      }

      this.setSelected(newWidget)
      this.emitHistoryChange()
    },

    deleteColOfGrid(gridWidget, colIdx) {
      if (!!gridWidget && !!gridWidget.cols) {
        gridWidget.cols.splice(colIdx, 1)
      }
    },

    addNewColOfGrid(gridWidget) {
      const cols = gridWidget.cols
      let newGridCol = deepClone(this.getContainerByType('grid-col'))
      let tmpId = generateId()
      newGridCol.id = 'grid-col-' + tmpId
      newGridCol.options.name = 'gridCol' + tmpId
      if (!!cols && cols.length > 0) {
        let spanSum = 0
        cols.forEach(col => {
          spanSum += col.options.span
        })

        if (spanSum >= 24) {
          //this.$message.info('列栅格之和超出24')
          gridWidget.cols.push(newGridCol)
        } else {
          newGridCol.options.span = 24 - spanSum > 12 ? 12 : 24 - spanSum
          gridWidget.cols.push(newGridCol)
        }
      } else {
        gridWidget.cols = [newGridCol]
      }
    },

    addTabPaneOfTabs(tabsWidget) {
      const tabPanes = tabsWidget.tabs
      let newTabPane = deepClone(this.getContainerByType('tab-pane'))
      newTabPane.id = 'tab-pane-' + generateId()
      newTabPane.options.name = newTabPane.id
      newTabPane.options.label = 'tab ' + (tabPanes.length + 1)
      tabPanes.push(newTabPane)
    },

    deleteTabPaneOfTabs(tabsWidget, tpIdx) {
      tabsWidget.tabs.splice(tpIdx, 1)
    },

    emitEvent(evtName, evtData) {
      //用于兄弟组件发射事件
      this.vueInstance.$emit(evtName, evtData)
    },

    handleEvent(evtName, callback) {
      //用于兄弟组件接收事件
      this.vueInstance.$on(evtName, data => callback(data))
    },

    setCssClassList(cssClassList) {
      this.cssClassList = cssClassList
    },

    getCssClassList() {
      return this.cssClassList
    },

    registerFormWidget(formWidget) {
      this.formWidget = formWidget
    },

    initHistoryData() {
      this.loadFormContentFromStorage()
      this.historyData.index++
      this.historyData.steps[this.historyData.index] = {
        widgetList: deepClone(this.widgetList),
        formConfig: deepClone(this.formConfig),
      }
    },

    emitHistoryChange() {
      //console.log('------------', 'Form history changed!')

      if (this.historyData.index === this.historyData.maxStep - 1) {
        this.historyData.steps.shift()
      } else {
        this.historyData.index++
      }

      this.historyData.steps[this.historyData.index] = {
        widgetList: deepClone(this.widgetList),
        formConfig: deepClone(this.formConfig),
      }

      this.saveFormContentToStorage()

      if (this.historyData.index < this.historyData.steps.length - 1) {
        this.historyData.steps = this.historyData.steps.slice(0, this.historyData.index + 1)
      }

      //console.log('history', this.historyData.index)
    },

    saveCurrentHistoryStep() {
      this.historyData.steps[this.historyData.index] = deepClone({
        widgetList: this.widgetList,
        formConfig: this.formConfig,
      })

      this.saveFormContentToStorage()
    },

    undoHistoryStep() {
      if (this.historyData.index !== 0) {
        this.historyData.index--
      }

      this.widgetList = deepClone(this.historyData.steps[this.historyData.index].widgetList)
      this.formConfig = deepClone(this.historyData.steps[this.historyData.index].formConfig)
    },

    redoHistoryStep() {
      if (this.historyData.index !== this.historyData.steps.length - 1) {
        this.historyData.index++
      }

      this.widgetList = deepClone(this.historyData.steps[this.historyData.index].widgetList)
      this.formConfig = deepClone(this.historyData.steps[this.historyData.index].formConfig)
    },

    undoEnabled() {
      return this.historyData.index > 0 && this.historyData.steps.length > 0
    },

    redoEnabled() {
      return this.historyData.index < this.historyData.steps.length - 1
    },

    saveFormContentToStorage() {
      // window.localStorage.setItem('widget__list__backup', JSON.stringify(this.widgetList))
      // window.localStorage.setItem('layers__backup', JSON.stringify(this.layers))
      // window.localStorage.setItem('form__config__backup', JSON.stringify(this.formConfig))
    },

    loadFormContentFromStorage() {
      let widgetListBackup = window.localStorage.getItem('widget__list__backup')
      if (widgetListBackup) {
        this.widgetList = JSON.parse(widgetListBackup)
      }
      if (localStorage.getItem('layers__backup')) {
        this.layers = JSON.parse(localStorage.getItem('layers__backup'))
      }
      let formConfigBackup = window.localStorage.getItem('form__config__backup')
      if (formConfigBackup) {
        //this.formConfig = JSON.parse(formConfigBackup)
        overwriteObj(
          this.formConfig,
          JSON.parse(formConfigBackup),
        ) /* 用=赋值，会导致inject依赖注入的formConfig属性变成非响应式 */
      }
    },
    // 处理widget事件,事件分为两大类，全局事件和组件事件都是通过designer的变量值来触发
    async dealWidgetAction(widget, action, designer) {
      // 判断是否有此事件的处理函数
      let toduArr = widget.eventArr.filter(event => {
        return event.effectAciton === action
      })
      // 没有直接返回
      if (toduArr.length === 0) {
        return
      }
      let { toduAcitonArr, eventId } = toduArr[0]
      this.toduAcitonArr = toduAcitonArr
      await this.doAcitonArr(designer, eventId, 0)
    },
    doAcitonArr(designer, eventId, index) {
      // 停止继续执行
      if (index != 0 && this.stopToduAcitonArrTodo) {
        clearTimeout(Window.timeout)
        return
      }
      if (index == 0) {
        this.stopToduAcitonArrTodo = false
        clearTimeout(Window.timeout)
      }
      let isRun = false

      let action = this.toduAcitonArr[index]
      if (action) {
        let [v1, v2] = action.value
        isRun = true
        // let timeOut = setTimeout(() => {
        //   isRun = false
        // }, 500)
        // 全局事件
        if (v1 === 'globalAction') {
          let selectedLayer = this.layers.filter(item => {
            return item.id == item.type + eventId
          })
          if (selectedLayer.length != 0) {
            selectedLayer[0].options.visible = true
            return
          }
          if (v2 === 'dialog') {
            const newWidget = eventTriggeredWidget.creatDialog(eventId)
            this.layers.push(newWidget)
            designer.setSelected(newWidget)
          }
          if (v2 === 'drawer') {
            const newWidget = eventTriggeredWidget.creatDrawer(eventId)
            this.layers.push(newWidget)
            designer.setSelected(newWidget)
          }
          if (v2 === 'message-box') {
            const newWidget = eventTriggeredWidget.creatMessage(eventId)
            this.layers.push(newWidget)
            designer.setSelected(newWidget)
          }
        } else {
          designer.triggerEventStatus = {
            ...designer.triggerEventStatus,
            [v1 + v2]: !designer.triggerEventStatus[v1 + v2],
          }
        }
      }
      if (!Window.timeout) {
        Window.timeout = setTimeout(() => {
          this.doAcitonArr(designer, eventId, index + 1)
        }, 500)
      }
    },
    stopToduAcitonArr() {
      this.stopToduAcitonArrTodo = true
    },
    // 通过widget.options.name（为组件唯一标识） 获取其label值
    getWidgetByID(widgetId, prop) {
      let selectedWidget = null
      const findWidget = widgetArr => {
        if (!Array.isArray(widgetArr) || widgetArr.length === 0) {
          return
        }
        widgetArr.map(item => {
          if (item.id === widgetId) {
            selectedWidget = item
            return
          }
          findWidget(item.widgetList)
        })
      }
      findWidget([...this.widgetList, ...this.layers])
      return prop && selectedWidget ? selectedWidget.options[prop] : selectedWidget
    },
  }
}
