<template>
  <h-drawer
    v-bind="widget.options"
    @closed="() => {}"
    @close="
      () => {
        widget.options.visible = false
      }
    "
    ><container-wrapper
      :designer="designer"
      :widget="widget"
      :parent-widget="parentWidget"
      :parent-list="parentList"
      :index-of-parent-list="indexOfParentList"
      class="drawer-content"
      style="width: 100%; height: 100%"
      :class="[selected ? 'selected' : '', customClass]"
      @click.native.stop="selectWidget(widget)"
    >
      <draggable
        style="width: 100%; height: 100%"
        v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
        handle=".drag-handler"
        @add="ev => designer.dealWidgetAdd(ev, widget.widgetList)"
      >
        <template v-for="(subWidget, swIdx) in widget.widgetList">
          <component
            :is="subWidget.type + '-widget'"
            :key="subWidget.id"
            :widget="subWidget"
            :designer="designer"
            :parent-list="widget.widgetList"
            :index-of-parent-list="swIdx"
            :parent-widget="widget"
          />
        </template>
      </draggable>
    </container-wrapper>
    <span slot="footer" class="drawerFooter">
      <el-button
        v-show="widget.options.hasAddBtnName"
        type="primary"
        @click.native.stop="handleButtonClick"
        >{{ widget.options.addBtnName }}</el-button
      >
      <el-button
        v-show="widget.options.hasCancelBtnName"
        @click="
          () => {
            widget.options.visible = false
          }
        "
        >{{ widget.options.cancelBtnName }}</el-button
      >
    </span>
  </h-drawer>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'DrawerWidget',
  mixins: [containerMixin],
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
  data() {
    return {}
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
        let drawerClose = this.widget.id + 'drawerClose'
        if (newV[drawerClose] != oldV[drawerClose]) {
          this.widget.options.visible = false
          // this.$message({
          //   message: 'drawerClose',
          //   type: 'success',
          // })
        }
      },
      deep: true,
    },
  },
  methods: {
    handleButtonClick() {
      // dealWidgetAction 处理widget的事件，传入两个参数，第一个是当前widget、第二个:触发事件
      this.designer.dealWidgetAction(this.widget, 'drawerConfirmClick', this.designer)
    },
  },
}
</script>

<style lang="scss">
.drawer-content {
  padding: 5px 2px;
  outline: 1px dashed #336699;
  .selected {
    outline: 2px solid #409eff !important;
  }
}
</style>
