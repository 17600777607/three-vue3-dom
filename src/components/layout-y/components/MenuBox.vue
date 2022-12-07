<template>
  <div id="r-menu-box">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      style="height: 100%"
      theme="dark"
      @select="handleOnSelect"
    >
      <div v-for="d in props.list" :key="d.path">
        <template v-if="!d.children">
          <a-menu-item :key="d.path">
            <span>
              <i :class="d.meta.icon === '' ? '' : `iconfont ${d.meta.icon}`" />
              {{ d.meta.title }}
            </span>
          </a-menu-item>
        </template>
        <template v-else>
          <a-sub-menu :key="d.path">
            <template #title>
              <span>
                <i :class="d.meta.icon === '' ? '' : `iconfont ${d.meta.icon}`" />
                {{ d.meta.title }}
              </span>
            </template>
            <a-menu-item v-for="f in d.children" :key="f.path">
              <i :class="f.meta.icon === '' ? '' : `iconfont ${f.meta.icon}`" />
              {{ f.meta.title }}
            </a-menu-item>
          </a-sub-menu>
        </template>
      </div>
    </a-menu>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  export default defineComponent({
    name: 'MenuBox',
    props: {
      list: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    setup: function (props) {
      console.log('setup----r-menu-box', props.list)
      const selectedKeys = ref<string[]>([])
      const openKeys = ref<string[]>([])

      //刷新后 路由选中状态
      const route = useRoute()
      watch(
        () => route.path,
        (newVal: string) => {
          selectedKeys.value = [newVal]
          const pathList = newVal.split('/')
          openKeys.value = []
          pathList.forEach((d: string, index: number) => {
            if (index !== pathList.length - 1) {
              if (d) {
                openKeys.value.push(`/${d}`)
              }
            }
          })
        },
        { immediate: true }
      )
      const router = useRouter()
      const handleOnSelect = (item: { key: string }) => {
        router.push({ path: item.key })
      }
      return {
        handleOnSelect,
        props,
        selectedKeys,
        openKeys
      }
    }
  })
</script>
<style lang="less">
  #r-menu-box {
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
