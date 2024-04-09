<template>
  <BaseWrapper
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
  >
    <el-alert :style="widget.activeStyle" v-bind="widget.options" :type="widget.options.alertType">
      {{ widget.options.label }}</el-alert
    ></BaseWrapper
  >
</template>

<script>
import BaseWrapper from '../base-wrapper'
export default {
  name: 'AlertWidget',
  components: { BaseWrapper },
  props: {
    widget: {
      type: Object,
      default: null,
    },
    parentWidget: {
      type: Object,
      default: null,
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
    row: {
      type: Object,
      default: null,
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
  },
  methods: {},
}
</script>

<style></style>
