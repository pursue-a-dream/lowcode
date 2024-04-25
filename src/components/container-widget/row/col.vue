/* eslint-disable */
<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    style="margin: 0"
  >
    <draggable
      :class="[colSelected ? 'colSelected' : '']"
      style="padding: 5px; min-height: 50px"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
      handle=".drag-handler"
      :move="checkContainerMove"
      @add="ev => designer.dealWidgetAdd(ev, widget.widgetList)"
      @update="onContainerDragUpdate"
      @click.native.stop="selectWidget(widget)"
    >
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <component
          :is="subWidget.type + '-widget'"
          v-if="'container' === subWidget.category"
          :key="subWidget.id"
          :widget="subWidget"
          :designer="designer"
          :parent-list="widget.widgetList"
          :index-of-parent-list="swIdx"
          :parent-widget="widget"
          :row="row"
        ></component>
        <component
          :is="subWidget.type + '-widget'"
          v-else
          :key="subWidget.id"
          :widget="subWidget"
          :designer="designer"
          :parent-list="widget.widgetList"
          :index-of-parent-list="swIdx"
          :parent-widget="widget"
          :design-state="true"
          :row="row"
        ></component>
      </template>
    </draggable>
  </container-wrapper>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'ColWidget',
  mixins: [containerMixin],
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
    row: Object,
  },
  data() {
    return {}
  },
  computed: {
    colSelected() {
      return this.widget.id === this.designer.selectedId
    },
  },
  watch: {
    // 此处监听，处理form的被触发事件
    'designer.triggerEventStatus': {
      handler(newV, oldV) {
        let formSubmit = this.widget.id + 'formSubmit'
        if (newV[formSubmit] !== oldV[formSubmit]) {
          this.$message({
            message: '表单提交',
            type: 'success',
          })
        }
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
.colSelected {
  border: 2px solid #409eff !important;
}
</style>
