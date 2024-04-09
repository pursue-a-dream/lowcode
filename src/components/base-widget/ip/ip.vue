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
    :rules="[]"
  >
    <h-ip-input
      :key="widget.options.tipsPlacement + widget.options.tips"
      v-model="inputVal"
      :style="widget.activeStyle"
      v-bind="widget.options"
    />
  </FormItemWrapper>
</template>

<script>
import FormItemWrapper from '../form-item-wrapper'
export default {
  name: 'IpWidget',
  components: { FormItemWrapper },
  props: {
    widget: { type: Object, default: () => {} },
    parentWidget: { type: Object, default: () => {} },
    parentList: { type: Array, default: () => [] },
    indexOfParentList: { type: Number, default: 0 },
    designer: { type: Object, default: () => {} },

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
    formData: { type: Object, default: () => {} },
  },
  computed: {
    inputVal: {
      get() {
        return this.formData ? this.formData[this.widget.options.fieldName] : this.widget.value
        // return this.widget.value
      },
      set(val) {
        this.widget.value = val
        this.formData && (this.formData[this.widget.options.fieldName] = val)
      },
    },
  },
}
</script>
