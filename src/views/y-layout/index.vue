<template>
  <r-layout-y id="r-layout-y" :menu="layoutYRoute[0].children">
    <template #headerLogo>
      <div class="rj-layout-logo"></div>
    </template>
    <template #headerLeftBox>
      <div class="rj-layout-title">
        <div class="headerTitle">PTM 3D 看板</div>
      </div>
    </template>
    <template #headerRightBox> </template>
    <router-view />
  </r-layout-y>
</template>

<script lang="ts" setup>
  import RLayoutY from '~/components/layout-y/index.vue'
  import { layoutYRoute } from '~/router/router'
</script>
<style lang="less" scoped>
  :deep(.ant-popover-inner-content) {
    padding: 0;
  }
  :deep(.ant-space-item) {
    cursor: pointer;
  }

  #r-layout-y {
    .rj-layout-logo {
      position: absolute;
      height: 60px;
      width: 230px;
      top: 0;
      left: 0;
      background: url('../../assets/r-logo.png');
      background-repeat: no-repeat;
      background-size: auto 45%;
      background-position: 50%;
    }
    .rj-layout-logo::after {
      content: ' ';
      position: absolute;
      height: 30%;
      width: 1px;
      background-color: #dcdfe6;
      right: 0;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
    }
    .rj-layout-title {
      left: 230px;
      position: absolute;
      height: 60px;
      top: 0;
      .headerTitle {
        line-height: 60px;
        padding-left: 20px;
        font-weight: 700;
        color: #fff;
      }
    }
  }
</style>
