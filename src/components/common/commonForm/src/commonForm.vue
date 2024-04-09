<template>
  <div class="commonForm">
    <el-form
      ref="form"
      :model="formData"
      label-position="top"
      :inline="inline"
      :label-width="labelWidth"
      @submit.native.prevent
      @keyup.enter.native="dealKeyup"
    >
      <div class="content">
        <div
          v-for="(item, index) in formItemArrDeal"
          :key="item.prop"
          :style="{ 'max-width': formItemWidthPercent, width: formItemWidthPercent }"
        >
          <div v-if="item.groupTitle" class="groupTitle">
            {{ item.groupTitle }}
          </div>
          <div v-if="item.hasSeparator" class="itemSeparato"></div>

          <!-- item 可以查看、编辑、添加 此处v-if及v-show的判断,主要是解决文件上传组件清除数据ed逻辑-->
          <el-form-item
            v-if="item.isShow ? item.isShow(formData) : true"
            :key="item.prop"
            :style="{
              'margin-bottom': !inline ? '20px' : '10px',
              'padding-right': getItemPaddingRight(index, formItemArrDeal.length),
            }"
            :label="item.label"
            :prop="item.prop"
            :rules="item.rules"
            introduction-placement="top"
            :introduction="item.introduction"
            :description-render="item.descriptionRender"
            ><el-tooltip :disabled="!item.content" :content="item.content || ''" placement="top">
              <el-select
                v-if="item.type === 'select'"
                v-model="formData[item.prop]"
                :placeholder="item.placeholder ? item.placeholder : '请选择'"
                :value-key="item.valueKey ? item.valueKey : 'id'"
                :disabled="item.disabled"
                :filterable="!!item.filterable"
              >
                <!-- 表单类型为下拉选择框 -->
                <!-- 此处option value的逻辑是这样的，如果optionValue 存在 且值为itself 绑定的值为item,
              否则是 optionValue的值，如果值不存在，默认选val 作为选取值的键-->
                <el-option
                  v-for="(option, optionIndex) in Array.isArray(item.optionArr)
                    ? item.optionArr
                    : optionArrMap[item.optionArr]"
                  :key="optionIndex"
                  :label="item.labelName ? option[item.labelName] : option['label']"
                  :value="
                    item.optionValue
                      ? item.optionValue === 'itself'
                        ? option
                        : option[item.optionValue]
                      : option['val']
                  "
                />

                <div
                  v-if="item.prefixIcon"
                  slot="prefix"
                  style="color: #4d4d4d"
                  :class="item.prefixIcon"
                ></div>
              </el-select>
              <!-- item.optionValue ? option[item.optionValue] : option['val'] -->
              <!-- 表单类型为ip输入框 -->
              <h-ip-input
                v-if="item.type === 'ip'"
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                :value="formData[item.prop]"
                tips="分为4段，每段范围为0~255的整数，参考格式：127.0.0.1。"
              ></h-ip-input>
              <!-- 表单类型为时间区间选择 此处的value-format="timestamp" 有bug，会导致选择开始日期之后  结束日期显示异常-->
              <el-date-picker
                v-if="item.type === 'timeRange'"
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                :clearable="false"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @blur="timePickerBlur(item.prop)"
              />
              <!-- 数字输入框 -->
              <el-input-number
                v-if="item.type === 'intNumber'"
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                :min="item.min || 0"
                :step="1"
              />
              <!-- 普通input输入框 -->
              <el-input
                v-if="item.type === 'input'"
                v-model.trim="formData[item.prop]"
                :prefix-icon="item.prefixIcon || ''"
                :disabled="item.disabled"
                :placeholder="item.placeholder ? item.placeholder : '请输入'"
                :type="dealType(item)"
                :maxlength="200"
              >
                <span v-if="item.suffix" slot="suffix">{{ item.suffix }}</span>
              </el-input>
              <!-- 普通input输入框 -->
              <el-input
                v-if="item.type === 'userInput'"
                v-model="formData[item.prop]"
                :prefix-icon="item.prefixIcon || ''"
                :disabled="item.disabled"
                :placeholder="item.placeholder ? item.placeholder : '请输入'"
                :maxlength="20"
              >
                <span slot="suffix" style="padding-right: 6px"
                  >{{ formData[item.prop].length }}/20</span
                ></el-input
              >
              <!-- textarea -->
              <el-input
                v-if="item.type === 'textarea'"
                v-model="formData[item.prop]"
                :autosize="{ minRows: 2, maxRows: 10 }"
                :disabled="item.disabled"
                type="textarea"
                :maxlength="200"
              />
              <el-cascader
                v-if="item.type === 'cascader'"
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                expand-trigger="hover"
                :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
                :props="item.defaultProps || defaultProps"
                :options="Array.isArray(item.optionArr) ? item.optionArr : optionArrMap[item.optionArr]"
                :show-all-levels="false"
                :change-on-select="true"
              />
              <!-- 是数字且需要转换 -->
              <el-date-picker
                v-if="item.type === 'time'"
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                :picker-options="item.pickerOptions || {}"
                type="date"
                placeholder="请选择日期"
              />
              <!-- radioGroup选择组件 -->
              <el-radio-group
                v-if="item.type === 'radioGroup'"
                v-model="formData[item.prop]"
                size="small"
                label-width="90px"
                content-width="300px"
              >
                <el-radio-button
                  v-for="(group, groupIndex) in item.groupArr"
                  :key="groupIndex"
                  :label="group.val"
                  >{{ group.label }}</el-radio-button
                >
              </el-radio-group>
              <!-- 文件上传组件 -->
              <el-upload
                v-if="item.type === 'fileUpload'"
                ref="fileUpload"
                action
                :http-request="() => {}"
                :on-remove="
                  (file, fileList) => {
                    formData[item.prop] = fileList
                  }
                "
                :file-list="formData[item.prop]"
                :on-change="
                  (file, fileList) => {
                    const newFileList = filterFileList(fileList, item)
                    formData[item.prop] = newFileList
                  }
                "
                :accept="item.accept"
                :disabled="formData[item.prop] && formData[item.prop].length >= item.limit"
              >
                <el-button
                  class="uploadBtn"
                  :disabled="formData[item.prop] && formData[item.prop].length >= item.limit"
                  icon="h-icon-upload"
                >
                  上传</el-button
                >
              </el-upload>
              <el-tree
                v-if="item.type === 'tree'"
                ref="treeItem"
                :data="Array.isArray(item.treeData) ? item.treeData : optionArrMap[item.treeData]"
                show-checkbox
                :node-key="item.nodeKey || 'id'"
                :props="item.defaultProps || treeDefaultProps"
                :default-expand-all="true"
                :default-checked-keys="formData.defaultCheckedKeys || []"
                @check-change="
                  data => {
                    selectNode(data, item)
                  }
                "
              ></el-tree>
            </el-tooltip>
            <h-pwd-input
              v-if="item.type === 'pwd'"
              v-model="formData[item.prop]"
              placeholder="请输入"
              :pwd-strength.sync="item.pwdStrength"
            ></h-pwd-input>
            <div v-if="item.type === 'selctAndTime'" class="selctAndTime">
              <el-select
                v-model="selectOptionVal"
                style="width: 40%; margin-right: 8px"
                placeholder="请选择"
                @change="
                  val => {
                    selctTimeChange(val, formData, item.prop)
                  }
                "
              >
                <el-option
                  v-for="option in options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                >
                </el-option>
              </el-select>
              <el-date-picker
                v-model="formData[item.prop]"
                :disabled="item.disabled"
                type="date"
                placeholder="请选择日期"
                @input="datePickerChange"
              />
            </div>
          </el-form-item>
        </div>
        <div
          v-if="inline"
          class="commonForm_slot"
          :style="{ 'max-width': queryWidthPercent, width: queryWidthPercent }"
        >
          <slot />
          <el-button
            v-if="formItemArr.length > closeItem"
            :icon="isClose ? 'h-icon-angles_down_sm' : 'h-icon-angles_up_sm'"
            @click="
              () => {
                isClose = !isClose
              }
            "
          />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'hui'
