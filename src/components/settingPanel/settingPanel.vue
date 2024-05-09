<template>
  <div class="setting-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="组件属性" name="first">
        <div
          v-if="
            !designer.selectedWidget ||
            (designer.selectedWidget && Object.keys(designer.selectedWidget).length === 0)
          "
          class="no-widget-selected"
        >
          无选中组件
        </div>
        <template v-else>
          <el-form
            :model="widgetOption"
            size="mini"
            label-position="left"
            label-width="120px"
            class="setting-form"
            @submit.native.prevent
          >
            <el-collapse v-model="widgetActiveCollapseNames" class="setting-collapse">
              <el-collapse-item name="1" title="基本属性">
                <template v-for="(editorName, propName) in widgetOption">
                  <template v-if="curWidgetFormItemArrMap[propName].isBaseProp">
                    <prop-form-item
                      v-show="
                        curWidgetFormItemArrMap[propName].show
                          ? curWidgetFormItemArrMap[propName].show(widgetOption, selectedWidget)
                          : true
                      "
                      :key="propName"
                      :form-data="widgetOption"
                      :item-type="curWidgetFormItemArrMap[propName].type"
                      :form-item="curWidgetFormItemArrMap[propName]"
                      :prop="propName"
                      :designer="designer"
                    />
                  </template>
                </template>
              </el-collapse-item>
              <el-collapse-item v-if="hasAdvancedProperties()" name="3" title="高级属性">
                <template v-for="(editorName, propName) in widgetOption">
                  <template v-if="!curWidgetFormItemArrMap[propName].isBaseProp">
                    <prop-form-item
                      v-show="
                        curWidgetFormItemArrMap[propName].show
                          ? curWidgetFormItemArrMap[propName].show(widgetOption, selectedWidget)
                          : true
                      "
                      :key="propName"
                      :form-data="widgetOption"
                      :item-type="curWidgetFormItemArrMap[propName].type"
                      :form-item="curWidgetFormItemArrMap[propName]"
                      :prop="propName"
                      :designer="designer"
                    />
                  </template>
                </template>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </template>
      </el-tab-pane>
      <el-tab-pane v-if="selectedWidget && selectedWidget.hasStyleConfig" label="样式" name="second">
        <style-config :style-config="selectedWidget.styleConfig" :selected-widget="selectedWidget" />
      </el-tab-pane>
      <el-tab-pane label="事件" name="third">
        <div
          v-if="!designer.selectedWidget || Object.keys(designer.selectedWidget).length === 0"
          class="no-widget-selected"
        >
          无选中组件
        </div>
        <template v-else>
          <el-collapse v-model="eventActiveNames">
            <el-collapse-item
              v-show="selectedWidget.actions && selectedWidget.actions.length > 0"
              title="事件回调"
              name="1"
            >
              <div v-show="curTodoAciton && curTodoAciton.length > 0" class="addBtn">
                <el-button style="width: 90%" type="primary" @click="addActionVisible = true"
                  >添加事件</el-button
                >
              </div>
              <el-card v-for="(event, eventIndex) in selectedWidget.eventArr" :key="eventIndex">
                <div slot="header" class="card-header">
                  <span>{{
                    selectedWidget.actions.filter(item => {
                      return item.value === event.effectAciton
                    })[0].label
                  }}</span>
                  <div>
                    <el-button icon="h-icon-delete" @click="delEvent(event, eventIndex)"></el-button>
                  </div>
                </div>
                <div>
                  触发事件：
                  <template v-for="(toduAciton, index) in event.toduAcitonArr">
                    <p :key="index">
                      {{ index + 1 }} 、
                      {{ getWidgetNameById(toduAciton.value[0], eventIndex) }}
                      {{ triggerEventMap[toduAciton.value[1]] }}
                    </p>
                    <span v-if="toduAciton.router" :key="index + 'router'">
                      跳转地址:{{ toduAciton.router }}
                    </span>
                    <span v-if="toduAciton.reqMethod" :key="index + 'request'">
                      请求方式:{{ toduAciton.reqMethod + ':' + toduAciton.reqUrl }}数据源:
                      {{
                        toduAciton.paramsList.length > 0 &&
                        toduAciton.paramsList.map(({ value }) => {
                          return value[0] + ':' + value[1]
                        })
                      }}
                    </span>
                  </template>
                </div>
              </el-card>
            </el-collapse-item>
            <el-collapse-item
              v-show="selectedWidget.triggerEvent && selectedWidget.triggerEvent.length > 0"
              title="可触发事件"
              name="2"
            >
              <el-card v-for="(event, eventIndex) in selectedWidget.triggerEvent" :key="eventIndex">
                <div slot="header" class="card-header">
                  <span>{{ event.label }} {{ event.reqMethod }}</span>
                  <el-button
                    v-if="event.reqMethod"
                    icon="h-icon-edit"
                    @click="eventEdit(event, eventIndex)"
                  ></el-button>
                </div>
                <div v-if="event.reqMethod">请求地址:{{ event.reqUrl || '无' }}</div>
                <div v-if="event.hasOwnProperty('paramsList')">
                  数据源:{{
                    event['paramsList'].length > 0
                      ? event['paramsList'].map(item => {
                          return getWidgetNameById(item[0]) + ':' + item[1]
                        })
                      : '暂无数据源'
                  }}
                </div>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="添加事件" :visible.sync="addActionVisible" size="large">
      <el-form ref="addActionForm" :model="addActionForm" label-width="100px">
        <el-form-item
          prop="effectAciton"
          label="操作事件"
          :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
        >
          <el-select v-model="addActionForm.effectAciton" placeholder="请选择">
            <el-option
              v-for="action in curTodoAciton"
              :key="action.value"
              :label="action.label"
              :value="action.value"
            />
          </el-select>
        </el-form-item>
        <template v-for="(toduAciton, index) in addActionForm.toduAcitonArr">
          <el-form-item
            :key="toduAciton.key"
            :label="'触发事件' + index"
            :prop="'toduAcitonArr.' + index + '.value.0'"
            :rules="{
              required: true,
              message: '触发事件不能为空',
              trigger: 'change',
            }"
          >
            <el-cascader
              v-model="toduAciton.value"
              style="width: 80%"
              expand-trigger="hover"
              :options="triggerEventOptions"
              placeholder="请选择"
            >
            </el-cascader>
            <el-button @click.prevent="removeAction(toduAciton)">删除</el-button>
          </el-form-item>
          <el-form-item
            v-if="toduAciton.value.length > 0 && toduAciton.value[1] === 'router'"
            :key="toduAciton.key + 'router'"
            :rules="{
              required: true,
              message: '路由地址不能为空',
              trigger: 'change',
            }"
            :prop="'toduAcitonArr.' + index + '.router'"
            :label="'路由地址' + index"
          >
            <el-input v-model="toduAciton.router"></el-input>
          </el-form-item>
          <div
            v-if="toduAciton.value.length > 0 && toduAciton.value[1] === 'request'"
            :key="toduAciton.key + 'request'"
          >
            <el-form-item label="请求方法">
              <el-select v-model="toduAciton.reqMethod" placeholder="请选择">
                <el-option label="post" value="post"></el-option>
                <el-option label="get" value="get"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="请求地址"
              :prop="'toduAcitonArr.' + index + '.reqUrl'"
              :rules="{
                required: true,
                message: '请求地址不能为空',
                trigger: 'change',
              }"
            >
              <el-input v-model="toduAciton.reqUrl"></el-input>
            </el-form-item>
            <el-alert title="添加重复数据源会自动过滤" type="warning" simple show-icon :closable="false" />
            <el-form-item
              v-for="(dataSource, paramsIndex) in toduAciton.paramsList"
              :key="dataSource.key"
              :label="'数据源' + (index * 1 + 1)"
              :prop="'toduAcitonArr.' + index + '.paramsList.' + paramsIndex + '.value.0'"
              :rules="{
                required: true,
                message: '数据源不能为空',
                trigger: 'change',
              }"
            >
              <el-cascader
                v-model="dataSource.value"
                style="width: 80%"
                expand-trigger="hover"
                :options="dataSourceOptions"
                placeholder="请选择"
              >
              </el-cascader>
              <el-button @click.prevent="removeDataSource(toduAciton, index)">删除</el-button>
            </el-form-item>
            <el-button @click="addDataSource(toduAciton)">新增数据源</el-button>
          </div>
        </template>
        <el-button @click="todoAction">新增触发事件</el-button>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addActions">确 定</el-button>
        <el-button @click="addActionVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑triggerEvent -->
    <triggerEventEdit
      ref="triggerEventEdit"
      :cur-trigger-event="curTriggerEvent"
      :designer="designer"
      @editConfim="editConfim"
    />
  </div>
