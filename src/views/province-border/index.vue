<template>
  <div style="position: relative; height: 100%">
    <div id="boundary"> </div>
    <div id="provinceInfo"> </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue'

  import { ChinaMap } from '~/views/province-border/ChinaMap'

  onMounted(async () => {
    let line = new ChinaMap()
    line.init()
  })
</script>

<style scoped lang="less">
  #boundary {
    height: 100%;
  }
  #provinceInfo {
    position: absolute;
    z-index: 2;
    background: white;
    padding: 10px;
    visibility: hidden;
  }
</style>
