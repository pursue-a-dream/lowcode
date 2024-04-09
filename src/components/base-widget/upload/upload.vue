<template>
  <FormItemWrapper
    class="uploadContent"
    :designer="designer"
    :widget="widget"
    :design-state="designState"
    :display-style="widget.options.displayStyle"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
    :form-data="formData"
    :rules="[]"
  >
    <el-upload
      action
      v-bind="widget.options"
      :on-remove="
        (file, fileList) => {
          formData && (formData[widget.options.fieldName] = fileList)
        }
      "
      :on-change="
        (file, fileList) => {
          const newFileList = filterFileList(fileList, widget.options)
          formData && (formData[widget.options.fieldName] = newFileList)
        }
      "
      :disabled="fileList.length >= widget.options.limit"
      :http-request="() => {}"
      :file-list="fileList"
    >
      <div v-show="widget.options.drag" class="dragContent">
        <i class="h-icon-upload" />
        <div class="upload-drag-title">{{ widget.options.dragTitleDesc }}</div>
        <div class="upload-drag-text">
          {{ widget.options.dragContentDesc }}
        </div>
      </div>
      <div v-show="!widget.options.drag">
        <el-button type="default" class="uploadBtn" icon="h-icon-upload"> 上传</el-button>
        <div slot="tip" class="tip">
          {{ widget.options.slotContent }}
        </div>
      </div>
    </el-upload>
  </FormItemWrapper>
</template>

<script>
import FormItemWrapper from '../form-item-wrapper'
import { Message } from 'hui'
export default {
  name: 'UploadWidget',
  components: { FormItemWrapper },
  props: {
    widget: { type: Object, default: () => {} },
    parentWidget: { type: Object, default: () => {} },
    parentList: { type: Array, default: () => [] },
    indexOfParentList: { type: Number, default: 0 },
    designer: { type: Object, default: () => {} },

    designState: {
      type: Boolean,
      default: false,
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */ type: Number,
      default: -1,
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */ type: Number,
      default: -1,
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */ type: String,
      default: '',
    },
    formData: { type: Object, default: () => {} },
  },
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
    filterFileList(fileList, options) {
      let fileArr = []
      let accept = options.accept
      // 监听上传文件的变化，在下一次更新前再次校验
      this.$nextTick(() => {
        // this.$refs['form'].validateField(options.prop)
      })
      for (let index = 0; index < fileList.length; index++) {
        const file = fileList[index]
        if (file.size > 20 * 1024 * 1024) {
          Message.error('文件过大')
          return fileArr
        }
        let type = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (accept.indexOf(type) > -1) {
          fileArr.push(file)
        } else {
          Message.error('文件格式错误')
        }
      }
      return fileArr
    },
  },
}
</script>
<style lang="scss">
.uploadContent {
  .el-upload,
  .el-upload-dragger {
    width: 100%;
  }
  .dragContent {
    .h-icon-upload {
      margin-top: 10px;
    }
    .upload-drag-title {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.9);
      letter-spacing: 0;
      line-height: 24px;
      font-weight: 400;
    }
    .upload-drag-text {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.4);
      text-align: center;
      line-height: 20px;
      font-weight: 400;
    }
  }
  .uploadBtn {
    border: 1px dashed rgba(0, 0, 0, 0.7) !important;
    background-color: rgba(0, 0, 0, 0.04) !important;
    border-radius: 2px;
    color: rgba(0, 0, 0, 0.7);
    width: 100%;
    max-width: 1000px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08) !important;
    }
    &:focus {
      background-color: #b4b4b4 !important;
    }
  }
  .tip {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
    letter-spacing: 0;
    line-height: 20px;
    font-weight: 400;
    text-align: left;
  }
}
</style>
