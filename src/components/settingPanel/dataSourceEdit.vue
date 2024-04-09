<template>
  <el-dialog title="数据源" :visible.sync="dialogVisible" size="large">
    <div style="width: 100%; height: 400px">
      <ace
        ref="editor"
        :value="content"
        :lang="lang"
        :height="height === 0 ? '100%' : height"
        :theme="theme"
        :options="options"
        width="100%"
        v-bind="config"
        @init="initEditor"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveDataSource">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ace from 'vue2-ace-editor'
export default {
  name: 'JSONEditor',
  components: {
    ace,
  },
  props: {
    content: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 0,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: 'chrome',
    },
    lang: {
      type: String,
      default: 'javascript',
    },
    config: {
      type: Object,
      default: () => {
        return {
          font_size: 20,
          sql_atom: true,
        }
      },
    },
    dataSource: {},
  },
  computed: {
    options() {
      return {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: this.config.sql_atom,
        showPrintMargin: false,
        fontSize: this.config.font_size,
        readOnly: this.readOnly,
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
      // ace,
      editor: null,
      dataEdit: {},
    }
  },
  methods: {
    initEditor(editor) {
      require('brace/ext/language_tools')
      // 设置语言
      require('brace/mode/html')
      require('brace/mode/javascript') //language
      require('brace/mode/sql')
      require('brace/snippets/javascript')
      // 设置主题 按需加载
      require('brace/theme/monokai')
      require('brace/theme/chrome')
      require('brace/theme/twilight')
      // 监听值的变化
      this.editor = editor
      editor.getSession().on('change', val => {
        let value = editor.getSession().getValue() + ''
        const dealVal = this.dealEditorVal(value)
        if (dealVal) {
          this.dataEdit = dealVal
        }
      })
      editor.getSession().setTabSize(2)
    },
    dealEditorVal(editStr) {
      let dataSource = ''
      try {
        eval(editStr)
        this.isRightStatus = true
      } catch (error) {
        this.isRightStatus = false
      }
      return dataSource
    },
    formatVal(value) {
      // 如果是函数则直接设置
      if (typeof value === 'function') {
        this.$refs['editor'].editor.setValue('dataSource = ' + value)
        return
      }
      const formatObj = (obj, len) => {
        let isArray = Array.isArray(obj)
        let str = isArray ? '[' : '{'
        Object.keys(obj).map(item => {
          str += `
${isArray ? this.getSpace(len) : this.getSpace(len) + item + ':'}${
            typeof obj[item] === 'object'
              ? formatObj(obj[item], len + 1) + ','
              : this.dealObjVal(obj[item]) + ','
          }`
        })
        return `${str}
${this.getSpace(len - 1)}${isArray ? ']' : '}'}`
      }
      this.$refs['editor'].editor.setValue('dataSource = ' + formatObj(value, 1))
    },
    dealObjVal(val) {
      // 判断val是不是字符串，是的话加引号
      return typeof val === 'string' ? `'${val}'` : val
    },
    getSpace(len) {
      let str = ''
      while (len > 0) {
        str += '  '
        len--
      }
      return str
    },
    toShow() {
      this.dialogVisible = !this.dialogVisible
      if (this.dialogVisible) {
        this.$nextTick(() => {
          this.dataEdit =
            typeof this.dataSource != 'string'
              ? this.dataSource
              : this.dealEditorVal('dataSource = ' + this.dataSource)
          this.formatVal(this.dataEdit)
        })
      }
    },
    saveDataSource() {
      this.dialogVisible = false
      this.$emit('editConfim', this.dataEdit)
    },
  },
}
</script>

<style></style>
