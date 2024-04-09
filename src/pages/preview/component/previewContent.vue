<template>
  <div class="previewContent">
    <!-- 页面图层 -->
    <!-- <draggable
      :list="designer.widgetList"
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 300 }"
      handle=".drag-handler"
      :class="[layoutType + '-layout']"
    > -->
    <transition-group name="fade" tag="div" class="form-widget-list">
      <template v-for="(widget, index) in designer.widgetList">
        <component
          :is="getWidgetName(widget)"
          :key="widget.id"
          :widget="widget"
          :designer="designer"
          :parent-list="designer.widgetList"
          :index-of-parent-list="index"
          :parent-widget="null"
        ></component>
      </template>
    </transition-group>
    <!-- </draggable> -->
    <!-- 图层元素触发的图层 -->
    <template v-for="(widget, index) in designer.layers">
      <component
        :is="getWidgetName(widget)"
        :key="widget.id"
        :widget="widget"
        :designer="designer"
        :parent-list="designer.layers"
        :index-of-parent-list="index"
        :parent-widget="null"
      ></component>
    </template>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
export default {
  components: {
    Draggable,
  },
  props: {
    designer: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  computed: {
    layoutType() {
      return this.designer.getLayoutType()
    },
  },
  methods: {
    getWidgetName(widget) {
      return widget.type + '-widget'
    },
  },
}
</script>

<style lang="scss" scoped>
.previewContent {
  position: relative;
  bottom: 0;
  height: 100%;
  padding: 10px;
  background: #f1f2f3;
  overflow-x: hidden;
  .no-widget-hint {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 18px;
    color: #999999;
  }
  .form-widget-list {
    padding: 5px;
    background: #ffffff;
    width: 100%;
    height: calc(100vh);
    min-height: 250px;
    overflow-y: auto;
  }
  .Pad-layout {
    margin: 0 auto;
    max-width: 960px;
    border-radius: 15px;
    box-shadow: 0 0 1px 10px #495060;
  }
}
</style>
