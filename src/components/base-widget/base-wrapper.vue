<template>
  <div
    class="widget-wrapper"
    :class="{ 'design-time-bottom-margin': !!designer }"
    :style="{ display: displayStyle }"
  >
    <div
      v-show="!widget.options.hidden || designState === true"
      class="static-content-item"
      :style="{ display: displayStyle }"
      :class="[selected && $route.path != '/preview' ? 'selected' : '', customClass]"
      @click.stop="selectwidget(widget)"
    >
      <slot></slot>
    </div>

    <template v-if="!!designer && $route.path != '/preview'">
      <div v-if="designer.selectedId === widget.id" class="widget-action">
        <i class="h-icon-angle_left" title="选中父组件" @click.stop="selectParentWidget(widget)"></i>
        <i
          v-if="!!parentList && parentList.length > 1"
          class="h-icon-angle_up"
          title="上移组件"
          @click.stop="moveUpWidget(widget)"
        ></i>
        <i
          v-if="!!parentList && parentList.length > 1"
          class="h-icon-angle_down"
          title="下移组件"
          @click.stop="moveDownWidget(widget)"
        ></i>
        <i class="h-icon-delete" title="移除组件" @click.stop="removewidgetWidget"></i>
      </div>

      <div v-if="designer.selectedId === widget.id" class="drag-handler background-opacity">
        <i class="h-icon-windows_maximum" title="拖拽手柄"></i>
        <!-- <i>{{ widget.name }}</i> -->
        <i v-if="widget.options.hidden === true" class="h-icon-password_unvisible"></i>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'static-content-wrapper',
  props: {
    widget: Object,
    designer: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,

    designState: {
      type: Boolean,
      default: false,
    },

    displayStyle: {
      type: String,
      default: 'block',
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
  },
  computed: {
    selected() {
      return !!this.designer && this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass ? this.widget.options.customClass.join(' ') : ''
    },
  },
  methods: {
    selectwidget(widget) {
      if (this.designer && this.designer.selectedWidget?.id != widget.id) {
        this.designer.setSelected(widget)
        this.designer.emitEvent('widget-selected', this.parentWidget) //发送选中组件的父组件对象
      }
    },

    selectParentWidget() {
      if (this.parentWidget) {
        this.designer.setSelected(this.parentWidget)
      } else {
        this.designer.clearSelected()
      }
    },

    moveUpWidget() {
      this.designer.moveUpWidget(this.parentList, this.indexOfParentList)
      this.designer.emitHistoryChange()
    },

    moveDownWidget() {
      this.designer.moveDownWidget(this.parentList, this.indexOfParentList)
      this.designer.emitHistoryChange()
    },

    removewidgetWidget() {
      if (this.parentList) {
        let nextSelected = null
        if (this.parentList.length === 1) {
          if (this.parentWidget) {
            nextSelected = this.parentWidget
          }
        } else if (this.parentList.length === 1 + this.indexOfParentList) {
          nextSelected = this.parentList[this.indexOfParentList - 1]
        } else {
          nextSelected = this.parentList[this.indexOfParentList + 1]
        }

        this.$nextTick(() => {
          this.parentList.splice(this.indexOfParentList, 1)
          //if (!!nextSelected) {
          this.designer.setSelected(nextSelected)
          //}

          this.designer.emitHistoryChange()
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$--color-primary: #409eff;
.design-time-bottom-margin {
  margin-bottom: 5px;
}

.widget-wrapper {
  position: relative;

  .widget-action {
    position: absolute;
    //bottom: -24px;
    bottom: 0;
    right: -2px;
    top: calc(100% - 21px);
    height: 22px;
    line-height: 22px;
    background: $--color-primary;
    z-index: 9;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .drag-handler {
    position: absolute;
    top: 0;
    //bottom: -22px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: -1px;
    height: 20px;
    line-height: 20px;
    //background: $--color-primary;
    z-index: 9;

    i {
      font-size: 12px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: move;
    }

    &:hover {
      //opacity: 1;
      background: $--color-primary;
    }
  }
}

.static-content-item {
  min-height: 20px;
  display: flex; /* 垂直居中 */
  align-items: center; /* 垂直居中 */
  padding: 0 20px;
  ::v-deep .el-divider--horizontal {
    margin: 0;
  }
}

.el-form-item.selected,
.static-content-item.selected {
  outline: 2px solid $--color-primary;
}
</style>
