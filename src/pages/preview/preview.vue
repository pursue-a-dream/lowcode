<template>
  <h-layout class="previewContent" style="height: 100%">
    <h-layout-aside width="200px" style="line-height: 360px">
      <el-menu default-active="0">
        <el-menu-item
          v-for="(item, index) in tagList"
          :key="index"
          :index="index + ''"
          @click="tagClick(item)"
        >
          {{ item.temName }}
        </el-menu-item>
      </el-menu>
    </h-layout-aside>
    <h-layout>
      <h-layout-content> <preview-content :designer="designer" /> </h-layout-content>
    </h-layout>
  </h-layout>
</template>

<script>
import { mapActions } from 'vuex'
import { transStrFnToFn, transObjToStr } from '@/utils/util.js'
import previewContent from './component/previewContent.vue'
import { createDesigner } from '@/designer.js'
export default {
  components: { previewContent },
  data() {
    return {
      designer: createDesigner(this),
      inputVisible: false,
      inputValue: '',
      addTemFormData: { temName: '' },
      addTemFormItemArr: [{ temName: '页面名称', isRequired: true }],
      tagList: [],
      activeTag: '',
    }
  },

  mounted() {
    this.getTagList()
  },
  methods: {
    ...mapActions('drag', ['addTem', 'getTem', 'delTem', 'updateTem']),

    getTagList() {
      this.getTem(this.$route.query.projectId).then(res => {
        if (res.code === 1) {
          this.tagList = res.data
          if (!this.activeTag && res.data[0]) {
            const {
              temName,
              temContent: { widgetList, layers },
            } = res.data[0]
            this.activeTag = temName
            this.designer.layers = transStrFnToFn(layers)
            this.designer.widgetList = transStrFnToFn(widgetList)
          }
        }
      })
    },
    // 处理标签点击逻辑
    async tagClick({ temName, temContent: { widgetList, layers } }) {
      // 在离开前更新上一次标签页面的配置数据
      this.activeTag = temName
      this.designer.layers = layers
      this.designer.widgetList = widgetList
    },
  },
}
</script>
<style lang="scss" scoped>
.previewContent {
  .h-layout-aside {
    background-color: #252525 !important;
    .el-menu {
      background-color: #262626 !important;
    }
    .h-page-menu {
      background-color: #262626 !important;
    }
    .el-menu-collapse-wrap .el-submenu__collpase-title {
      color: rgba(255, 255, 255, 0.7) !important;
    }
    .el-submenu__title {
      color: rgba(255, 255, 255, 0.4) !important;
    }
    .el-menu-item {
      color: rgba(255, 255, 255, 0.4) !important;
    }
    .el-menu .el-menu-item.is-active {
      background-color: rgba(0, 0, 0, 0.4) !important;
      color: rgba(255, 255, 255, 0.9) !important;
    }
  }
}
</style>
