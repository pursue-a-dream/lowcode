<template>
  <draggable
    v-if="widget.widgetList && widget.widgetList.length > 0"
    class="commonTemContent"
    v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
    handle=".drag-handler"
    :list="widget.widgetList"
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
      ></component>
    </template>
  </draggable>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'CommonTemWidget',
  mixins: [containerMixin],
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
}
</script>

<style lang="scss">
.commonTemContent {
  width: 100%;
  min-height: 50px;
}
</style>
