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
    :rules="rules"
  >
    <el-select
      v-model="selectVal"
      :key="selectKey"
      :style="widget.activeStyle"
      v-bind="widget.options"
      :clearable="widget.options.multipleClearable"
    >
      <el-option
        v-for="item in widget.options.selectOptions"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </FormItemWrapper>
</template>

<script>
import FormItemWrapper from '../form-item-wrapper'
export default {
  components: { FormItemWrapper },
  name: 'select-widget',
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
  data() {
    return {
      selectKey: new Date().getTime(),
    }
  },
  computed: {
    selectVal: {
      get() {
        return this.formData ? this.formData[this.widget.options.fieldName] : this.widget.value
      },
      set(val) {
        this.widget.value = val
        this.formData && (this.formData[this.widget.options.fieldName] = val)
      },
    },
    rules() {
      return [
        {
          validator: (rule, value, callback) => {
            if (this.widget.options.isRequired) {
              if (!value) {
                callback(new Error('请选择'))
              }
              callback()
            }
            callback()
          },
          required: this.widget.options.isRequired,
          trigger: 'change',
        },
      ]
    },
  },
  watch: {
    'widget.options': {
      handler(newV, oldV) {
        if (newV.multiple) {
          this.widget.value = []
        } else {
          this.widget.value = ''
        }
        this.selectKey = new Date().getTime()
      },
      deep: true,
    },
  },

  methods: {},
  mounted() {},
}
</script>

<style></style>
