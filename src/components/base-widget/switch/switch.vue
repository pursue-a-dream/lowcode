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
    <el-switch
      v-bind="widget.options"
      :style="widget.activeStyle"
      v-model="val"
      @change="change"
      :before-change="beforeChange"
    >
      {{ widget.options.label }}</el-switch
    ></BaseWrapper
  >
</template>

<script>
import BaseWrapper from '../base-wrapper'
export default {
  name: 'SwitchWidget',
  components: { BaseWrapper },
  props: {
    widget: { type: Object, default: () => {} },
    parentWidget: { type: Object, default: () => {} },
    parentList: { type: Array, default: () => [] },
    indexOfParentList: { type: Number, default: 0 },
    designer: { type: Object, default: () => {} },
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
  data() {
    return {
      val: '',
      done: null,
    }
  },
  watch: {
    // 此处监听，处理form的被触发事件
    'designer.triggerEventStatus': {
      handler(newV, oldV) {
        let switchChange = this.widget.id + 'switchChange'
        if (newV[switchChange] != oldV[switchChange]) {
          this.done && this.done()
        }
      },
      deep: true,
    },
  },
  methods: {
    change() {
      console.log('change')
      // dealWidgetAction 处理widget的事件，传入两个参数，第一个是当前widget、第二个:触发事件
      this.designer.dealWidgetAction(this.widget, 'change', this.designer)
    },
    beforeChange(value, done, uuid) {
      // console.log('22222', this.widget)
      this.designer.dealWidgetAction(this.widget, 'changeBefore', this.designer)
      this.done = done
      // this.$confirm(`确定${!value ? '禁用' : '启用'}此日志上报地址吗？`, {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'question',
      // })
      //   .then(() => {
      //     done()
      //   })
      //   .catch(() => {})
    },
  },
}
</script>

<style></style>
