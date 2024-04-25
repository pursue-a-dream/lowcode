<template>
  <div class="loginContent">
    <div class="logo">
      <img :src="LOGO_URL" class="logoImg" alt="" />
      <span style="padding-left: 20px; font-size: 20px">{{ widget.options.title }}</span>
    </div>
    <div class="imgContent">
      <img :src="loginImg" class="loginImg" alt="" />
      <div class="content"></div>
    </div>
    <container-wrapper
      class="loginForm"
      :designer="designer"
      :widget="widget"
      :parent-widget="parentWidget"
      :parent-list="parentList"
      :index-of-parent-list="indexOfParentList"
      :class="[selected ? 'selected' : '', customClass]"
    >
      <draggable
        class="login-drag-content"
        v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
        handle=".drag-handler"
        @add="ev => designer.dealWidgetAdd(ev, widget.widgetList)"
        @click.native.stop="selectWidget(widget)"
      >
        <template v-for="(subWidget, swIdx) in widget.widgetList" class="formItem">
          <component
            :is="subWidget.type + '-widget'"
            :key="subWidget.id"
            :style="widget.options.inline ? `width: ${widget.options.childWidthPercent}` : ''"
            :widget="subWidget"
            :designer="designer"
            :parent-list="widget.widgetList"
            :index-of-parent-list="swIdx"
            :parent-widget="widget"
          ></component>
        </template>
      </draggable>
    </container-wrapper>
  </div>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'LoginWidget',
  mixins: [containerMixin],
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
  data() {
    return {
      LOGO_URL: require('@/assets/logo-default.svg'),
      loginImg: require('@/assets/login.svg'),
    }
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    },
  },
  watch: {
    // 此处监听，处理form的被触发事件
    'designer.triggerEventStatus': {
      handler(newV, oldV) {
        let formSubmit = this.widget.id + 'formSubmit'
        let formReset = this.widget.id + 'formReset'
        if (newV[formSubmit] != oldV[formSubmit]) {
          this.$message({
            message: '表单提交',
            type: 'success',
          })
        }
        if (newV[formReset] != oldV[formReset]) {
          this.$message({
            message: '表单重置',
            type: 'success',
          })
          this.$refs[this.widget.options.name].resetFields()
        }
      },
      deep: true,
    },
    'widget.widgetList': {
      handler(newV) {
        // console.log('adasdas', JSON.stringify(this.widget))
      },
      deep: true,
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.loginContent {
  width: 100%;
  height: 100%;
  padding: 5px;
  outline: 1px dashed #336699;
  background-image: linear-gradient(46deg, #151515 0%, #555555 100%);
  .imgContent {
    position: absolute;
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 852px;
    .content {
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: 22;
    }
  }
  .logo {
    position: absolute;
    top: 50px;
    left: 50px;
    justify-content: center;
    display: flex;
    align-items: center;
    z-index: 20;
    color: #ffffff;
  }
  .logoImg {
    width: 32px;
  }
  .loginImg {
    width: 60%;
    z-index: 20;
  }
  // .selected {
  //   outline: 2px solid #409eff !important;
  // }
  .loginForm {
    width: 450px;
    height: auto;
    min-height: 350px;
    position: absolute;
    background: #ffffff;
    right: 150px;
    top: 50%;
    margin-top: -175px;
    box-shadow: 0px 4px 36px 0px rgb(0 0 0 / 12%);
    border-radius: 7px;
    z-index: 22;
    .login-drag-content {
      width: 100%;
      min-height: 350px;
      padding: 40px;
    }
  }
}
</style>
