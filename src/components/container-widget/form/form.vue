<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
  >
    <el-form :ref="widget.options.name" v-bind="widget.options" :model="formData" :style="widget.activeStyle">
      <draggable
        class="formContent"
        :class="[selected ? 'selected' : '', customClass]"
        :list="widget.widgetList"
        v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
        :move="checkContainerMove"
        handle=".drag-handler"
        @add="evt => onContainerDragAdd(evt, widget.widgetList)"
        @update="onContainerDragUpdate"
        @click.native.stop="selectWidget(widget)"
      >
        <template v-for="(subWidget, swIdx) in widget.widgetList" class="formItem">
          <component
            :is="subWidget.type + '-widget'"
            v-show="subWidget.options.widgetshow ? subWidget.options.widgetshow(formData) : true"
            :key="subWidget.id"
            :style="widget.options.inline ? `width: ${widget.options.childWidthPercent}` : ''"
            :widget="subWidget"
            :designer="designer"
            :parent-list="widget.widgetList"
            :index-of-parent-list="swIdx"
            :parent-widget="widget"
            :design-state="'container' !== subWidget.category"
            :form-data="formData"
          ></component>
        </template>
      </draggable>
    </el-form>
  </container-wrapper>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'form-widget',
  mixins: [containerMixin],
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
  data() {
    return {
      formData: {},
    }
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    },
  },
  watch: {
    // 此处监听，处理form的被触发事件
    'designer.triggerEventStatus': {
      handler(newV, oldV) {
        let formSubmit = this.widget.id + 'formSubmit'
        let formReset = this.widget.id + 'formReset'
        if (newV[formSubmit] != oldV[formSubmit]) {
          this.$message({
            message: '表单提交',
            type: 'success',
          })
        }
        if (newV[formReset] != oldV[formReset]) {
          this.formData = {}
          this.$message({
            message: '表单重置',
            type: 'success',
          })
          this.$refs[this.widget.options.name].resetFields()
        }
      },
      deep: true,
    },
    'widget.widgetList': {
      handler(newV) {
        let newFormData = {}
        newV &&
          newV.map(item => {
            if (item.formItemFlag) {
              newFormData[item.options.fieldName] = item.value
            }
          })
        this.widget.widgetProvideData.formData = { value: 'formData', label: '表单数据', data: newFormData }
        this.formData = newFormData
      },
      deep: true,
    },
  },
  methods: {
    onContainerDragAdd() {},
    onContainerDragUpdate() {},
    checkContainerMove() {},
  },
}
</script>

<style lang="scss">
.formContent {
  width: 100%;
  min-height: 50px;
  padding: 5px;
  outline: 1px dashed #336699;
}
.el-form--inline {
  .el-form-item {
    width: 100%;
  }
  .formContent {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
.selected {
  outline: 2px solid #409eff !important;
}
</style>
