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
    <el-tabs class="tabs-content" v-model="activeName" v-bind="widget.options" @tab-click="handleClick">
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <el-tab-pane :key="subWidget.id" v-bind="subWidget.options" :label="subWidget.options?.paneLabel">
          <component
            :is="subWidget.type + '-widget'"
            :widget="subWidget"
            :designer="designer"
            :parent-list="widget.widgetList"
            :index-of-parent-list="swIdx"
            :parent-widget="widget"
            :design-state="true"
            :key="subWidget.id"
          ></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </container-wrapper>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'tabs-widget',
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
.tabs-content {
  .el-tab-pane {
    margin: 2px;
    // padding: 0 5px;
    outline: 1px dashed #336699;
    .container-wrapper {
      margin-bottom: 0;
    }
  }
  // outline: 1px dashed #336699;
  // .selected {
  //   outline: 2px solid #409eff !important;
  // }
}
</style>