</template>
<script>
import {
  optionNameMap,
  optionNameToFormItem,
  globalAction,
  advancedPropertiesNameMap,
  widgetTypeToFormItemArrMap,
} from '@/config/widgetsConfig.js'
import { generateId } from '@/utils/util.js'
import propFormItem from './propFormItem'
import styleConfig from './styleConfig'
import triggerEventEdit from './triggerEventEdit'
export default {
  components: { propFormItem, styleConfig, triggerEventEdit },
  props: {
    designer: { type: Object, default: () => {} },
    selectedWidget: { type: Object, default: () => {} },
  },
  data() {
    return {
      activeName: 'first',
      eventActiveNames: ['1', '2'],
      widgetActiveCollapseNames: ['1', '2', '3'],
      optionNameMap,
      optionTypeMap: {},
      optionNameToFormItem,
      advancedPropertiesNameMap,
      addActionVisible: false,
      globalAction,
      addActionForm: {
        effectAciton: '',
        toduAcitonArr: [
          {
            value: [],
            key: Date.now(),
            router: '',
            reqMethod: 'post',
            reqUrl: '',
            paramsList: [],
          },
        ],
      },
      triggerEventMap: {},
      curTriggerEvent: {},
      eventIndex: '',
      widgetTypeToFormItemArrMap,
      widgetIdToWidgetMap: {},
    }
  },
  computed: {
    widgetOption: {
      get() {
        this.getWidgetOptionFormItemType(this.selectedWidget.options)
        return this.selectedWidget.options
      },

      set(newValue) {
        this.selectedWidget.options = newValue
      },
    },
    curTodoAciton() {
      // 单个事件只能触发一次操作
      return (
        this.selectedWidget &&
        this.selectedWidget.actions &&
        this.selectedWidget.actions.filter(action => {
          let eventArr = this.selectedWidget.eventArr
          for (let index = 0; index < eventArr.length; index++) {
            const event = eventArr[index]
            if (event.effectAciton === action.value) {
              return false
            }
          }
          return true
        })
      )
    },
    // 全局可触发事件集合
    triggerEventOptions() {
      let triggerEventMap = {}
      globalAction.map(event => {
        triggerEventMap[event.value] = event.label || event.name
      })
      let baseTriggerEventOptions = [{ value: 'globalAction', label: '全局事件', children: globalAction }]
      const findTriggerEvent = widgetList => {
        if (!widgetList || widgetList.length === 0) {
          return
        }
        widgetList.map(widget => {
          this.widgetIdToWidgetMap[widget.id] = widget
          if (widget.triggerEvent && widget.triggerEvent.length > 0) {
            baseTriggerEventOptions.push({
              value: widget.id,
              label: widget.options.label || widget.options.name,
              children: widget.triggerEvent,
            })
            widget.triggerEvent.map(event => {
              triggerEventMap[event.value] = event.label || event.name
            })
          }
          findTriggerEvent(widget.widgetList)
        })
      }
      findTriggerEvent([...this.designer.widgetList, ...this.designer.layers])
      // eslint-disable-next-line
      this.triggerEventMap = triggerEventMap
      return baseTriggerEventOptions
    },
    dataSourceOptions() {
      let baseTriggerEventOptions = []
      const findProvideData = widgetList => {
        if (!widgetList || widgetList.length === 0) {
          return
        }
        widgetList.map(widget => {
          if (widget.widgetProvideData && Object.keys(widget.widgetProvideData).length > 0) {
            let dataArr = []
            Object.keys(widget.widgetProvideData).map(key => {
              dataArr.push(widget.widgetProvideData[key])
            })
            baseTriggerEventOptions.push({
              value: widget.options.name || widget.options.label,
              label: widget.options.label || widget.options.name,
              children: dataArr,
            })
          }
          findProvideData(widget.widgetList)
        })
      }
      findProvideData([...this.designer.widgetList, ...this.designer.layers])
      // eslint-disable-next-line
      return baseTriggerEventOptions
    },
    curWidgetFormItemArrMap() {
      // 首先对传入的FormItemArr做处理，接着遍历formdata去查看是否所有字段都配置了，未配置则按照widgetConfig中的配置生成此字段的formItem
      const itemArrMap = {}
      if (this.selectedWidget && this.widgetTypeToFormItemArrMap[this.selectedWidget.type]) {
        const fromItemArr = this.widgetTypeToFormItemArrMap[this.selectedWidget.type]
        fromItemArr &&
          fromItemArr.map(item => {
            const prop = Object.keys(item)[0]
            itemArrMap[prop] = this.dealFormItem(item)
          })
        for (const key in this.widgetOption) {
          if (!itemArrMap[key]) {
            const nameMap = optionNameMap[key] ? optionNameMap[key] : advancedPropertiesNameMap[key]
            itemArrMap[key] = {
              prop: key,
              label: typeof nameMap === 'object' ? nameMap.label : nameMap,
              desc: typeof nameMap === 'object' ? nameMap.desc : '',
              type: this.optionTypeMap[key],
              isBaseProp: !!optionNameMap[key],
            }
            if (itemArrMap[key].type === 'select' || itemArrMap[key].type === 'radio') {
              itemArrMap[key].optionArr = optionNameToFormItem[key][this.selectedWidget.type + 'Options']
            }
          }
        }
      }
      return itemArrMap
    },
  },
  methods: {
    // 对配置的表单做进一步处理
    dealFormItem(item) {
      if (!item.prop) {
        item.prop = this.getObjFirkey(item)
      }
      if (!item.label) {
        item.label = this.getObjFirkeyVal(item)
      }
      if (item.optionArr && !item.type) {
        item.type = 'select'
      }
      if (!item.type) {
        item.type = 'input'
      }
      return item
    },
    // 解析selectedWidget.option的每一项对应的form表单类型
    getWidgetOptionFormItemType(options) {
      for (const key in options) {
        // if (this.curWidgetFormItemArrMap[key] && this.curWidgetFormItemArrMap[key].type) {
        //   this.optionTypeMap[key] = this.curWidgetFormItemArrMap[key].type
        // } else
        if (optionNameToFormItem[key]) {
          this.optionTypeMap[key] = optionNameToFormItem[key].type
        } else {
          if (typeof options[key] === 'string') {
            this.optionTypeMap[key] = 'input'
          }
          if (typeof options[key] === 'number') {
            this.optionTypeMap[key] = 'number'
          }
          if (typeof options[key] === 'boolean') {
            this.optionTypeMap[key] = 'switch'
          }
        }
      }
    },
    // 判断是否含有
    hasAdvancedProperties() {
      let arr = Object.keys(this.widgetOption).filter(key => {
        return this.advancedPropertiesNameMap[key]
      })
      if (arr.length === 0) {
        return false
      }
      return true
    },
    addActions() {
      this.$refs['addActionForm'].validate(async valid => {
        if (valid) {
          this.addActionForm.toduAcitonArr.map(action => {
            if (action.paramsList) {
              const sourchMap = {}
              const paramsList = []
              action.paramsList.map(dataSource => {
                const [v1, v2] = dataSource.value
                if (!sourchMap[v1]) {
                  paramsList.push([v1, v2])
                  sourchMap[v1] = v2
                }
              })
              action.paramsList = paramsList
            }
          })
          this.selectedWidget.eventArr.push({ ...this.addActionForm, eventId: generateId() })
          this.addActionVisible = false
          this.addActionForm = {
            effectAciton: '',
            toduAcitonArr: [
              {
                value: [],
                key: Date.now(),
                router: '',
                reqMethod: 'post',
                reqUrl: '',
                paramsList: [],
              },
            ],
          }
          this.$refs['addActionForm'].resetFields()
        }
      })
    },
    delEvent(event, index) {
      this.selectedWidget.eventArr.splice(index, 1)
    },
    removeAction(item) {
      var index = this.addActionForm.toduAcitonArr.indexOf(item)
      if (index !== -1) {
        this.addActionForm.toduAcitonArr.splice(index, 1)
      }
    },
    todoAction() {
      this.addActionForm.toduAcitonArr.push({
        value: [],
        key: Date.now(),
      })
    },
    // 通过widget的ID获取其label
    getWidgetNameById(id) {
      return this.widgetIdToWidgetMap[id]?.options.name
    },
    eventEdit(event, eventIndex) {
      this.curTriggerEvent = event
      this.eventIndex = eventIndex
      this.$refs['triggerEventEdit'].toShow()
    },
    editConfim(newEvent) {
      this.selectedWidget.triggerEvent[this.eventIndex] = newEvent
      this.curTriggerEvent = {}
    },
    removeDataSource(toduAciton, index) {
      toduAciton.paramsList && toduAciton.paramsList.splice(index, 1)
    },
    addDataSource(toduAciton) {
      toduAciton.paramsList.push({
        value: [],
        key: Date.now(),
      })
    },
    getObjFirkey(data) {
      for (var key in data) {
        return key
      }
    },
    getObjFirkeyVal(data) {
      for (var key in data) {
        return data[key]
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.setting-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .no-widget-selected {
    line-height: 100px;
    text-align: center;
    font-size: 18px;
    color: #999999;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .el-tabs {
    height: 100%;
  }
  // ::v-deep .el-tabs__content,
  // .el-tab-pane {
  //   height: 100%;
  // }
  ::v-deep .el-form-item {
    margin-bottom: 6px;
  }
  ::v-deep.el-card__header,
  ::v-deep.el-card__body {
    padding: 10px 20px;
  }
  .addBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 100%;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
