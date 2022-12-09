<template>
  <div style="height: 100%; position: relative">
    <div id="earth-center"> </div>
    <div id="text"> </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { EarthCenter } from '~/views/earth-center/EarthCenter'

  console.log('setup----earth-center')
  const state = reactive({
    plane: undefined as unknown as EarthCenter
  })
  onMounted(() => {
    state.plane = new EarthCenter('earth-center')
    state.plane.initPlane()
  })
</script>
<style scoped lang="less">
  #earth-center {
    height: 100%;
  }
</style>
