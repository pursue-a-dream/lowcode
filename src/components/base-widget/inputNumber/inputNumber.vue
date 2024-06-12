<template>
  <FormItemWrapper
    class="inputNumberContent"
    :designer="designer"
    :widget="widget"
    :design-state="designState"
    :display-style="widget.options.displayStyle"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
    :form-data="formData"
    :rules="[]"
  >
    <el-input-number v-model="inputVal" :style="widget.activeStyle" v-bind="widget.options">
      <template v-if="widget.options.suffix" slot="suffix">
        <div>{{ widget.options.suffix }}</div>
      </template>
    </el-input-number>
  </FormItemWrapper>
</template>

<script>
import FormItemWrapper from '../form-item-wrapper'
export default {
  name: 'InputNumberWidget',
  components: { FormItemWrapper },
  props: {
    widget: {
      type: Object,
      default: () => {},
    },
    parentWidget: {
      type: Object,
      default: () => {},
    },
    parentList: {
      type: Array,
      default: () => [],
    },
    indexOfParentList: {
      type: Number,
      default: 0,
    },
    designer: {
      type: Object,
      default: () => {},
    },

    designState: {
      type: Boolean,
      default: false,
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */ type: Number,
      default: -1,
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */ type: Number,
      default: -1,
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */ type: String,
      default: '',
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    inputVal: {
      get() {
        return Object(this.formData).hasOwnProperty(this.widget.options.fieldName)
          ? this.formData[this.widget.options.fieldName]
          : this.widget.value
        // return this.widget.value
      },
      set(val) {
        this.widget.value = val
        this.formData && (this.formData[this.widget.options.fieldName] = val)
      },
    },
  },

  methods: {},
}
</script>

<style lang="scss" scoped>
.inputNumberContent {
  .el-input-number {
    width: 100%;
  }
}
</style>
