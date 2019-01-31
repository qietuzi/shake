<template>
  <div class="circle-wrapper" @touchstart.stop.prevent="" @touchmove.stop.prevent="" @touchend.stop.prevent="">
    <div ref="circle-container" class="circle-container">
      <CircleMeteor></CircleMeteor>
      <CircleBall ref="circleBall" class="circle-ball" :data="list"></CircleBall>
      <div class="circle-tips-box">
        <p v-if="supportShake" class="circle-small-tips">摇一摇换一批</p>
        <p v-else class="circle-small-tips" @touchstart.stop.prevent="getMatchList">点击换一批</p>
      </div>
    </div>
  </div>
</template>

<script>
import Shake from './shake'

import moak from './mock.json'

import CircleBall from '../CircleBall'
import CircleMeteor from '../CircleMeteor'

export default {
  data() {
    return {
      list: [], // 互推池列表
      loading: false, // 是否正在加载
      supportShake: true, // 是否开启摇一摇
      shake: new Shake({ vibrate: true }) // 摇一摇实例
    }
  },
  mounted() {
    let _self = this
    this.getMatchList()

    let screenHeight = document.documentElement.clientHeight
    let realSize = Math.round(screenHeight / 2)
    let ratio = realSize / 660
    ratio = ratio > 1 ? 1 : ratio
    this.$refs.circleBall.$el.style.zoom = ratio

    this.supportShake = this.shake.isSupport()
    if (this.supportShake) {
      this.shake.listen(function() {
        _self.getMatchList()
      })
    }
  },
  destroyed() {
    this.shake.destroy()
  },
  methods: {
    // init()
    async getMatchList() {
      if (this.loading) {
        return false
      }
      this.loading = true
      try {
        if (this.loading) document.querySelector('#circleAudio').play()
      } finally {
        this.list = moak
        this.loading = false
      }
    }
  },
  components: {
    CircleBall,
    CircleMeteor
  }
}
</script>

<style lang="scss" scoped>
.circle-wrapper {
  height: 100vh;
  padding: 100px 0;
  background: #181a23;
}
.circle-container {
  height: 100%;
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  canvas {
    position: absolute;
  }
}
.circle-ball {
  width: 660px;
  height: 660px;
  overflow: hidden;
  margin: 0px auto;
}
.circle-tips-box {
  color: #fff;
  overflow: hidden;
  text-align: center;
  position: relative;
  font-family: 'PingFang SC Medium';
  .circle-small-tips {
    font-size: 22px;
    color: #d5d5d5;
  }
  .circle-desc-tips {
    font-size: 24px;
    margin-top: 20px;
    color: #ffffff;
  }
}
</style>
