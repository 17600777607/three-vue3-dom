<template>
  <div style="height: 100%; position: relative">
    <div id="center-point"> </div>
    <div id="text"> </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, onUnmounted, reactive } from 'vue'
  import { PointDraw } from '~/views/center-point/PointDraw'

  console.log('setup----center-point')
  let state = reactive({
    point: null as any
  })

  onMounted(async () => {
    state.point = new PointDraw('center-point')
    await state.point.initPointDraw()
  })
  onUnmounted(() => {
    state.point.clearListener()
  })
</script>
<style scoped lang="less">
  #center-point {
    height: 100%;
  }
  #text {
    .textBox {
      position: absolute;
      color: #fff;
      font-size: 8px;
    }
  }
</style>
