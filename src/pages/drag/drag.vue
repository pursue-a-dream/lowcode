<template>
  <div class="dragContent">
    <h-layout>
      <h-layout-aside class="side-panel">
        <widget-panel ref="widgetPanel" :designer="designer" />
      </h-layout-aside>

      <h-layout class="center-layout-container">
        <h-layout-header class="toolbar-header">
          <toolbar-panel
            :designer="designer"
            @saveCurentPageConfig="saveCurentPageConfig"
            @saveTem="saveTem"
          />
        </h-layout-header>
        <h-layout-content class="form-widget-main">
          <widget-content :designer="designer" />
        </h-layout-content>
        <tag v-if="this.$route.query.editID" ref="tag" :designer="designer" class="tagContent" />
      </h-layout>

      <h-layout-aside class="setting-panel">
        <setting-panel
          :designer="designer"
          :selected-widget="designer.selectedWidget"
          :form-config="designer.formConfig"
        />
      </h-layout-aside>
    </h-layout>
  </div>
</template>

<script>
import WidgetPanel from '@/components/widgetPanel.vue'
import widgetContent from '@/components/widgetContent.vue'
import settingPanel from '@/components/settingPanel/settingPanel.vue'
import ToolbarPanel from '@/components/toolbar-panel/index'
import tag from './component/tag.vue'
import { createDesigner } from '@/designer.js'
export default {
  name: 'App',
  components: { WidgetPanel, widgetContent, settingPanel, ToolbarPanel, tag },
  data() {
    return {
      designer: createDesigner(this),
    }
  },
  created() {
    this.designer.initDesigner()
  },
  methods: {
    saveCurentPageConfig() {
      this.$refs['tag'].saveCurentPageConfig('已保存')
    },
    saveTem() {
      this.$refs.widgetPanel.saveTem()
    },
  },
}
</script>

<style lang="scss">
.dragContent {
  height: calc(100% - 48px);
  .h-layout-aside.side-panel {
    width: 260px !important;
    overflow-y: hidden;
  }

  .h-layout-header.toolbar-header {
    font-size: 14px;
    border-bottom: 1px dotted #cccccc;
    height: 42px !important;
    //line-height: 42px !important;
  }
  .h-layout.center-layout-container {
    min-width: 680px;
    border-left: 2px dotted #ebeef5;
    border-right: 2px dotted #ebeef5;
    position: relative;
    .tagContent {
      position: absolute;
      bottom: 5px;
      background-color: #ffffff;
      margin: 0 10px;
      display: flex;
      align-items: center;
      padding: 2px;
      width: calc(100% - 20px);
      overflow-x: auto;
      box-sizing: border-box;
    }
  }
  .h-layout-content.form-widget-main {
    padding: 0;

    position: relative;
    overflow-x: hidden;
  }
  .setting-panel {
    width: 300px !important;
    overflow-y: hidden;
    padding: 0 8px !important;
  }
}
.el-dialog__wrapper,
.el-drawer__wrapper,
.v-modal {
  position: fixed;
  top: 100px;
  left: 275px;
  right: 310px;
  width: auto;
  height: auto;
  bottom: 20px;
  background: rgba(77, 77, 77, 0.4);
}
</style>
