<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
  >
    <draggable
      class="formContent"
      :class="[selected ? 'selected' : '', customClass]"
      :move="checkContainerMove"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
      handle=".drag-handler"
      :list="widget.widgetList"
      @update="onContainerDragUpdate"
      @click.native.stop="selectWidget(widget)"
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
          :design-state="'container' !== subWidget.category"
        ></component>
      </template>
    </draggable>
  </container-wrapper>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'CommonContainer',
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
  methods: {
    onContainerDragAdd() {},
    onContainerDragUpdate() {},
    checkContainerMove() {},
  },
}
</script>

<style lang="scss">
.formContent {
  width: 100%;
  height: 100%;
  min-height: 50px;
  padding: 5px;
  outline: 1px dashed #336699;
}
.selected {
  outline: 2px solid #409eff !important;
}
</style>
