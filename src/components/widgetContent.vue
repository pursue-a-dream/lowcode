<template>
  <div class="widgetContent">
    <div v-if="!designer.widgetList || designer.widgetList.length === 0" class="no-widget-hint">
      请从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处.
    </div>
    <!-- 页面图层 -->
    <draggable
      v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 300 }"
      handle=".drag-handler"
      :class="[layoutType + '-layout']"
      @add="ev => designer.dealWidgetAdd(ev, designer.widgetList)"
    >
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
    </draggable>
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
    <!-- <message-box /> -->
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
export default {
  components: { Draggable },
  props: {
    designer: Object,
  },
  data() {
    return {
      activeName: 'first',
      activeNames: ['1', '2'],
    }
  },

  computed: {
    layoutType() {
      return this.designer.getLayoutType()
    },
  },
  watch: {
    // 'designer.widgetList': {
    //   handler(newV, oldV) {
    //     console.log('newV', newV, this.designer.widgetList)
    //     let arr = []
    //     newV.forEach(element => {
    //       Array.isArray(element) ? arr.push(...element) : arr.push(element)
    //     })
    //     console.log('arr', arr)
    //     this.designer.widgetList = arr
    //   },
    //   deep: true,
    // },
  },
  methods: {
    getWidgetName(widget) {
      return widget.type + '-widget'
    },
  },
}
</script>

<style lang="scss" scoped>
.widgetContent {
  position: relative;
  bottom: 0;
  height: 100%;
  padding: 10px;
  background: #f1f2f3;
  overflow-x: hidden;
  // overflow-y: auto;
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
    height: calc(100vh - 48px - 90px);
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
