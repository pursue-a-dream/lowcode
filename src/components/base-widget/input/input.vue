<template>
  <FormItemWrapper
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
    :rules="[
      {
        required: widget.options.isRequired,
        message: '请输入',
        trigger: 'change',
      },
    ]"
  >
    <el-input v-model="inputVal" :style="widget.activeStyle" v-bind="widget.options"></el-input>
  </FormItemWrapper>
</template>

<script>
import FormItemWrapper from '../form-item-wrapper'
export default {
  name: 'InputWidget',
  components: { FormItemWrapper },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

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
    formData: Object,
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
  mounted() {},

  methods: {},
}
</script>

<style></style>
