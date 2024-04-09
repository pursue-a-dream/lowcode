<template>
  <el-dialog v-if="dialogVisible" title="绑定数据源" :visible.sync="dialogVisible" size="large">
    <el-form ref="form" :model="triggerEvent" label-width="100px">
      <el-form-item label="请求方法">
        <el-select v-model="triggerEvent.reqMethod" placeholder="请选择">
          <el-option label="post" value="post"></el-option>
          <el-option label="get" value="get"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求地址">
        <el-input v-model="triggerEvent.reqUrl"></el-input>
      </el-form-item>
      <template v-if="triggerEvent.paramsList">
        <el-alert title="添加重复数据源会自动过滤" type="warning" simple show-icon :closable="false" />
        <el-form-item
          v-for="(dataSource, index) in triggerEvent.paramsList"
          :label="'数据源' + (index * 1 + 1)"
          :key="dataSource.key"
          :prop="'paramsList.' + index + '.value.0'"
          :rules="{
            required: true,
            message: '数据源不能为空',
            trigger: 'blur',
          }"
        >
          <el-cascader
            style="width: 80%"
            expand-trigger="hover"
            :options="dataSourceOptions"
            v-model="dataSource.value"
            placeholder="请选择"
          >
          </el-cascader>
          <el-button @click.prevent="removeDataSource(index)">删除</el-button>
        </el-form-item>
        <el-button @click="addDataSource">新增数据源</el-button>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="bindData">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'dataSourceConnect',
  props: {
    designer: Object,
    curTriggerEvent: Object,
  },
  computed: {
    // 全局可触发事件集合
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
              value: widget.options.name,
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
  },
  data() {
    return {
      dialogVisible: false,
      triggerEvent: {},
    }
  },
  watch: {
    curTriggerEvent(newVal) {
      const triggerEvent = JSON.parse(JSON.stringify(newVal))
      if (triggerEvent.paramsList) {
        triggerEvent.paramsList = triggerEvent.paramsList.map(params => {
          return { value: params, key: Date.now() }
        })
      }
      this.triggerEvent = triggerEvent
    },
  },
  methods: {
    toShow() {
      this.dialogVisible = !this.dialogVisible
    },
    bindData() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (this.triggerEvent.paramsList) {
            const sourchMap = {}
            const paramsList = []
            this.triggerEvent.paramsList.map(dataSource => {
              const [v1, v2] = dataSource.value
              if (!sourchMap[v1]) {
                paramsList.push([v1, v2])
                sourchMap[v1] = v2
              }
            })
            this.triggerEvent.paramsList = paramsList
          }
          this.dialogVisible = !this.dialogVisible
          this.$emit('editConfim', JSON.parse(JSON.stringify(this.triggerEvent)))
        }
      })
    },
    removeDataSource(index) {
      this.triggerEvent.paramsList && this.triggerEvent.paramsList.splice(index, 1)
    },
    addDataSource() {
      this.triggerEvent.paramsList.push({
        value: [],
        key: Date.now(),
      })
    },
  },
}
</script>

<style></style>
