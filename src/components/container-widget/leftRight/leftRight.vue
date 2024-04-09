<template>
  <container-wrapper
    class="leftRightContent"
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
  >
    <draggable
      :class="[selected ? 'selected' : '', customClass, 'dragContent']"
      :list="widget.widgetList"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
      handle=".drag-handler"
      @click.native.stop="selectWidget(widget)"
    >
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <component
          :key="subWidget.id"
          :is="subWidget.type + '-widget'"
          :widget="subWidget"
          :designer="designer"
          :parent-list="widget.widgetList"
          :index-of-parent-list="swIdx"
          :parent-widget="widget"
        ></component>
      </template>
    </draggable>
  </container-wrapper>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'left-right-widget',
  mixins: [containerMixin],
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    },
  },
}
</script>

<style lang="scss">
.leftRightContent {
  .dragContent {
    width: 100%;
    min-height: 50px;
    padding: 5px;
    outline: 1px dashed #336699;
    display: flex;
    justify-content: left;
    align-items: center;
  }
}
</style>
