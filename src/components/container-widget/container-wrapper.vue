<template>
  <div class="container-wrapper" :class="[customClass]">
    <slot></slot>

    <div
      v-if="designer.selectedId === widget.id && !widget.internal && $route.path != '/preview'"
      class="container-action"
    >
      <i class="h-icon-angle_left" title="选中父组件" @click.stop="selectParentWidget(widget)"></i>
      <i
        v-if="!!parentList && parentList.length > 1"
        class="h-icon-angle_up"
        title="上移组件"
        @click.stop="moveUpWidget()"
      ></i>
      <i
        v-if="!!parentList && parentList.length > 1"
        class="h-icon-angle_down"
        title="下移组件"
        @click.stop="moveDownWidget()"
      ></i>
      <!-- <i
        v-if="widget.type === 'table'"
        class="h-icon-add"
        title="插入新行"
        @click.stop="appendTableRow(widget)"
      ></i> -->
      <i
        v-if="widget.type === 'table-column'"
        class="h-icon-add"
        title="插入新列"
        @click.stop="appendTableCol(parentWidget, indexOfParentList)"
      ></i>
      <i
        v-if="widget.type === 'tabs'"
        class="h-icon-add"
        title="插入Tab"
        @click.stop="appendTabPane(widget)"
      ></i>
      <!-- 添加collapse-item -->
      <i
        v-if="widget.type === 'collapse'"
        class="h-icon-add"
        title="插入折叠行"
        @click.stop="appendCollapseItem(widget)"
      ></i>
      <!-- 添加row的col -->
      <i
        v-if="widget.type === 'row'"
        class="h-icon-add"
        title="插入折叠行"
        @click.stop="appendRowItem(widget)"
      ></i>
      <i
        v-if="widget.type === 'grid' || widget.type === 'table'"
        class="h-icon-copy"
        title="复制组件"
        @click.stop="cloneContainer(widget)"
      ></i>
      <i class="h-icon-delete" title="移除组件" @click.stop="removeWidget"></i>
    </div>

    <div
      v-if="designer.selectedId === widget.id && !widget.internal && $route.path != '/preview'"
      class="drag-handler"
    >
      <i class="h-icon-windows_maximum" title="i18nt('designer.hint.dragHandler')"></i>
      <i>{{ widget.name }}</i>
      <!-- <i v-if="widget.options.hidden === true" class="h-icon-password_unvisible"></i> -->
    </div>
  </div>
</template>

<script>
import containerMixin from '@/components/container-widget/containerMixin'

export default {
  name: 'ContainerWrapper',
  mixins: [containerMixin],
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
  computed: {
    customClass() {
      return this.widget.options.customClass ? this.widget.options.customClass.join(' ') : ''
    },
  },
}
</script>

<style lang="scss" scoped>
$--color-primary: #409eff;
.container-wrapper {
  position: relative;
  margin-bottom: 5px;
  // width: fit-content;

  .container-action {
    position: absolute;
    //bottom: -30px;
    bottom: 0;
    right: -2px;
    height: 20px;
    line-height: 28px;
    background: $--color-primary;
    z-index: 0;

    i {
      font-size: 20px;
      color: #fff;
      margin: 0 2px;
      cursor: pointer;
    }
  }

  .drag-handler {
    position: absolute;
    top: -2px;
    //bottom: -24px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: -2px;
    height: 22px;
    line-height: 22px;
    background: $--color-primary;
    z-index: 9;

    i {
      font-size: 14px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: move;
    }
  }
}
</style>
