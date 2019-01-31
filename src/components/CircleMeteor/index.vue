<!--
    @name       CircleMeteor
    @desc       互推圈球体背景
-->
<template>
  <canvas class="meteor-canvas" ref="canvas"></canvas>
</template>

<script>
import meteor from './meteor.png'

const meteorImg = new Image()
meteorImg.src = meteor

// 星星
class Star {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.directionX = Math.round(Math.random())
    this.directionY = Math.round(Math.random())
  }
  draw(ctx) {
    ctx.beginPath()
    this.x = Math.round(Math.random() * this.width)
    this.y = Math.round(Math.random() * this.height)
    this.r = Math.round(Math.random() * 8)
    this.opcity = (Math.random() + 0.5).toFixed(2)
    let grd = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.r
    )
    grd.addColorStop(0, `rgba(255,255,255,${this.opcity})`)
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.fillStyle = grd
    ctx.fill()
    ctx.closePath()
  }
  move(ctx) {
    let x = Math.round(Math.random() * 2)
    let y = Math.round(Math.random() * 2)
    this.x = this.directionX ? this.x + x : this.x - x
    this.y = this.directionX ? this.y + y : this.y - y
    if (this.x < 0) this.x = this.width
    if (this.x > this.width) this.x = 0
    if (this.y < 0) this.y = this.height
    if (this.y > this.height) this.y = 0
    ctx.beginPath()
    let grd = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.r
    )
    grd.addColorStop(0, `rgba(255,255,255,${this.opcity})`)
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.fillStyle = grd
    ctx.fill()
    ctx.closePath()
  }
}
// 流星
class Meteor {
  constructor(width, height) {
    this.width = 140
    this.height = 140
    this.pWidth = width
    this.pHeight = height
    this.opcity = Math.random().toFixed(2)
    this.x = Math.round(Math.random() * this.pWidth) + this.width
    this.y = -Math.round(Math.random() * 5) * this.height
  }
  draw(ctx) {
    ctx.beginPath()
    ctx.globalAlpha = this.opcity
    ctx.drawImage(meteorImg, this.x, this.y, this.width, this.height)
    ctx.closePath()
  }
  move(ctx) {
    this.x = this.x - 5
    this.y = this.y + 5
    if (this.x < -140 || this.y > this.pHeight + 140) {
      this.opcity = Math.random().toFixed(2)
      this.x = Math.round(Math.random() * this.pWidth) + this.width
      this.y = -this.height
    }
    ctx.beginPath()
    ctx.globalAlpha = this.opcity
    ctx.drawImage(meteorImg, this.x, this.y, this.width, this.height)
    ctx.closePath()
  }
}

export default {
  data() {
    return {
      ctx: null, // canvas上下文
      stars: [], // 所有星星
      meteors: [], // 所有流星
      width: null, // canvas宽度
      height: null // canvas高度
    }
  },
  mounted() {
    this.width = this.$refs.canvas.width = this.$refs.canvas.offsetWidth
    this.height = this.$refs.canvas.height = this.$refs.canvas.offsetHeight - 75
    this.ctx = this.$refs.canvas.getContext('2d')
    this.createStars()
    this.createMeteors()
    setInterval(() => {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.moveStars()
      this.moveMeteors()
    }, 40)
  },
  methods: {
    // 创建星星[默认40个]
    createStars(num = 40) {
      for (let i = 0; i < num; i++) {
        let star = new Star(this.width, this.height)
        star.draw(this.ctx)
        this.stars.push(star)
      }
    },
    // 移动星星
    moveStars() {
      this.stars.forEach(item => {
        item.move(this.ctx)
      })
    },
    // 创建流星[默认5个]
    createMeteors(num = 1) {
      for (let i = 0; i < num; i++) {
        let meteor = new Meteor(this.width, this.height)
        meteor.draw(this.ctx)
        this.meteors.push(meteor)
      }
    },
    // 移动流星
    moveMeteors() {
      this.meteors.forEach(item => {
        item.move(this.ctx)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.meteor-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
