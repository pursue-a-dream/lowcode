<template>
  <div class="side-scroll-bar">
    <el-tabs v-model="activeName" style="height: 100%" @tab-click="handleClick">
      <el-tab-pane name="first">
        <span slot="label"> 组件库 </span>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="容器组件" name="1">
            <!-- :clone="handleContainerWidgetClone" -->
            <draggable
              tag="ul"
              :list="containers"
              :group="{ name: 'dragGroup', pull: 'clone', put: false }"
              ghost-class="ghost"
              :sort="false"
              :move="checkContainerMove"
              @end="onContainerDragEnd"
            >
              <li
                v-for="(ctn, index) in containers"
                v-show="!ctn.notInWidgetPanel"
                :key="index"
                class="container-widget-item"
                :title="ctn.displayName"
                widgetType="container"
                :widgetIndex="index"
                @dblclick="addContainerByDbClick(ctn)"
              >
                {{ ctn.name }}
              </li>
            </draggable>
          </el-collapse-item>
          <el-collapse-item title="基础组件" name="2">
            <!-- :clone="handleFieldWidgetClone" -->
            <draggable
              tag="ul"
              :list="basicFields"
              :group="{ name: 'dragGroup', pull: 'clone', put: false }"
              ghost-class="ghost"
              :sort="false"
              :move="checkContainerMove"
              @end="onContainerDragEnd"
            >
              <li
                v-for="(bas, index) in basicFields"
                v-show="!bas.notInWidgetPanel"
                :key="index"
                class="container-widget-item"
                :title="bas.displayName"
                widgetType="basic"
                :widgetIndex="index"
                @dblclick="addContainerByDbClick(bas)"
              >
                {{ bas.name }}
              </li>
            </draggable>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="模板页" name="second">
        <el-input v-model="inputVal" placeholder="请输入模板名进行模糊匹配"></el-input>
        <!-- :clone="copyTemWidget" -->
        <draggable
          tag="ul"
          :list="commonTemList"
          :group="{ name: 'dragGroup', pull: 'clone', put: false }"
          ghost-class="ghost"
          :sort="false"
          @end="onContainerDragEnd"
        >
          <el-card
            v-for="tem in commonTemList.filter(item => {
              return item.temName.includes(inputVal)
            })"
            :key="tem.id"
            widget-type="tem"
            :widget-name="tem.temName"
            :body-style="{ padding: '0px' }"
            style="cursor: pointer"
          >
            <el-popover placement="right" trigger="hover" width="700">
              <img :src="`/lowCode/static/${tem.fileName}`" style="width: 100%" />
              <div slot="reference">
                <img :src="`/lowCode/static/${tem.fileName}`" style="width: 100%; max-height: 150px" />
                <div class="templateName">
                  {{ tem.temName }}
                </div>
              </div>
            </el-popover>
          </el-card>
        </draggable>
      </el-tab-pane>
    </el-tabs>
    <dialog-form
      ref="addTem"
      class="addTem"
      dialog-title="模板处理"
      :form-data="addTemFormData"
      :option-arr-map="{ temNameList }"
      :form-item-arr="addTemFormItemArr"
      @formConfirm="addTemFormConfirm"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { containers, basicFields } from '@/config/widgetsConfig'
