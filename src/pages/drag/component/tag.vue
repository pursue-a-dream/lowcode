<template>
  <div class="tagContent">
    <el-tag
      v-for="tag in tagList"
      :key="tag.temName"
      class="tag"
      :closable="true"
      :disable-transitions="false"
      :type="activeTag === tag.temName ? 'success' : 'primary'"
      @close="handleClose(tag)"
    >
      <div @click="tagClick(tag)">{{ tag.temName }}</div>
    </el-tag>
    <el-button class="button-new-tag" size="small" @click="$refs.addTem.toShow()">+ 新增页面</el-button>
    <dialog-form
      ref="addTem"
      class="addTem"
      dialog-title="添加项目"
      :form-data="addTemFormData"
      :form-item-arr="addTemFormItemArr"
      @formConfirm="addTemFormConfirm"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { transStrFnToFn } from '@/utils/util.js'
export default {
  props: {
    designer: { type: Object, default: () => {} },
    updateTagList: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
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
    handleClose({ id, temName }) {
      this.$confirm('确定删除当前页面？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        onConfirm: () => {
          this.delTem({
            id,
          }).then(res => {
            this.$message.success('删除成功')
            this.activeTag === temName && (this.activeTag = '')
            this.getTagList()
          })
        },
      })
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    addTemFormConfirm() {
      const params = {
        ...this.addTemFormData,
        temType: 'project',
        projectId: this.$route.query.editID,
        temContent: {
          widgetList: [],
          layers: [],
        },
      }
      this.addTem(params)
        .then(res => {
          if (res.code === 1) {
            this.$refs.addTem.toClose()
            this.activeTag = params.temName
            this.designer.layers = []
            this.designer.widgetList = []
            this.getTagList()
          }
        })
        .catch(() => {
          this.$refs['addTem'].noLoading()
        })
    },
    getTagList() {
      this.getTem(this.$route.query.editID).then(res => {
        if (res.code === 1) {
          this.tagList = res.data
          this.$emit('updateTagList', res.data)
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
      if (this.activeTag) {
        this.saveCurentPageConfig()
      }
      this.activeTag = temName
      this.designer.layers = layers
      this.designer.widgetList = widgetList
    },
    async saveCurentPageConfig(msg) {
      const { id } = this.tagList.find(item => {
        return item.temName === this.activeTag
      })

      const res = await this.updateTem({
        id,
        temContent: {
          layers: this.designer.layers,
          widgetList: this.designer.widgetList,
        },
      })
      if (res.code === 1 && msg) {
        this.$message.success(this.activeTag + '页面已保存')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.tagContent {
  .tag {
    min-width: 80px;
    cursor: pointer;
  }
  .button-new-tag {
    min-width: 80px;
  }
}
</style>
