<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :class="[selected ? 'selected' : '', customClass]"
    style="padding: 5px"
    @click.native.stop="selectWidget(widget)"
  >
    <el-collapse
      v-model="activeName"
      class="collapse-content"
      v-bind="widget.options"
      @tab-click="handleClick"
    >
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <el-collapse-item :key="subWidget.id" v-bind="subWidget.options" :label="subWidget.options.paneLabel">
          <component
            :is="subWidget.type + '-widget'"
            :key="subWidget.id"
            :widget="subWidget"
            :designer="designer"
            :parent-list="widget.widgetList"
            :index-of-parent-list="swIdx"
            :parent-widget="widget"
            :design-state="true"
          ></component>
        </el-collapse-item>
      </template>
    </el-collapse>
  </container-wrapper>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'CollapseWidget',
  mixins: [containerMixin],
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
  data() {
    return { activeName: '' }
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
        let collapseClose = this.widget.id + 'collapseClose'
        if (newV[collapseClose] != oldV[collapseClose]) {
          this.widget.options.visible = false
          this.$message({
            message: 'collapseClose',
            type: 'success',
          })
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.activeName = this.widget.widgetList[0]?.options.name
  },
  methods: {
    handleClick(tab, event) {
      // this.selectWidget(this.widget.widgetList[tab.index])
    },
  },
}
</script>

<style lang="scss">
.collapse-content {
}
</style>
