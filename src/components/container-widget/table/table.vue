/* eslint-disable */
<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :class="[selected ? 'selected' : '', customClass]"
    style="padding: 5px"
    @click.native.stop="selectWidget(widget)"
  >
    <h-paged-table
      ref="hTable"
      :style="widget.activeStyle"
      :fetch="fetch"
      :data="res => res.data.results"
      :total="res => res.data.total"
      :page-count="res => Math.ceil(res.data.total / pageSize)"
      :page-size="pageSize"
      @current-change="currentChange => (currentPage = currentChange)"
      @size-change="size => (pageSize = size)"
    >
      <el-table
        slot-scope="props"
        :data="props.data"
        force-scroll
        :key="tableKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <template v-for="(subWidget, swIdx) in widget.widgetList">
          <el-table-column
            :key="subWidget.id"
            v-bind="subWidget.options"
            :width="subWidget.options.width || 150"
            :filters="dealFilters(subWidget.options)"
            :column-key="subWidget.options.prop"
            :filter-placement="subWidget.options.filterArr ? 'bottom' : undefined"
            :filter-method="subWidget.options.showType === 'filterArr' ? filterHandler : undefined"
            show-overflow-tooltip
          >
            <!-- <template #header> {{ subWidget.options.label }} </template> -->
            <template slot-scope="scope">
              <component
                :is="subWidget.type + '-widget'"
                :key="subWidget.id + scope?.row.id"
                :widget="subWidget"
                :designer="designer"
                :parent-list="widget.widgetList"
                :index-of-parent-list="swIdx"
                :parent-widget="widget"
                :design-state="true"
                :row="scope?.row"
                @selectRow="
                  row => {
                    curRow = row
                  }
                "
              />
            </template>
          </el-table-column>
        </template>
      </el-table>
    </h-paged-table>
  </container-wrapper>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'
export default {
  name: 'table-widget',
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
      currentPage: 1,
      pageSize: 20,
      tableKey: new Date().getTime(),
      // fetch: url => defaultPromise({ url }),
      test: {
        options: {
          dataSource: { a: 1 },
        },
      },
      curRow: {},
      selectedRowsKey: [],
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
        let tableEdit = this.widget.id + 'tableEdit'
        let tableDelete = this.widget.id + 'tableDelete'
        let tableReload = this.widget.id + 'tableReload'
        if (newV[tableEdit] != oldV[tableEdit]) {
        }
        if (newV[tableDelete] != oldV[tableDelete]) {
          // 单个删除
          if (this.curRow.id) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.widget.options.dataSource = this.widget.options.dataSource.filter(row => {
              return row.id != this.curRow.id
            })
          } else {
            // 批量删除
            if (this.selectedRowsKey.length > 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              this.widget.options.dataSource = this.widget.options.dataSource.filter(row => {
                return !this.selectedRowsKey.includes(row.id)
              })
            } else {
              this.$message({
                message: '请在table中选择数据',
                type: 'success',
              })
            }
          }
        }
        if (newV[tableReload] != oldV[tableReload]) {
          this.reload()
        }
      },
      deep: true,
    },
    // 此处为了触发table组件从新渲染
    'widget.widgetList': {
      handler(newV, oldV) {
        this.tableKey = new Date().getTime()
      },
      deep: true,
    },
    'widget.options.dataSource': {
      handler(newV, oldV) {
        this.reload()
      },
      deep: true,
    },
    selectedRowsKey: {
      handler(newVal) {
        this.widget.widgetProvideData.checkedRowKeys = {
          value: 'checkedRowKeys',
          label: '选中节点数组',
          data: newVal,
        }
      },
      immediate: true,
    },
  },
  methods: {
    fetch() {
      let params = {}
      // let [connectWidgetName, widgetDataProp] = this.widget.options.reloadParameter
      // if (connectWidgetName) {
      //   let findWidget = this.designer.getWidgetByID(connectWidgetName)
      //   if (findWidget) {
      //     params = findWidget.widgetProvideData[widgetDataProp].data
      //   }
      // }
      // 查询绑定的数据源，进行数据过滤,
      // 获取表格请求绑定的数据源
      let tableData = [...this.widget.options.dataSource]
      if (this.widget.options.dataSource[0]) {
        const paramsList = this.widget.triggerEvent[0].paramsList
        let filterData = {}
        paramsList.map(([widgetId, data]) => {
          const findWidget = this.designer.getWidgetByID(widgetId)
          if (data == 'formData' && findWidget) {
            filterData = { ...filterData, ...findWidget.widgetProvideData.formData.data }
          }
        })
        const filterDataKeys = Object.keys(filterData).filter(key => {
          if (Object.keys(this.widget.options.dataSource[0]).includes(key)) {
            return true
          }
          return false
        })

        for (let index = 0; index < filterDataKeys.length; index++) {
          tableData = tableData.filter(item => {
            const key = filterDataKeys[index],
              val = filterData[key]
            if (val == undefined || val === null || val == '') {
              return true
            }
            if (Array.isArray(val)) {
              if (val.length == 0) {
                return true
              }
              // 判断为时间戳
              if ((val.length == 2) & (val[0] * 1 > 100000000)) {
                if (val[0] * 1 <= item[key] * 1 && item[key] * 1 <= val[1] * 1) {
                  return true
                }
                return false
              } else {
                return val.includes(item[key])
              }
            } else {
              return val == item[key] || (!Number.isInteger(item[key]) && item[key].includes(val))
            }
          })
        }
      }
      return new Promise(resolve => {
        this.$message({
          message: '查询成功',
          type: 'success',
        })
        resolve({
          data: {
            results: tableData,
            total: this.widget.options.dataSource.length,
          },
        })
      })
    },
    reload(reloadOpt) {
      this.$refs.hTable.reload(reloadOpt)
    },
    handleSelectionChange(val) {
      this.selectedRowsKey = val.map(item => item[this.widget.options.tableLineKey])
    },
    dealFilters({ showType, filterArr }) {
      if (showType != 'filterArr') {
        return undefined
      }
      return Object.keys(filterArr).map(key => {
        return {
          value: key * 1,
          ...filterArr[key],
        }
      })
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
  },
}
</script>

<style lang="scss">
.tableContent {
  width: 100%;
  min-height: 50px;
  padding: 5px;
  outline: 1px dashed #336699;
}
.selected {
  outline: 2px solid #409eff !important;
}
</style>
