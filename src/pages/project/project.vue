<template>
  <div class="projectContent">
    <div class="searchContent">
      <el-input v-model="searchVal" style="margin-right: 20px; width: 250px" placeholder="请输入"
        suffix-icon="h-icon-search" clearable :on-icon-click="handleIconClick" :clear-icon-click="clearIconClick">
      </el-input>
      <el-button style="margin-right: 40px" type="primary" :radius="true" @click="() => {
          $refs['addProject'].toShow()
        }
        ">添加项目</el-button>
    </div>
    <div class="mainContent">
      <div class="boxContent">
        <div v-for="{ creatTime, id, projectName, createAuthor, desc, updateTime } in projectArr" :key="id" class="box">
          <div class="name">
            {{ createAuthor }}
            <span>
              <el-tooltip content="预览" placement="top">
                <i class="h-icon-password_visible" @click="() => {
          $router.push(`/preview?projectId=${id}`)
        }
        "></i>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <i class="h-icon-edit" @click="() => {
          $router.push(`/drag?editID=${id}`)
        }
        "></i>
              </el-tooltip>
            </span>
          </div>
          <p class="title">{{ projectName }}</p>
          <div class="info">
            <p>项目描述: {{ desc }}</p>
            <p>创建时间: {{ creatTime }}</p>
            <p>更新时间: {{ updateTime }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加弹框 -->
    <dialog-form ref="addProject" class="addProject" dialog-title="添加项目" :form-data="addProjectFormData"
      :form-item-arr="addProjectFormItemArr" @formConfirm="addProjectFormConfirm" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      searchVal: '',
      addProjectFormData: { projectName: '', desc: '' },
      addProjectFormItemArr: [{ projectName: '项目名称', isRequired: true }, { desc: '项目描述' }],
      projectArr: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions('project', ['getProject', 'addProject']),
    getList() {
      this.getProject().then(res => {
        this.projectArr = res.data.list
      })
    },
    handleIconClick() { },
    clearIconClick() { },
    addProjectFormConfirm() {
      this.addProject(this.addProjectFormData).then(res => {
        if (res.code === 1) {
          this.$refs['addProject'].toClose()
          this.getList()
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.projectContent {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  font-size: 14px;

  .searchContent {
    width: 1310px;
    margin: 0 auto;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .mainContent {
    width: 100%;
    overflow-y: auto;
    height: 100%;

    .boxContent {
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      width: 1310px;

      .box {
        margin: 12px 10px;
        width: 410px;
        border-radius: 12px;
        position: relative;
        top: 0;
        height: 224px;
        padding: 18px 24px;
        cursor: pointer;
        background: #fff;
        transition: top 0.5s, box-shadow 0.5s, -webkit-box-shadow 0.5s;
        box-shadow: 0 10px 16px 0 rgb(0 0 0 / 8%);

        &:hover {
          box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15);
          transform: translate(0, -5px);
        }

        .name {
          color: rgba(0, 0, 0, 0.7);
          letter-spacing: 0;
          font-weight: 400;
          display: flex;
          justify-content: space-between;
          align-items: center;

          i {
            &:hover {
              color: #3c98ff;
            }
          }
        }

        .title {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.9);
          letter-spacing: 0;
          line-height: 36px;
          font-weight: 600;

          &:hover {
            color: #3c98ff;
          }
        }

        .info {
          color: rgba(0, 0, 0, 0.48);
          letter-spacing: 0;
          line-height: 22px;
          font-weight: 400;
        }
      }
    }
  }
}

.addProject {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(77, 77, 77, 0.4);
}
</style>
