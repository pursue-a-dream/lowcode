<template>
  <FormItemWrapper
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
    <el-date-picker
      :key="widget.options.datetype"
      v-model="selectVal"
      :style="widget.activeStyle"
      v-bind="widget.options"
      :type="widget.options.datetype"
    />
  </FormItemWrapper>
</template>

<script>
import FormItemWrapper from '../form-item-wrapper'
export default {
  components: { FormItemWrapper },
  name: 'date-widget',
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

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
    formData: Object,
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end], true)
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end], true)
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end], true)
            },
          },
        ],
      },
    }
  },
  computed: {
    selectVal: {
      get() {
        return this.formData ? this.formData[this.widget.options.fieldName] : this.widget.value
      },
      set(val) {
        this.widget.value = val
        this.formData && (this.formData[this.widget.options.fieldName] = val)
      },
    },
  },
  watch: {
    'widget.options.datetype': {
      handler(newV, oldV) {
        if (newV !== oldV) {
          // /dates//datetime/datetimerange/daterange
          const arr = ['year', 'month', 'week', 'date']
          if (arr.includes(newV)) {
            this.selectVal = new Date()
          } else {
            this.selectVal = []
          }
        }
        // console.log('newV', newV, this.selectVal)
        // this.selectVal = new Date().getTime()
      },
      deep: true,
    },
  },

  methods: {
    timePickerBlur(prop) {
      // this.$nextTick(() => {
      //   let [startTime, endTime] = this.formData[prop]
      //   if (startTime && typeof startTime === 'object') {
      //     let endTimeStr = endTime.getTime() + ''
      //     this.formData[prop] = [
      //       startTime.getTime(),
      //       (endTimeStr.substring(0, endTimeStr.length - 3) + 999) * 1,
      //     ]
      //   }
      // })
    },
  },
  mounted() {},
}
</script>

<style></style>
