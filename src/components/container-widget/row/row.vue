<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :class="[selected ? 'selected' : '', customClass]"
    style="padding: 5px; border: 1px dashed #336699"
    @click.native.stop="selectWidget(widget)"
  >
    <el-row v-model="activeName" class="row-content" v-bind="widget.options" @tab-click="handleClick">
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <el-col
          :key="subWidget.id"
          class="colContent"
          v-bind="subWidget.options"
          :label="subWidget.options?.paneLabel"
        >
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
        </el-col>
      </template>
    </el-row>
  </container-wrapper>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'RowWidget',
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
        let tabsClose = this.widget.id + 'tabsClose'
        if (newV[tabsClose] != oldV[tabsClose]) {
          this.widget.options.visible = false
          this.$message({
            message: 'tabsClose',
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
.row-content {
  // outline: 1px dashed #336699;
  .selected {
    outline: 2px solid #409eff !important;
  }
  .colContent {
    border: 1px dashed #336699;
  }
}
</style>
