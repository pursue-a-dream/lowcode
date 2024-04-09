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
    <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="filter-tree-input"></el-input>
    <el-tree
      ref="tree"
      v-bind="widget.options"
      :key="treeKey"
      :data="widget.options.dataSource"
      :props="widget.options.propsConf"
      :style="widget.activeStyle"
      :filter-node-method="filterNode"
      @node-click="nodeClick"
      @check="nodeCheck"
    ></el-tree>
  </BaseWrapper>
</template>

<script>
import BaseWrapper from '../base-wrapper'
export default {
  components: { BaseWrapper },
  name: 'tree-widget',
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
  data() {
    return {
      filterText: '',
      treeKey: new Date().getTime(),
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val, !this.filterText)
    },
    // 此处为了触发tree组件从新渲染
    'widget.options': {
      handler(newV, oldV) {
        this.treeKey = new Date().getTime()
      },
      deep: true,
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(clickNode) {
      this.designer.dealWidgetAction(this.widget, 'nodeClick', this.designer)
      this.widget.widgetProvideData.clickNode = {
        value: 'clickNode',
        label: '点击节点',
        data: clickNode,
      }
    },
    nodeCheck() {
      this.widget.widgetProvideData.checkedKeys = {
        value: 'checkedKeys',
        label: '选中节点数组',
        data: this.$refs.tree.getCheckedKeys(),
      }
    },
  },
}
</script>

<style></style>
