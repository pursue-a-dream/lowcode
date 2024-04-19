<template>
  <div id="app" class="app">
    <h-layout class="main-container full-height">
      <h-layout-header class="main-header">
        <div class="float-left main-title">
          <img src="./../../assets/vform-logo.png" />
          <span class="bold">SEC</span>
          lowcode
          <span class="version-span">Ver 1.0.0</span>

          <el-menu
            theme="dark"
            :default-active="defaultActiveMenu"
            class="main-header-menu"
            mode="horizontal"
            @select="handleSelect"
          >
            <template v-for="item in menu">
              <el-menu-item :key="item.router" :index="item.router">{{ item.title }}</el-menu-item>
            </template>
          </el-menu>
        </div>
        <div class="float-right" style="margin-right: 20px">{{ userInfo.userNameCn }}</div>
      </h-layout-header>
      <router-view />
    </h-layout>
  </div>
</template>

<script>
import { createDesigner } from '@/designer.js'
import { mapState } from 'vuex'
import navList from '@/nav.config.js'
export default {
  name: 'App',
  computed: {
    ...mapState(['userInfo']),
    menu() {
      return navList
    },
    defaultActiveMenu() {
      let activeRouter = ''
      navList.forEach(item => {
        if (this.$route.path.indexOf(item.router) > -1) {
          activeRouter = item.router
        }
      })
      if (!!activeRouter) {
        navList.forEach(item => {
          if (window.location.href.indexOf(item.router) > -1) {
            activeRouter = item.router
          }
        })
      }
      return activeRouter
    },
  },
  // data() {
  //   return {
  //     designer: createDesigner(this),
  //   }
  // },
  // created() {
  //   this.designer.initDesigner()
  // },
  methods: {
    handleSelect(key, keyPath) {
      if (this.$route.path.indexOf(key) > -1) {
        return
      }
      this.$router.push(key)
    },
  },
}
</script>

<style lang="scss" scoped>
.app {
  height: 100%;
}
.h-layout.main-container {
  background: #fff;

  ::v-deep aside {
    /* 防止aside样式被外部样式覆盖！！ */
    margin: 0;
    padding: 0;
    background: inherit;
  }
}

.h-layout.full-height {
  height: 100%;
  overflow-y: hidden;
}

.h-layout-header.main-header {
  border-bottom: 2px dotted #ebeef5;
  height: 48px !important;
  line-height: 48px !important;
  min-width: 800px;
}

div.main-title {
  font-size: 18px;
  color: #242424;
  display: flex;
  align-items: center;
  justify-items: center;

  img {
    cursor: pointer;
    width: 36px;
    height: 36px;
  }

  span.bold {
    font-size: 20px;
    font-weight: bold;
    margin: 0 6px 0 6px;
  }

  span.version-span {
    font-size: 14px;
    color: #101f1c;
    margin-left: 6px;
  }
  .main-header-menu {
    background-color: #fff;
    margin-left: 250px;
    .el-menu-item {
      height: 48px;
      line-height: 48px;
      color: #101f1c;
    }
  }
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}

// .el-dropdown-link {
//   margin-right: 12px;
//   cursor: pointer;
// }

// div.external-link a {
//   font-size: 13px;
//   text-decoration: none;
//   margin-right: 10px;
//   color: #606266;
// }

.container-scroll-bar {
  ::v-deep .el-scrollbar__wrap,
  ::v-deep .el-scrollbar__view {
    overflow-x: hidden;
  }
}
</style>
