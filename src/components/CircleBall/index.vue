<!--
    @name       CircleBall
    @desc       互推圈球体
    @props 
            data    数据列表
-->
<template>
  <div ref="ballWrapper" class="circle-ball" @touchstart.stop.prevent="touchstart()" @touchmove.stop.prevent="touchmove($event)" @touchend.stop.prevent="touchend($event)">
    <div class="ball-item" v-for="(item,index) in data" :key="index" :item="item" @touchstart="childTouch(item)">
      <img v-if="item.headImg" :src="item.headImg" alt="" class="ball-item-head">
      <img v-else src="/static/img/default-header.png" alt="" class="ball-item-head">
    </div>
  </div>
</template>

<script>
class BallItem {
  constructor(x, y, z, ele) {
    this.x = x
    this.y = y
    this.z = z
    this.ele = ele
    this.radius = this.ele.offsetWidth / 2
  }
  // 圆心和半径
  move(x, y, r) {
    let scale = r / (r - this.z / 2)
    let alpha = (this.z + r) / (2 * r)
    let top = this.y + y - this.radius + 'px'
    let left = this.x + x - this.radius + 'px'
    let transform = `translate3d(${left}, ${top}, 0) scale(${scale})`
    this.ele.style.opacity = alpha + 0.5
    this.ele.style.transform = transform
    this.ele.style.webkitTransform = transform
    this.ele.style.zIndex = parseInt(scale * 100)
  }
}

export default {
  props: ['data'],
  data() {
    return {
      radius: null, // 半径
      center: null, // 圆心
      children: [], // 小球
      offset: null, // 坐标偏移量
      animate: null, // 动画计时器
      angleY: Math.PI / 2000,
      angleX: Math.PI / 2000
    }
  },
  mounted() {
    let radius = this.$refs.ballWrapper.offsetWidth / 2
    this.radius = radius - 40
    this.offset = {
      y: this.$refs.ballWrapper.offsetTop,
      x: this.$refs.ballWrapper.offsetLeft
    }
    this.center = { x: radius, y: radius }
  },
  methods: {
    // init 绘制初始坐标
    init() {
      this.stopAnimation()
      let children = document.querySelectorAll('.ball-item')
      children.forEach((item, index) => {
        let a = Math.acos((2 * index + 1) / children.length - 1)
        let b = a * Math.sqrt(children.length * Math.PI)
        let x = this.radius * Math.sin(a) * Math.cos(b)
        let y = this.radius * Math.sin(a) * Math.sin(b)
        let z = this.radius * Math.cos(a)
        let it = new BallItem(x, y, z, item)
        this.children.push(it)
      })
      this.startAnimation()
    },
    rotateX() {
      let cos = Math.cos(this.angleX)
      let sin = Math.sin(this.angleX)
      this.children.forEach(item => {
        let y = item.y * cos - item.z * sin
        let z = item.z * cos + item.y * sin
        item.y = y
        item.z = z
      })
    },
    rotateY() {
      let cos = Math.cos(this.angleY)
      let sin = Math.sin(this.angleY)
      this.children.forEach((item, index) => {
        let x = item.x * cos - item.z * sin
        let z = item.z * cos + item.x * sin
        item.x = x
        item.z = z
      })
    },
    // animation
    animation() {
      this.rotateX()
      this.rotateY()
      this.children.forEach(item => {
        item.move(this.center.x, this.center.y, this.radius)
      })
    },
    // startAnimation
    startAnimation() {
      this.animate = setInterval(() => {
        this.animation()
      }, 40)
    },
    // stopAnimation
    stopAnimation() {
      clearInterval(this.animate)
      this.animate = null
    },
    // touchstart
    touchstart() {
      this.stopAnimation()
    },
    // touchmove
    touchmove(event) {
      let x = event.touches[0].clientX - this.center.x
      let y = event.touches[0].clientY - this.center.y
      this.angleY = x * -0.0001
      this.angleX = y * -0.0001
      this.animation()
    },
    // touchend
    touchend() {
      let x = event.changedTouches[0].clientX - this.center.x
      let y = event.changedTouches[0].clientY - this.center.y
      this.angleY = x * -0.0001
      this.angleX = y * -0.0001
      this.startAnimation()
    },
    // 点击ball-item
    childTouch(item) {
      console.log(item)
    }
  },
  watch: {
    data(newVal) {
      this.$nextTick(() => {
        this.init()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-ball {
  width: 100%;
  height: 100%;
  position: relative;
}
.ball-item {
  top: 0;
  left: 0;
  opacity: 0;
  width: 40px;
  height: 40px;
  overflow: hidden;
  position: absolute;
  border-radius: 20px;
  box-sizing: border-box;
  border: 2px solid #8aa1ff;
}
.ball-item-head {
  width: 100%;
  height: 100%;
}
</style>
