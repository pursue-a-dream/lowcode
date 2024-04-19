<template>
  <el-dialog v-if="dialogVisible" title="绑定数据源" :visible.sync="dialogVisible" size="large">
    <el-form ref="form" :model="formData" label-width="100px">
      <el-alert title="添加重复数据源会自动过滤" type="warning" simple show-icon :closable="false" />
      <el-form-item
        v-for="(dataSource, index) in formData.dataSourceList"
        :label="'数据源' + (index * 1 + 1)"
        :key="dataSource.key"
        :prop="'dataSourceList.' + index + '.value.0'"
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
        <el-button v-if="index != 0" @click.prevent="removeDataSource(index)">删除</el-button>
      </el-form-item>
      <el-button @click="todoDataSource">新增数据源</el-button>
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
              value: widget.id,
              label: widget.options.label,
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
      formData: {
        dataSourceList: [
          {
            value: [],
            key: 1,
          },
        ],
      },
    }
  },
  methods: {
    toShow() {
      this.dialogVisible = !this.dialogVisible
    },
    bindData() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const sourchMap = {}
          const dataSourceList = []
          this.formData.dataSourceList.map(dataSource => {
            const [v1, v2] = dataSource.value
            if (!sourchMap[v1]) {
              dataSourceList.push([v1, v2])
              sourchMap[v1] = v2
            }
          })
          this.$emit('bindConfim', dataSourceList)
          this.dialogVisible = !this.dialogVisible
        }
      })
    },
    removeDataSource(index) {
      this.formData.dataSourceList.splice(index, 1)
    },
    todoDataSource() {
      this.formData.dataSourceList.push({
        value: [],
        key: Date.now(),
      })
    },
  },
}
</script>

<style></style>
