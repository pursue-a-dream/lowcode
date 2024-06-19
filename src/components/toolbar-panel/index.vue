<template>
  <div class="toolbar-container">
    <div class="left-toolbar">
      <el-button type="text" :disabled="undoDisabled" @click="undoHistory"> 撤销</el-button>
      <el-button type="text" :disabled="redoDisabled" @click="redoHistory"> 重做</el-button>
      <el-button-group style="margin-left: 20px">
        <el-button size="small" :type="layoutType === 'PC' ? 'info' : ''" @click="changeLayoutType('PC')">
          pc</el-button
        >
        <el-button size="small" :type="layoutType === 'Pad' ? 'info' : ''" @click="changeLayoutType('Pad')">
          客户端</el-button
        >
      </el-button-group>
    </div>
    <div class="right-toolbar">
      <div class="right-toolbar-con">
        <el-button type="link" icon="h-icon-delete" @click="clearFormWidget"> 清空</el-button>
        <!-- <el-button type="link" icon="h-icon-download" @click="saveFile">下载</el-button> -->
        <el-button
          v-if="this.$route.query.editID"
          type="link"
          icon="h-icon-capture"
          @click="saveCurentPageConfig"
          >缓存</el-button
        >
        <el-button type="link" icon="h-icon-mark" @click="$emit('saveTem')">存储模板</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { generatePage } from '@/compile/vue2/index.js'
export default {
  props: {
    designer: Object,
  },
  computed: {
    layoutType() {
      return this.designer.getLayoutType()
    },
    undoDisabled() {
      return !this.designer.undoEnabled()
    },

    redoDisabled() {
      return !this.designer.redoEnabled()
    },
  },
  methods: {
    changeLayoutType(newType) {
      this.designer.changeLayoutType(newType)
    },
    undoHistory() {
      this.designer.undoHistoryStep()
    },
    saveCurentPageConfig() {
      this.$emit('saveCurentPageConfig')
    },
    redoHistory() {
      this.designer.redoHistoryStep()
    },
    clearFormWidget() {
      this.designer.clearDesigner()
    },
    saveFile() {
      // console.log('this.designer', JSON.stringify(this.designer.layers))
      generatePage(this.designer)
    },
  },
}
</script>

<style lang="scss" scoped>
.toolbar-container {
  padding: 0 10px;
  .left-toolbar {
    float: left;
    font-size: 16px;
  }
  .right-toolbar {
    float: right;
    //width: 420px;
    text-align: right;
    overflow: hidden;

    .right-toolbar-con {
      text-align: left;
      width: auto;
    }

    ::v-deep .el-button--text {
      font-size: 14px !important;
    }
  }
}
</style>
