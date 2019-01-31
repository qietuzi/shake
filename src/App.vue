<template>
  <div id="app">
    <router-view></router-view>
    <audio id="circleAudio" style="display:none;" controls="controls">
      <source src="../public/tips.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style scoped lang="scss">
#app {
  overflow: hidden;
  min-height: 100vh;
  position: relative;
  box-sizing: border-box;
  background: #fff;
}
</style>