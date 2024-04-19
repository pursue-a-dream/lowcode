<template>
  <div class="projectContent">
    <div class="searchContent">
      <el-input
        v-model="searchVal"
        style="margin-right: 20px; width: 250px"
        placeholder="请输入"
        suffix-icon="h-icon-search"
        clearable
        :on-icon-click="getList"
        :clear-icon-click="clearIconClick"
      >
      </el-input>
      <el-button
        style="margin-right: 40px"
        type="primary"
        :radius="true"
        @click="
          () => {
            $refs['addProject'].toShow()
          }
        "
        >添加项目</el-button
      >
    </div>
    <div class="mainContent">
      <div class="boxContent">
        <div
          v-for="{
            creatTime,
            id,
            projectName,
            createAuthor,
            desc,
            updateTime,
            isCreater,
            isDeveloper,
            developers,
            visitors,
            projectType,
          } in filterProjectArr"
          :key="id"
          class="box"
        >
          <div class="name">
            {{ createAuthor }}
            <span>
              <el-tooltip content="预览" placement="top">
                <i
                  class="h-icon-password_visible"
                  @click="
                    () => {
                      $router.push(`/preview?projectId=${id}`)
                    }
                  "
                ></i>
              </el-tooltip>
              <el-tooltip v-if="isDeveloper || isCreater" content="编辑" placement="top">
                <i
                  class="h-icon-edit"
                  @click="
                    () => {
                      $router.push(`/drag?editID=${id}`)
                    }
                  "
                ></i>
              </el-tooltip>
            </span>
          </div>
          <p
            class="title"
            @click="
              () => {
                $router.push(`/preview?projectId=${id}`)
              }
            "
          >
            {{ projectName }}
          </p>
          <div class="info">
            <p>创建时间: {{ creatTime }}</p>
            <p>更新时间: {{ updateTime }}</p>
            <el-tooltip :content="developers.join('  ')" placement="top">
              <p class="userInfo">
                管理员：{{ projectType == 'userGroup' ? developers.join('  ') : '孙培显' }}
              </p>
            </el-tooltip>
            <el-tooltip :content="visitors.join('  ')" placement="top">
              <p class="userInfo">
                可预览人员：{{ projectType == 'userGroup' ? visitors.join('  ') : '所有人' }}
              </p>
            </el-tooltip>
            <el-tooltip :content="desc" placement="top">
              <p class="userInfo">项目描述: {{ desc }}</p>
            </el-tooltip>
            <!-- <el-tooltip :content="developers.join('、')" placement="top">
              <el-badge :value="developers.length" class="item">
                <el-button size="small">管理员</el-button>
              </el-badge>
            </el-tooltip>
            <el-tooltip :content="visitors.join('、')" placement="top">
              <el-badge :value="visitors.length" class="item">
                <el-button size="small">可查看人员</el-button>
              </el-badge>
            </el-tooltip> -->
          </div>
          <div class="createrToDoContent">
            <el-tooltip v-if="isCreater" content="删除" placement="top">
              <i class="h-icon-delete" @click="toDelete(id)"></i>
            </el-tooltip>
            <el-tooltip v-if="isCreater" content="设置" placement="top">
              <i class="h-icon-setting" @click="toSet(id)"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加弹框 -->
    <dialog-form
      ref="addProject"
      class="addProject"
      dialog-title="添加项目"
      :form-data="addProjectFormData"
      :form-item-arr="addProjectFormItemArr"
      @formConfirm="addProjectFormConfirm"
    />
    <!-- 编辑弹框 -->
    <dialog-form
      ref="editProject"
      class="addProject"
      dialog-title="设置项目"
      :form-data="editProjectFormData"
      :form-item-arr="editProjectFormItemArr"
      @formConfirm="editProjectFormConfirm"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    const checkUsers = (rule, value, cb) => {
      if (value) {
        if (!/^[\u4e00-\u9fa5、1-9]+$/.test(value)) {
          cb(new Error('仅支持中文、数字和下划线组成的字符串'))
        }
      }
      cb()
    }
    return {
      searchVal: '',
      addProjectFormData: { projectName: '', desc: '' },
      addProjectFormItemArr: [
        {
          projectName: '项目名称',
          isRequired: true,
        },
        {
          developers: '共同开发人员',
          descriptionRender: h => {
            return <div style="color:#f3970f">用户名请使用中文并通过下划线分割，如张三、李四</div>
          },
          rules: [
            {
              required: false,
              validator: (rule, value, cb) => {
                checkUsers(rule, value, cb, '请输入')
              },
              trigger: 'change',
            },
          ],
        },
        {
          visitors: '可预览人员',
          descriptionRender: h => {
            return <div style="color:#f3970f">用户名请使用中文并通过下划线分割，如张三、李四</div>
          },
          rules: [
            {
              required: false,
              validator: (rule, value, cb) => {
                checkUsers(rule, value, cb, '请输入')
              },
              trigger: 'change',
            },
          ],
        },
        { desc: '项目描述', type: 'textarea' },
      ],
      editProjectFormData: { projectName: '', desc: '' },
      editProjectFormItemArr: [
        {
          projectName: '项目名称',
          isRequired: true,
        },
        {
          developers: '共同开发人员',
          descriptionRender: h => {
            return <div style="color:#f3970f">用户名请使用中文并通过下划线分割，如张三、李四</div>
          },
          rules: [
            {
              required: false,
              validator: (rule, value, cb) => {
                checkUsers(rule, value, cb, '请输入')
              },
              trigger: 'change',
            },
          ],
        },
        {
          visitors: '可预览人员',
          descriptionRender: h => {
            return <div style="color:#f3970f">用户名请使用中文并通过下划线分割，如张三、李四</div>
          },
          rules: [
            {
              required: false,
              validator: (rule, value, cb) => {
                checkUsers(rule, value, cb, '请输入')
              },
              trigger: 'change',
            },
          ],
        },
        { desc: '项目描述', type: 'textarea' },
      ],
      projectArr: [],
    }
  },
  computed: {
    filterProjectArr() {
      return this.projectArr.filter(item => {
        return item.projectName.includes(this.searchVal)
      })
    },
  },
  mounted() {
    this.getList()
  },

  methods: {
    ...mapActions('project', [
      'getProject',
      'addProject',
      'delProject',
      'getProjectInfoByID',
      'editProjectByID',
    ]),
    // 去除字符串首尾指定字符
    trimChar(str, char) {
      const regExp = new RegExp(`^${char}+|${char}+$`, 'g')
      return str.replace(regExp, '')
    },
    dealUser(str) {
      if (!str) {
        return []
      }
      str = this.trimChar(str, '、 ')
      return str.split('、')
    },
    getList() {
      this.getProject().then(res => {
        this.projectArr = res.data.list
      })
    },
    handleIconClick() {},
    clearIconClick() {},
    addProjectFormConfirm() {
      this.addProject({
        ...this.addProjectFormData,
        developers: this.dealUser(this.addProjectFormData.developers),
        visitors: this.dealUser(this.addProjectFormData.visitors),
      })
        .then(res => {
          if (res.code === 1) {
            this.$refs['addProject'].toClose()
            this.getList()
          }
        })
        .catch(() => {
          this.$refs['addProject'].noLoading()
        })
    },
    toDelete(id) {
      this.$confirm('删除后将无法恢复,请谨慎操作,确定删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question',
        onConfirm: () => {
          this.delProject({ id }).then(res => {
            this.getList()
          })
        },
      })
    },
    // 根据ID获取系统信息
    toSet(id) {
      this.getProjectInfoByID(id).then(res => {
        this.editProjectFormData = {
          ...res.data,
          developers: res.data.developers.join('、'),
          visitors: res.data.visitors.join('、'),
        }
        this.$refs['editProject'].toShow()
      })
    },
    // 更改系统设置
    editProjectFormConfirm() {
      this.editProjectByID({
        ...this.editProjectFormData,
        developers: this.dealUser(this.editProjectFormData.developers),
        visitors: this.dealUser(this.editProjectFormData.visitors),
      })
        .then(res => {
          if (res.code === 1) {
            this.$refs['editProject'].toClose()
            this.getList()
          }
        })
        .catch(() => {
          this.$refs['editProject'].noLoading()
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
          .userInfo {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
        }
        .createrToDoContent {
          position: absolute;
          right: 20px;
          bottom: 10px;
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
