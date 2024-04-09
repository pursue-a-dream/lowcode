<template>
  <div class="loginMainContent">
    <div class="logo">
      <img :src="logoImg" class="logoImg" alt="" />
      <span style="padding-left: 20px; font-size: 20px">SEC低代码平台</span>
    </div>
    <div class="imgContent">
      <img :src="loginImg" class="loginImg" alt="" />
    </div>
    <div class="loginContent">
      <h2 class="loginTitle">欢迎登录</h2>
      <common-form
        ref="loginForm"
        v-loading="loginLoading"
        :form-data="loginFormData"
        :form-item-arr="loginFormItemArr"
        :item-span="24"
        :slot-span="24"
        :label-width="'140px'"
        @keyupEnter="toLogin"
      />
      <el-button
        style="margin-top: 30px; max-width: 336px; width: 100%; height: 44px"
        type="primary"
        @click="toLogin"
        >登录</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      loginLoading: false,
      loginFormData: {
        user_name: '',
        user_pwd: '',
      },
      loginFormItemArr: [
        {
          user_name: '',
          isRequired: true,
          placeholder: '请输入用户名',
          prefixIcon: 'h-icon-user',
        },
        {
          user_pwd: '',
          isRequired: true,
          placeholder: '请输入口令',
          showType: 'password',
          prefixIcon: 'h-icon-lock',
        },
      ],
    }
  },
  computed: {
    // ...mapState(['sysInfo', 'socketIsOpen']),
    loginImg() {
      return require('@/assets/login.svg')
    },
    logoImg() {
      return require('@/assets/vform-logo.png')
    },
  },
  mounted() {},
  methods: {
    ...mapActions('login', ['login']),
    toLogin() {
      this.$refs['loginForm'].validate(async valid => {
        if (valid) {
          this.loginLoading = true
          this.login(this.loginFormData)
            .then(res => {
              sessionStorage.setItem('token', res.data.access_token)
              this.loginLoading = false
              this.$router.push('/')
            })
            .catch(() => {
              this.loginLoading = false
            })
        }
      })
    },
  },
}
</script>

<style lang="scss">
.loginMainContent {
  background-color: rgb(243, 247, 255);
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  .el-input__inner {
    height: 44px;
  }
  .el-input__prefix,
  .el-input__suffix {
    top: 10px;
  }
  .el-select .el-input__suffix {
    top: 50%;
  }
  .imgContent {
    position: absolute;
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 852px;
    z-index: 1;
  }
  .logo {
    position: fixed;
    top: 50px;
    left: 50px;
    justify-content: center;
    display: flex;
    align-items: center;
    z-index: 20;
  }
  .logoImg {
    width: 32px;
  }
  .loginImg {
    width: 60%;
    z-index: 20;
  }
  .loginTitle {
    padding-bottom: 40px;
  }
  .loginContent {
    z-index: 2;
    position: absolute;
    right: 16%;
    width: 400px;
    top: 50%;
    border-radius: 3px;
    margin-top: -200px;
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 34px;
    background: #fff;
    -webkit-box-shadow: 0 0 4px 0 rgb(0 0 0 / 8%), 0 8px 12px 0 rgb(0 0 0 / 12%);
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 8%), 0 8px 12px 0 rgb(0 0 0 / 12%);
    padding: 40px;
    border-radius: 3px;
    box-sizing: border-box;
  }
}
</style>
