<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :style="widget.activeStyle"
  >
    <draggable
      class="operateContent"
      :class="[selected ? 'selected' : '']"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
      handle=".drag-handler"
      @add="ev => designer.dealWidgetAdd(ev, widget.widgetList)"
      @click.native.stop="selectWidget(widget)"
    >
      <template v-if="widget.widgetList && widget.widgetList.length > 0">
        <template v-for="(subWidget, swIdx) in widget.widgetList">
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
        </template>
      </template>
      <DragEmpty v-else :empty-desc="widget.emptyDesc"></DragEmpty>
    </draggable>
  </container-wrapper>
</template>

<script>
import DragEmpty from '../../common/dragEmpty/dragEmpty'
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'OperateWidget',
  components: { DragEmpty },
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
  },
  watch: {
    // 此处监听，处理form的被触发事件
    'designer.triggerEventStatus': {
      handler(newV, oldV) {},
      deep: true,
    },
    'widget.widgetList': {
      handler(newV) {},
      deep: true,
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.operateContent {
  width: 100%;
  min-height: 50px;
  height: 100%;
  padding: 5px;
  outline: 1px dashed #336699;
}
.selected {
  outline: 2px solid #409eff !important;
}
</style>
