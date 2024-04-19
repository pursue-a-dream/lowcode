<template>
  <div>
    <el-form-item :introduction="formItem.desc || ''" :label="formItem.label" :prop="prop">
      <el-input v-if="itemType === 'input'" v-model="formData[prop]" placeholder="请输入"></el-input>
      <el-switch v-if="itemType === 'switch'" v-model="formData[prop]"></el-switch>
      <el-input-number v-if="itemType === 'number'" v-model="formData[prop]"></el-input-number>
      <el-radio-group v-if="itemType === 'radio'" v-model="formData[prop]">
        <el-radio v-for="item in formItem.optionArr" :key="item.val" :label="item.val" :value="item.val"
          >{{ item.label }}
        </el-radio>
      </el-radio-group>
      <el-select v-if="itemType === 'select'" v-model="formData[prop]" :clear="true" placeholder="请选择">
        <el-option
          v-for="item in formItem.optionArr"
          :key="typeof item === 'object' ? item.val : item"
          :label="typeof item === 'object' ? item.label : item"
          :value="typeof item === 'object' ? item.val : item"
        >
        </el-option>
      </el-select>
      <el-button
        v-if="itemType === 'dataSource'"
        type="default"
        icon="h-icon-edit"
        @click="
          () => {
            $refs['dataSourceEdit'].toShow()
          }
        "
        >编辑</el-button
      >
      <div v-if="itemType === 'parameter'">
        <el-button
          v-if="!formData[prop] || formData[prop].length === 0"
          type="default"
          icon="h-icon-attach"
          @click="
            () => {
              $refs['dataSourceConnect'].toShow()
            }
          "
          >关联数据源</el-button
        >
        <div v-else class="d-flex align-center space-between">
          <!-- {{
            formData[prop].map(item => {
              return getWidgetByID(item[0]) + ':' + item[1]
            })
          }} -->
          <!-- {{ getWidgetByID(formData[prop][0]) }}: {{ formData[prop][1] }} -->
          <i class="h-icon-delete" @click="formData[prop] = []"></i>
        </div>
      </div>
    </el-form-item>
    <!-- 数据源编辑器 -->
    <dataSourceEdit ref="dataSourceEdit" :data-source="formData[prop]" @editConfim="editConfim" />
    <!-- 添加数据源弹框 -->
    <dataSourceConnect ref="dataSourceConnect" :designer="designer" @bindConfim="editConfim" />
  </div>
</template>

<script>
import dataSourceEdit from './dataSourceEdit'
import dataSourceConnect from './dataSourceConnect'
export default {
  components: { dataSourceEdit, dataSourceConnect },
  props: {
    itemType: { type: String, default: '' },
    prop: { type: String, default: '' },
    formData: { type: Object, default: () => {} },
    designer: { type: Object, default: () => {} },
    formItem: { type: Object, default: () => {} },
  },
  data() {
    return {
      addDataSourceVisible: false,
    }
  },
  methods: {
    editConfim(val) {
      this.formData[this.prop] = val
    },
    // 通过widget的ID获取其label
    getWidgetByID(name, index) {
      let findName = this.designer.getWidgetByID(name, 'label')
      if (!findName) {
        // 说明此此事件管理的组件已经被删除，去除此组件
        this.formData[this.prop] = []
        return
      }
      return findName
    },
  },
}
</script>

<style></style>
