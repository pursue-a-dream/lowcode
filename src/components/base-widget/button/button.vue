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
    <el-button
      ref="fieldEditor"
      v-bind="widget.options"
      :style="widget.activeStyle"
      @click.native.stop="handleButtonClick"
    >
      {{ widget.options.label }}</el-button
    ></BaseWrapper
  >
</template>

<script>
import BaseWrapper from '../base-wrapper'
export default {
  name: 'ButtonWidget',
  components: { BaseWrapper },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
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
  methods: {
    handleButtonClick() {
      // 处理在table中的操作按钮
      if (this.row) {
        this.$emit('selectRow', this.row)
      }
      // dealWidgetAction 处理widget的事件，传入两个参数，第一个是当前widget、第二个:触发事件
      this.designer.dealWidgetAction(this.widget, 'click', this.designer)
    },
  },
}
</script>

<style></style>
