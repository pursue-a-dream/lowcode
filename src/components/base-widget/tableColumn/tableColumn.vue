/* eslint-disable */
<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
  >
    <template v-slot:default>
      <draggable
        :class="[columnSelected ? 'columnSelected' : '', customClass]"
        style="min-height: 40px; padding-top: 5px"
        :list="widget.widgetList"
        v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
        handle=".drag-handler"
        @add="evt => onContainerDragAdd(evt, widget.widgetList)"
        @update="onContainerDragUpdate"
        :move="checkContainerMove"
        @click.native.stop="selectWidget(widget)"
      >
        <template v-if="widget.options.showType === 'normal'">
          <span v-show="widget.widgetList.length === 0">{{
            widget.options.prop && (row[widget.options.prop] || '--')
          }}</span>
          <template v-for="(subWidget, swIdx) in widget.widgetList">
            <component
              v-if="'container' === subWidget.category"
              :key="subWidget.id"
              :is="subWidget.type + '-widget'"
              :widget="subWidget"
              :designer="designer"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
              :row="row"
              @selectRow="selectRow"
            ></component>
            <component
              v-else
              :is="subWidget.type + '-widget'"
              :widget="subWidget"
              :designer="designer"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
              :design-state="true"
              :key="subWidget.id"
              :row="row"
              @selectRow="selectRow"
            ></component>
          </template>
        </template>
        <template v-else-if="widget.options.showType === 'time'">
          {{ timeToString(row[widget.options.prop])?.localeString }}</template
        >
        <template v-else-if="widget.options.showType === 'statusMap'">
          <span
            :style="`color: ${
              widget.options.statusMap[row[widget.options.prop]]
                ? widget.options.statusMap[row[widget.options.prop]].color
                : ''
            }`"
            >{{
              widget.options.statusMap[row[widget.options.prop]]
                ? widget.options.statusMap[row[widget.options.prop]].label
                : '--'
            }}</span
          >
        </template>
        <template v-else-if="widget.options.showType === 'filterArr'">
          <el-tag
            :type="
              widget.options.filterArr[row[widget.options.prop]]
                ? widget.options.filterArr[row[widget.options.prop]].type
                : ''
            "
            :color="
              widget.options.filterArr[row[widget.options.prop]]
                ? widget.options.filterArr[row[widget.options.prop]].color
                : ''
            "
          >
            {{
              widget.options.filterArr[row[widget.options.prop]]
                ? widget.options.filterArr[row[widget.options.prop]].text
                : ''
            }}</el-tag
          >
        </template>
      </draggable>
    </template>
  </container-wrapper>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
import { timeToString } from '@/utils/util.js'
export default {
  name: 'table-column-widget',
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
    return { timeToString }
  },
  computed: {
    columnSelected() {
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
        if (newV[formSubmit] != oldV[formSubmit]) {
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
    selectRow(row) {
      this.$emit('selectRow', row)
    },
  },
}
</script>

<style lang="scss">
.columnSelected {
  border: 2px solid #409eff !important;
}
</style>
