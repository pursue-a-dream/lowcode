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
    :rules="[{ required: widget.options.isRequired, message: '请选择' }]"
  >
    <el-radio-group v-model="radioVal">
      <template v-if="widget.options.showType === 'radio'">
        <el-radio
          v-for="item in widget.options.radioArr"
          :key="item.val"
          :disabled="!!item.disabled"
          :label="item.val"
        >
          {{ item.label }}
        </el-radio>
      </template>
      <template v-if="widget.options.showType === 'button'">
        <el-radio-button
          v-for="item in widget.options.radioArr"
          :key="item.val"
          :disabled="!!item.disabled"
          :label="item.val"
          >{{ item.label }}</el-radio-button
        >
      </template>
    </el-radio-group>
  </FormItemWrapper>
</template>

<script>
import FormItemWrapper from '../form-item-wrapper'
export default {
  name: 'RadioWidget',
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
  data() {
    return {}
  },
  computed: {
    radioVal: {
      get() {
        return Object(this.formData).hasOwnProperty(this.widget.options.fieldName)
          ? this.formData[this.widget.options.fieldName]
          : this.widget.value
      },
      set(val) {
        this.widget.value = val
        this.formData && (this.formData[this.widget.options.fieldName] = val)
      },
    },
  },
}
</script>