import templateArr from '@/config/temJson/index.js'
import { transObjToStr, transStrFnToFn } from '@/utils/util.js'
export default {
  props: {
    designer: Object,
  },
  data() {
    return {
      activeName: 'first',
      inputVal: '',
      activeNames: ['1', '2'],
      containers,
      basicFields,
      templateArr,
      commonTemList: [],
      addTemFormData: {
        temType: 0,
        temName: '',
        bgImg: [],
        id: '',
        neWTemName: '',
        newBgImg: [],
      },
      addTemFormItemArr: [
        {
          temType: '模板处理方式',
          type: 'select',
          optionArr: [
            {
              label: '新增模板',
              val: 0,
            },
            {
              label: '覆盖原有模板',
              val: 1,
            },
          ],
        },
        {
          temName: '模板名称',
          isRequired: true,
          isShow: formData => {
            return formData.temType * 1 === 0
          },
        },
        {
          bgImg: '背景图片',
          type: 'fileUpload',
          isRequired: true,
          limit: 1,
          accept: '.jpg,.png',
          isShow: formData => {
            return formData.temType * 1 === 0
          },
        },
        {
          id: '原模板名称',
          type: 'select',
          optionArr: 'temNameList',
          isShow: formData => {
            return formData.temType * 1 === 1
          },
          isRequired: true,
        },
        {
          neWTemName: '新模板名称',
          isShow: formData => {
            return formData.temType * 1 === 1
          },
          descriptionRender: h => {
            return <div>未输入则默认使用原有模板名称</div>
          },
        },
        {
          newBgImg: '背景图片',
          type: 'fileUpload',
          limit: 1,
          accept: '.jpg,.png',
          isShow: formData => {
            return formData.temType * 1 === 1
          },
          descriptionRender: h => {
            return <div>未上传则默认使用原有背景图片</div>
          },
        },
      ],
      temNameList: [],
    }
  },
  mounted() {
    this.getCommonTemList()
  },
  methods: {
    ...mapActions('drag', ['getCommonTem', 'addCommonTem', 'updateCommonTem']),
    handleClick(tab, event) {},
    handleContainerWidgetClone(origin) {
      return this.designer.copyNewContainerWidget(origin)
    },
    handleFieldWidgetClone(origin) {
      return this.designer.copyNewFieldWidget(origin)
    },
    copyTemWidget(origin) {
      return this.designer.copyTemWidget(origin)
    },
    checkContainerMove(val) {},
    onContainerDragEnd(val, val2) {},
    getCommonTemList() {
      this.getCommonTem('tem')
        .then(res => {
          if (res.code === 1) {
            this.commonTemList = res.data.map(({ temContent, temName }) => {
              let tem = { ...transStrFnToFn(temContent), temName }
              while (tem.widgetList[0].type === 'commonTem') {
                tem.widgetList = tem.widgetList[0].widgetList
              }
              return tem
            })
            this.temNameList = res.data.map(({ temContent, temName, id }) => {
              return {
                label: temName,
                val: id,
              }
            })
          }
        })
        .catch(() => {})
    },
    addTemFormConfirm() {
      const { temType, temName, bgImg, neWTemName, newBgImg, id } = this.addTemFormData
      const formData = new FormData()
      const commonTem = {
        category: 'container',
        type: 'commonTem',
        layers: this.designer.layers,
        widgetList: this.designer.widgetList,
      }
      if (temType === 0) {
        formData.append('files', bgImg[0].raw)
        formData.append('temName', temName || neWTemName)
        formData.append('commonTem', transObjToStr(commonTem))
        this.addCommonTem({
          payload: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(res => {
            if (res.code === 1) {
              this.$message.success('添加成功')
              this.$refs['addTem'].toClose()
              this.getCommonTemList()
            }
          })
          .catch(() => {
            this.$refs['addTem'].noLoading()
          })
      } else {
        formData.append('id', id)
        newBgImg[0] && formData.append('files', newBgImg[0].raw)
        neWTemName && formData.append('temName', neWTemName)
        formData.append('commonTem', transObjToStr(commonTem))
        this.updateCommonTem({
          payload: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(res => {
            if (res.code === 1) {
              this.$message.success('修改成功')
              this.$refs['addTem'].toClose()
              this.getCommonTemList()
            }
          })
          .catch(() => {
            this.$refs['addTem'].noLoading()
          })
      }
    },
    saveTem() {
      this.$refs.addTem.toShow()
    },
  },
}
</script>

<style lang="scss">
.side-scroll-bar {
  height: 100%;
  padding-bottom: 10px;
  .el-tabs__content {
    height: calc(100% - 30px);
    .el-tab-pane {
      height: 100%;
      overflow-y: auto;
      .el-collapse {
        overflow-y: auto;
        height: 100%;
      }
    }
  }
  .container-widget-item,
  .field-widget-item {
    height: 28px;
    line-height: 28px;
    width: 45%;
    float: left;
    margin: 2px 6px 6px 0;
    cursor: move;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    background: #f1f2f3;
  }

  .container-widget-item:hover,
  .field-widget-item:hover {
    background: #ebeef5;
    outline: 1px solid #409eff;
  }
  .templateName {
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    font-weight: 800;
  }
}
</style>
