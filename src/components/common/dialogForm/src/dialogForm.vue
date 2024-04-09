<template>
  <el-dialog
    v-if="dialogVisible"
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :size="size"
    @closed="resetForm('form')"
    @close="
      () => {
        resetForm('form')
        this.$emit('close')
      }
    "
    @keyup.enter.native="submit('form')"
  >
    <slot name="header" />
    <div v-if="header && header.text" class="header-tips" :class="header.color || ''">
      <i class="h-icon-tip_info"></i>
      <div class="text">{{ header.text }}</div>
    </div>
    <common-form
      ref="form"
      v-loading="loading"
      :form-data="formData"
      :form-item-arr="formItemArr"
      :option-arr-map="optionArrMap"
      :item-span="24"
      :label-width="'140px'"
    >
      <template v-for="name in Object.keys(formData)" v-slot:[name]>
        <slot :name="name" />
      </template>
    </common-form>
    <span slot="footer">
      <el-button type="primary" @click="submit('form')">确 定</el-button>
      <el-button @click="toClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { throttle } from '@/utils/util.js'
export default {
  name: 'DialogForm',
  props: {
    dialogTitle: { type: String, default: '' },
    formConfirm: { type: Function, default: () => {} },
    formData: { type: Object, default: () => {} },
    formItemArr: { type: Array, default: () => [] },
    size: { type: String, default: 'tiny' },
    optionArrMap: { type: Object, default: () => {} },
    header: { type: Object, default: () => {} },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
    }
  },
  methods: {
    submit: throttle(function (form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          if (this.loading) return
          this.loading = true
          this.$emit('formConfirm', this.formData)
        }
      })
    }),
    resetForm(form) {
      this.loading = false
      form = form || 'form'
      // 此处对象变了，所以这个方法有问题
      this.$refs[form].resetFields()
    },
    toShow() {
      this.dialogVisible = true
    },
    toClose() {
      this.dialogVisible = false
      this.resetForm('form')
      this.$emit('close')
    },
    noLoading() {
      this.loading = false
    },
  },
}
</script>
<style lang="scss" scoped>
.header-tips {
  width: calc(100% + 160px);
  transform: translate(-80px, -32px);
  padding: 6px 12px;
  display: flex;
  align-items: center;
  &.yellow {
    background-color: #fff7ef;
    .h-icon-tip_info {
      color: #ff952c;
    }
  }
  &.blue {
    background-color: #eef7ff;
    .h-icon-tip_info {
      color: #2196f3;
    }
  }
  .h-icon-tip_info {
    margin-right: 6px;
    font-size: 24px;
  }
  .text {
    flex: 1;
  }
  .h-icon-close {
    font-size: 24px;
  }
}
</style>