export default {
  name: 'CommonForm',
  props: {
    formData: { type: Object, default: () => {} },
    formItemArr: { type: Array, default: () => [] },
    labelWidth: { type: String, default: '100px' },
    itemSpan: { type: Number, default: 0 },
    slotSpan: { type: Number, default: 0 },
    isLook: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    closeItem: { type: Number, default: 4 }, //展示展开折叠按钮的formItem数,等于大于5有折叠展开按钮
    inline: { type: Boolean, default: false },
    optionArrMap: { type: Object, default: () => {} },
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
      isClose: true,
      passwordStatus: 'hide',
      defaultProps: {
        children: 'children',
        label: 'nodeName',
        value: 'id',
      },
      treeDefaultProps: {
        children: 'children',
        label: 'label',
      },
      options: [
        {
          value: 1,
          label: '1年',
        },
        {
          value: 3,
          label: '3年',
        },
        {
          value: 5,
          label: '5年',
        },
        {
          value: 10,
          label: '10年',
        },
        {
          value: 30,
          label: '30年',
        },
        {
          value: -1,
          label: '自定义',
        },
      ],
      selectOptionVal: 3,
    }
  },
  computed: {
    formItemArrDeal() {
      if (this.formItemArr.length >= this.closeItem && this.isClose && this.inline) {
        return this.formItemMap(this.formItemArr.slice(0, this.closeItem))
      } else {
        return this.formItemMap(this.formItemArr)
      }
    },
    formItemWidthPercent() {
      if (this.inline && (this.formItemArrDeal.length > this.closeItem || this.formItemArrDeal.length < 4)) {
        return '25%'
      }
      if (this.inline && this.formItemArrDeal.length === 4) {
        return '20%'
      }
      if (!this.inline) {
        return this.getPercent(this.itemSpan, 24)
      }
      return '20%'
    },
    queryWidthPercent() {
      if (this.inline && (this.formItemArrDeal.length > this.closeItem || this.formItemArrDeal.length < 4)) {
        return (4 - (this.formItemArrDeal.length % 4)) * 25 + '%'
      }
      if (this.inline && this.formItemArrDeal.length === 4) {
        return '20%'
      }
      if (!this.inline) {
        return '100%'
      }
      return '20%'
    },
  },
  methods: {
    formItemMap(formItem) {
      return formItem.map(item => {
        const itemName = this.getObjFirkeyVal(item)
        let message
        // rule不存在、切为必选项
        if (!item.rules && item.isRequired) {
          if (item.type === 'select' || item.type === 'tree') {
            message = `请选择${itemName}`
          } else if (item.type === 'fileUpload') {
            message = `请上传${itemName}`
          } else {
            message = `请输入${itemName}`
          }
          item.rules = [
            {
              required: true,
              message: item.placeholder || message,
            },
          ]
        }
        if (this.itemSpan > 0) {
          item.span = this.itemSpan
        }
        if (!item.prop) {
          item.prop = this.getObjFirkey(item)
        }
        if (!item.label) {
          item.label = this.getObjFirkeyVal(item)
        }
        if (item.optionArr && !item.type) {
          item.type = 'select'
        }
        if (!item.type) {
          item.type = 'input'
        }
        // rule不存在，为非必选项
        // if (!item.rules && !item.isRequired) {
        //   let info = item.placeholder || item.label
        //   // 电话非必选
        //   if (info.indexOf('电话') > -1) {
        //     item.content = item.content || '支持输入以1开头的十一位电话号码'
        //     item.rules = [{ validator: checkPhone, trigger: 'change' }]
        //   }
        //   // 邮箱非必选
        //   if (info.indexOf('邮箱') > -1) {
        //     item.content = item.content || '用户名@主机名(域名)，如username@xxx.com'
        //     item.rules = [{ validator: checkEmail, trigger: 'change' }]
        //   }
        // }
        // if (item.type === 'ip' && !item.notValidate) {
        //   item.rules = [
        //     {
        //       required: !!item.isRequired,
        //       validator: (rule, value, cb) => {
        //         checkIP(rule, value, cb, !!item.isRequired)
        //       },
        //       trigger: 'change',
        //     },
        //   ]
        // }
        return item
      })
    },
    getObjFirkey(data) {
      for (var key in data) {
        return key
      }
    },
    getObjFirkeyVal(data) {
      for (var key in data) {
        return data[key]
      }
    },
    getPercent(num, total = 24) {
      num = parseFloat(num)
      total = parseFloat(total)
      return total <= 0 ? '0%' : Math.round((num / total) * 10000) / 100.0 + '%'
    },
    resetFields() {
      this.$refs.form.resetFields()
      this.selectOptionVal = 3
      if (Array.isArray(this.$refs.fileUpload)) {
        this.$refs.fileUpload.map(file => {
          file.clearFiles()
        })
      }
    },
    resetValidates() {
      this.$refs.form.resetValidates()
    },
    validate(fun) {
      this.$refs.form.validate(fun)
    },
    getFormatTime(time) {
      /*
       * eg:format="YYYY-MM-dd HH:mm:ss";
       */
      if (!time || time.length === 0) {
        return '--'
      }
      let type = 'yyyy-mm-dd hh:ii:ss'
      var date = new Date(time)
      var o = {
        'm+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'i+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
      }
      if (/(y+)/.test(type)) {
        type = type.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(type)) {
          type = type.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
          )
        }
      }
      return type
    },
    timePickerBlur(prop) {
      this.$nextTick(() => {
        let [startTime, endTime] = this.formData[prop]
        if (startTime && typeof startTime === 'object') {
          let endTimeStr = endTime.getTime() + ''
          this.formData[prop] = [
            startTime.getTime(),
            (endTimeStr.substring(0, endTimeStr.length - 3) + 999) * 1,
          ]
        }
      })
    },
    getItemPaddingRight(curIndex, itemLength) {
      if ((itemLength > 4 && (curIndex + 1) % 4 === 0) || this.itemSpan * 1 === 24) {
        return '0'
      }
      return '20px'
    },
    // 此函数处理input输入框的类型
    dealType(item) {
      let info = item.label || item.placeholder
      if (info.indexOf('PIN') > -1 || item.showType === 'password') {
        return 'password'
      }
      return 'text'
    },
    // 处理树组件选中
    selectNode(data, item) {
      this.formData[item.prop] = this.$refs.treeItem[0]
        .getCheckedKeys()
        .concat(this.$refs.treeItem[0].getHalfCheckedKeys())
    },
    setCheckedKeys(arr = []) {
      this.$refs.treeItem[0].setCheckedKeys(arr)
    },
    // 处理回车
    dealKeyup() {
      this.$emit('keyupEnter', this.formData)
    },
    filterFileList(fileList, item) {
      let fileArr = []
      let accept = item.accept
      // 监听上传文件的变化，在下一次更新前再次校验
      this.$nextTick(() => {
        this.$refs['form'].validateField(item.prop)
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
    //
    selctTimeChange(val, formData, props) {
      if (val > 0) {
        formData[props] = new Date().getTime() + 3600 * 1000 * 24 * val * 365
      } else {
        // formData[props] = new Date().getTime()
      }
    },
    datePickerChange() {
      this.selectOptionVal = -1
    },
  },
}
</script>

<style lang="scss">
.commonForm {
  .el-upload {
    width: 100%;
    .uploadBtn {
      border: 1px dashed rgba(0, 0, 0, 0.7) !important;
      background-color: rgba(0, 0, 0, 0.04) !important;
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.7);
      width: 100%;
      &:hover {
        background-color: rgba(0, 0, 0, 0.08) !important;
      }
      &:focus {
        background-color: #b4b4b4 !important;
      }
    }
  }
  .selctAndTime {
    display: flex;
  }
  .groupTitle {
    font-family: MicrosoftYaHeiUI;
    font-size: 16px;
    color: #141414;
    letter-spacing: 0.4px;
    line-height: 24px;
    font-weight: 800;
    margin-bottom: 16px;
  }
  .itemSeparato {
    width: 100%;
    background: rgba(0, 0, 0, 0.12);
    height: 1px;
    margin-bottom: 12px;
  }
  .content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-grow: 0;
  }
  .el-form-item {
    width: 100%;
  }
  .commonForm_slot {
    display: flex;
    align-items: flex-end;
    height: 60px;
    justify-content: flex-end;
    .el-button {
      min-width: auto;
    }
  }
  .el-form--inline .el-form-item__content {
    width: 100%;
  }
  .selectAndTiem {
    display: flex;
  }
}
</style>
