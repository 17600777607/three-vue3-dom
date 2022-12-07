<template>
  <div id="r-layout-y">
    <a-layout>
      <a-layout-header>
        <slot name="headerLogo"></slot>
        <slot name="headerLeftBox"></slot>
        <slot name="headerRightBox"></slot>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="230">
          <MenuBox :list="props.menu"></MenuBox>
        </a-layout-sider>
        <a-layout-content style="overflow-y: auto">
          <slot></slot>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import MenuBox from './components/MenuBox.vue'
  export default defineComponent({
    name: 'RJLayout',
    components: { MenuBox },
    props: {
      menu: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    setup(props) {
      console.log('setup----r-layout-y')
      return { props }
    }
  })
</script>
<style scoped lang="less">
  :deep(.ant-menu) {
    background: #030a22;
  }
  :deep(.ant-layout-header) {
    background: #030a22;
  }
  #r-layout-y {
    height: 100%;
    width: 100%;

    .ant-layout {
      height: 100%;
      width: 100%;
      .ant-layout-header {
        height: 64px;
        padding: 0;
        border-bottom: 1px solid #dcdfe6;
      }
    }
    .layoutBox {
      height: 100%;
    }
    .layoutConBox {
      .routerBox {
        overflow-y: overlay;
        height: 100%;
        margin: 0;
        min-height: 280px;
      }
    }
  }
</style>
