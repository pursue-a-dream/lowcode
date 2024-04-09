<template>
  <div class="dragContent">{{ emptyDesc || '拖拽组件或者模板到这里' }}</div>
</template>

<script>
export default {
  props: {
    emptyDesc: {
      type: String,
      default: '',
    },
  },
  name: 'dragEmpty',
}
</script>
<style lang="scss" scoped>
.dragContent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  background-color: #f0f0f0;
  border: 1px dotted;
  color: #a7b1bd;
  min-height: 50px;
}
</style>
