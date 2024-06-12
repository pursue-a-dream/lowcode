<template>
  <el-form
    class="styleContent"
    :model="styleConfig"
    label-position="left"
    label-width="120px"
    @submit.native.prevent
  >
    <el-collapse v-model="activeNames">
      <el-collapse-item title="布局" name="1">
        <el-alert
          title="外层为margin，内层为padding,输入数字即可"
          type="info"
          simple
          :closable="false"
          show-icon
        ></el-alert>
        <el-input v-model="styleConfig.margin.top" placeholder="请输入"
          ><span slot="suffix">px</span>
        </el-input>
        <div class="d-flex space-between">
          <el-input v-model="styleConfig.margin.left" class="asideInput" placeholder="请输入"></el-input>
          <div class="paddingContent">
            <el-input v-model="styleConfig.padding.top" placeholder="请输入"
              ><span slot="suffix">px</span></el-input
            >
            <div class="paddingAside d-flex space-between">
              <el-input v-model="styleConfig.padding.left" placeholder="请输入"></el-input>
              <el-input v-model="styleConfig.padding.right" placeholder="请输入"></el-input>
            </div>
            <el-input v-model="styleConfig.padding.bottom" placeholder="请输入"
              ><span slot="suffix">px</span></el-input
            >
          </div>
          <el-input v-model="styleConfig.margin.right" class="asideInput" placeholder="请输入"></el-input>
        </div>
        <el-input v-model="styleConfig.margin.bottom" placeholder="请输入"
          ><span slot="suffix">px</span></el-input
        >
        <el-form-item label="宽度">
          <el-input v-model="styleConfig.width"><span slot="suffix">px</span></el-input>
        </el-form-item>
        <el-form-item label="高度">
          <el-input v-model="styleConfig.height"><span slot="suffix">px</span></el-input>
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item title="字体" name="2">
        <el-form-item label="字号">
          <el-input v-model="styleConfig.font.size"><span slot="suffix">px</span></el-input>
        </el-form-item>
        <el-form-item label="字重">
          <el-select v-model="styleConfig.font.weight" placeholder="请选择">
            <el-option v-for="item in fontWeightArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行高">
          <el-input v-model="styleConfig['lineHeight']"><span slot="suffix">px</span></el-input>
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>
<script>
export default {
  props: {
    styleConfig: Object,
    selectedWidget: Object,
  },
  data() {
    return {
      activeNames: ['1', '2'],
      fontWeightArr: [200, 300, 400, 500, 600, 800, 1000],
    }
  },
  watch: {
    styleConfig: {
      deep: true,
      immediate: true,
      handler(val) {
        let { margin, font, lineHeight, padding, width, height } = val
        this.selectedWidget.activeStyle = {
          marginTop: margin.top + 'px',
          marginLeft: margin.left + 'px',
          marginRight: margin.right + 'px',
          marginBottom: margin.bottom + 'px',

          paddingTop: padding.top + 'px',
          paddingLeft: padding.left + 'px',
          paddingRight: padding.right + 'px',
          paddingBottom: padding.bottom + 'px',

          width: width ? (width.startsWith('calc') ? width : width + 'px') : '',
          height: height ? (height.startsWith('calc') ? height : height + 'px') : '',

          fontSize: font.size + 'px',
          fontWeight: font.weight,
          lineHeight: lineHeight + 'px',
        }
      },
    },
  },
}
</script>
<style lang="scss">
.styleContent {
  .el-input__inner {
    text-align: center;
  }
  .asideInput {
    width: 50px;
    height: 150px;
    .el-input__inner {
      height: 100%;
    }
  }
  .paddingContent {
    width: auto;
    height: 100%;
    .paddingAside {
      .el-input {
        width: 50px;
      }
      height: 86px;
      .el-input__inner {
        height: 100%;
        padding: 0;
      }
    }
  }
}
</style>
