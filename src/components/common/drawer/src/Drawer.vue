<template>
  <transition name="el-drawer-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div v-show="visible" class="el-drawer__wrapper" tabindex="-1">
      <div
        class="el-drawer__container"
        :class="visible && 'el-drawer__open'"
        role="document"
        tabindex="-1"
        @click.self="handleWrapperClick"
      >
        <div
          ref="drawer"
          aria-modal="true"
          aria-labelledby="el-drawer__title"
          :aria-label="title"
          class="el-drawer"
          :class="[direction, customClass]"
          :style="isHorizontal ? `width: ${size};width: 500px;` : `height: ${size};`"
          role="dialog"
          tabindex="-1"
        >
          <header v-if="withHeader" id="el-drawer__title" class="el-drawer__header">
            <slot name="title">
              <span role="heading" tabindex="0" :title="title">
                {{ title }}
              </span>
            </slot>
            <button
              v-if="showClose"
              :aria-label="`close ${title || 'drawer'}`"
              class="el-drawer__close-btn"
              type="button"
              @click="closeDrawer"
            >
              <i class="el-dialog__close el-icon h-icon-close"></i>
            </button>
          </header>
          <section v-if="rendered" v-loading="loading" class="el-drawer__body">
            <slot></slot>
          </section>
          <slot v-if="hasFooter" name="footer">
            <footer class="drawerFooter">
              <el-button type="primary" @click="confirmDrawer">确定</el-button>
              <el-button @click="closeDrawer">取消</el-button>
            </footer>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'hui/src/utils/popup'
import emitter from 'hui/src/mixins/emitter'
import Utils from './aria-utils'

export default {
  name: 'HDrawer',
  mixins: [Popup, emitter],
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    beforeClose: {
      type: Function,
      default: null,
    },
    customClass: {
      type: String,
      default: '',
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    direction: {
      type: String,
      default: 'rtl',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1
      },
    },
    modalAppendToBody: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: '30%',
    },
    title: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
    },
    wrapperClosable: {
      type: Boolean,
      default: false,
    },
    withHeader: {
      type: Boolean,
      default: true,
    },
    hasFooter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      closed: false,
      prevActiveElement: null,
      loading: false,
    }
  },
  computed: {
    isHorizontal() {
      return this.direction === 'rtl' || this.direction === 'ltr'
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
        this.prevActiveElement = document.activeElement
        this.$nextTick(() => {
          Utils.focusFirstDescendant(this.$refs.drawer)
        })
      } else {
        if (!this.closed) this.$emit('close')
        this.$nextTick(() => {
          if (this.prevActiveElement) {
            this.prevActiveElement.focus()
          }
        })
      }
    },
  },
  mounted() {
    if (this.visible) {
      this.rendered = true
      this.open()
    }
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        if (this.destroyOnClose === true) {
          this.rendered = false
        }
        this.closed = true
      }
    },
    handleWrapperClick() {
      if (this.wrapperClosable) {
        this.closeDrawer()
      }
    },
    closeDrawer() {
      this.loading = false
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    handleClose() {
      // This method here will be called by PopupManger, when the `closeOnPressEscape` was set to true
      // pressing `ESC` will call this method, and also close the drawer.
      // This method also calls `beforeClose` if there was one.
      this.closeDrawer()
    },
    confirmDrawer() {
      this.$emit('confirmDrawer')
    },
    toLoading() {
      this.loading = true
    },
    noLoading() {
      this.loading = false
    },
  },
}
</script>
