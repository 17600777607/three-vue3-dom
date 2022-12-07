<template>
  <div id="center-point"> </div>
</template>
<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import { PointDraw } from '~/views/center-point/PointDraw'

  console.log('setup----center-point')

  let point = ref<any>(null)

  onMounted(() => {
    point.value = new PointDraw('center-point')
    point.value.init()
    point.value.drawPoint()
  })
  onUnmounted(() => {
    point.value.clearListener()
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
