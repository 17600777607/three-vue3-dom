<template>
  <div style="height: 100%; position: relative">
    <div id="plane"> </div>
    <div id="text"> </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import { TextDraw } from '~/views/text/TextDraw'

  console.log('setup----text')
  let text = ref<any>(null)
  onMounted(() => {
    text.value = new TextDraw('plane')
    text.value.init()
    text.value.initGeometry()
    text.value.drawText('text')
  })
  onUnmounted(() => {
    text.value.clearListener()
  })
</script>
<style scoped lang="less">
  #text,
  #plane {
    height: 100%;
  }
  #text {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
  }
</style>
