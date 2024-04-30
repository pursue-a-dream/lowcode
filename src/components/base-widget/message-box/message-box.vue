<template>
  <transition name="msgbox-fade">
    <div
      v-show="widget.options.visible"
      class="el-message-box__wrapper"
      tabindex="-1"
      @click.self="handleWrapperClick"
    >
      <div :class="[customClass, sizeClass]" class="el-message-box">
        <container-wrapper
          :designer="designer"
          :class="[selected ? 'messageSelected' : '', customClass]"
          :widget="widget"
          :parent-widget="parentWidget"
          :parent-list="parentList"
          :index-of-parent-list="indexOfParentList"
          class="dialog-content"
          @click="selectWidget(widget)"
        >
          <div class="el-message-box__content" @click="selectWidget(widget)">
            <div class="el-message-box__container">
              <h-feedback-icon :icon-name="typeClass" class="el-message-box__status" />
              <div
                v-if="title"
                :style="{
                  'margin-top': !typeClass || message !== '' ? '0' : '8px',
                }"
                class="el-message-box__titleWrapper"
              >
                <div
                  :style="{
                    'margin-left': typeClass ? '56px' : '0',
                    'min-height': message ? '' : '48px',
                  }"
                  class="el-message-box__title"
                >
                  <span v-if="!dangerouslyUseHTMLString">{{ title }}</span>
                  <span v-else v-html="title"></span>
                </div>
              </div>
              <div
                v-if="message !== ''"
                :style="{
                  'margin-left': typeClass ? '56px' : '0',
                  'margin-top': title ? '4px' : '0',
                }"
                class="el-message-box__message"
              >
                <slot>
                  <el-scrollbar>
                    <p v-if="!dangerouslyUseHTMLString">
                      {{ message }}
                    </p>
                    <p v-else v-html="message" />
                  </el-scrollbar>
                </slot>
              </div>
              <div v-show="showInput" class="el-message-box__input">
                <el-input
                  ref="input"
                  v-model="inputValue"
                  :type="inputType"
                  :placeholder="inputPlaceholder"
                  @keyup.enter.native="handleAction('confirm')"
                />
                <div
                  :style="{
                    visibility: !!editorErrorMessage ? 'visible' : 'hidden',
                  }"
                  class="el-message-box__errormsg"
                >
                  {{ editorErrorMessage }}
                </div>
              </div>
            </div>
          </div>
        </container-wrapper>
        <div class="el-message-box__btns">
          <!-- 传入按钮 -->
          <div v-if="buttons">
            <el-button
              v-for="(item, index) in buttons"
              :key="index"
              :type="item.type"
              @click.native="handleAction(item.action)"
            >
              {{ item.name }}
            </el-button>
          </div>
          <div v-else>
            <el-button
              v-show="widget.options.showConfirmButton"
              ref="confirm"
              :loading="confirmButtonLoading"
              :class="[confirmButtonClasses]"
              @click.native="handleConfirm"
            >
              {{ widget.options.confirmButtonText }}
            </el-button>
            <el-button
              v-show="widget.options.showCancelButton"
              :loading="cancelButtonLoading"
              :class="[cancelButtonClasses]"
              @click.native="
                () => {
                  widget.options.visible = false
                }
              "
            >
              {{ widget.options.cancelButtonText }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
import Popup from 'hui/src/utils/popup'
import Locale from 'hui/src/mixins/locale'
import ElInput from 'hui/packages/input'
import ElButton from 'hui/packages/button'
import { addClass, removeClass } from 'hui/src/utils/dom'
import { t } from 'hui/src/locale'

const typeMap = {
  success: 'feedback_success_lg',
  info: 'feedback_info_lg',
  warning: 'feedback_warning_lg',
  question: 'feedback_question_lg',
  error: 'feedback_error_lg',
}

const sizeMap = {
  small: 'small',
  middle: 'middle',
  large: 'large',
}

export default {
  name: 'MessageBoxWidget',
  components: {
    ElInput,
    ElButton,
  },
  mixins: [Popup, Locale, containerMixin],

  props: {
    modal: {
      type: Boolean,
      default: true,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    closeOnHashChange: {
      type: Boolean,
      default: true,
    },
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
  data() {
    return {
      uid: 1,
      customClass: '',
      showInput: false,
      inputValue: null,
      inputPlaceholder: '',
      inputType: 'text',
      inputPattern: null,
      inputValidator: null,
      inputErrorMessage: '',
      showConfirmButton: true,
      showCancelButton: false,
      action: '',
      confirmButtonText: '',
      cancelButtonText: '',
      confirmButtonLoading: false,
      cancelButtonLoading: false,
      confirmButtonClass: '',
      confirmButtonDisabled: false,
      cancelButtonClass: '',
      editorErrorMessage: null,
      callback: null,
      dangerouslyUseHTMLString: false,
      buttons: null,
    }
  },

  computed: {
    typeClass() {
      return this.type && typeMap[this.type] ? `h-icon-${typeMap[this.type]}` : ''
    },

    sizeClass() {
      return this.size && sizeMap[this.size]
        ? `el-message-box--${sizeMap[this.size]}`
        : 'el-message-box--small'
    },
    selected() {
      return this.widget.id === this.designer.selectedId
    },
    confirmButtonClasses() {
      return `el-button--primary ${this.confirmButtonClass}`
    },
    cancelButtonClasses() {
      return `${this.cancelButtonClass}`
    },
    title() {
      return this.widget.options.title
    },
    message() {
      return this.widget.options.message
    },
    type() {
      return this.widget.options.type
    },
    size() {
      return this.widget.options.size
    },
  },

  watch: {
    inputValue: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (this.$type === 'prompt' && val !== null) {
            this.validate()
          }
        })
      },
    },

    visible(val) {
      if (val) this.uid++
      if (this.$type === 'alert' || this.$type === 'confirm') {
        this.$nextTick(() => {
          if (this.$refs.confirm) {
            this.$refs.confirm.$el.focus()
          }
        })
      }
      if (this.$type !== 'prompt') return
      if (val) {
        setTimeout(() => {
          if (this.$refs.input && this.$refs.input.$el) {
            this.$refs.input.$el.querySelector('input').focus()
          }
        }, 500)
      } else {
        this.editorErrorMessage = ''
        removeClass(this.$refs.input.$el.querySelector('input'), 'invalid')
      }
    },
    // 此处监听，处理form的被触发事件
    'designer.triggerEventStatus': {
      handler(newV, oldV) {
        let messageClose = this.widget.id + 'messageClose'
        if (newV[messageClose] != oldV[messageClose]) {
          this.widget.options.visible = false
          this.$message({
            message: 'messageClose',
            type: 'success',
          })
        }
      },
      deep: true,
    },
  },

  mounted() {
    if (this.closeOnHashChange) {
      window.addEventListener('hashchange', this.close)
    }
  },

  beforeDestroy() {
    if (this.closeOnHashChange) {
      window.removeEventListener('hashchange', this.close)
    }
  },

  methods: {
    getSafeClose() {
      const currentId = this.uid
      return () => {
        this.$nextTick(() => {
          if (currentId === this.uid) this.doClose()
        })
      }
    },
    doClose() {
      if (!this.visible) return
      this.visible = false
      this._closing = true

      this.onClose && this.onClose()

      if (this.lockScroll) {
        setTimeout(() => {
          if (this.modal && this.bodyOverflow !== 'hidden') {
            document.body.style.overflow = this.bodyOverflow
            document.body.style.width = this.bodyPaddingRight
          }
          this.bodyOverflow = null
          this.bodyPaddingRight = null
        }, 200)
      }
      this.opened = false

      if (!this.transition) {
        this.doAfterClose()
      }
      if (this.action) this.callback(this.action, this)
    },

    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleAction('cancel')
      }
    },

    handleAction(action) {
      if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
        return
      }
      this.action = action
      if (typeof this.beforeClose === 'function') {
        this.close = this.getSafeClose()
        this.beforeClose(action, this, this.close)
      } else {
        this.doClose()
      }
    },

    validate() {
      if (this.$type === 'prompt') {
        var inputPattern = this.inputPattern
        if (inputPattern && !inputPattern.test(this.inputValue || '')) {
          this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error')
          addClass(this.$refs.input.$el.querySelector('input'), 'invalid')
          return false
        }
        var inputValidator = this.inputValidator
        if (typeof inputValidator === 'function') {
          var validateResult = inputValidator(this.inputValue)
          if (validateResult === false) {
            this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error')
            addClass(this.$refs.input.$el.querySelector('input'), 'invalid')
            return false
          }
          if (typeof validateResult === 'string') {
            this.editorErrorMessage = validateResult
            return false
          }
        }
      }
      this.editorErrorMessage = ''
      removeClass(this.$refs.input.$el.querySelector('input'), 'invalid')
      return true
    },
    handleConfirm() {
      this.designer.dealWidgetAction(this.widget, 'click', this.designer)
    },
  },
}
</script>
<style lang="scss" scoped>
.messageSelected {
  border: 2px solid #409eff !important;
}
</style>
