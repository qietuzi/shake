/* 
    @name       Shake
    @desc       摇一摇
    @params     
        options: {
            vibrate: boolean    是否开启震动
        }
*/

class Shake {
  constructor(options) {
    this._last = {} // 前一次摇动的加速度
    this._timeout = 1000 // 摇一摇时间间隔
    this._lasTime = null // 最后一次摇动时间
    this._callback = null // 摇一摇事件回调函数
    this._vibrates = options.vibrates
    this._isSupport = !!window.DeviceMotionEvent
  }

  // 是否支持摇一摇
  _isSupport = true

  // 摇一摇处理函数
  _handler(event) {
    let current = event.accelerationIncludingGravity
    // 部分手机关闭了摇一摇权限功能
    if (!current.x && !current.y && !current.z) {
      this._isSupport = false
      return
    }

    // 只统计100ms 内的加速度改变量
    let currentTime = new Date().getTime()
    let disTime = currentTime - this._lastTime
    if (disTime > 100) {
      // 更新 _lastTime
      this._lastTime = currentTime

      //记录上一次设备在x,y,z方向上的加速度
      if (!this._last.x && !this._last.y && !this._last.z) {
        this._last = {
          x: current.x,
          y: current.y,
          z: current.z
        }
        return false
      }

      //得到两次移动各个方向上的加速度绝对差距
      let disX = Math.abs(this._last.x - current.x)
      let disY = Math.abs(this._last.y - current.y)
      let disZ = Math.abs(this._last.z - current.z)
      let sumSquares = disX * disX + disY * disY + disZ * disZ
      let distance = (Math.sqrt(sumSquares) / disTime) * 10000
      // 如果加速度平方和的平方根大于设定值则触发摇一摇事件
      if (distance > 6000) {
        if (navigator.vibrate) {
          navigator.vibrate(1000)
        }
        if (this._callback) this._callback()
      }

      // 更新最后一次摇动加速度
      this._last = {
        x: current.x,
        y: current.y,
        z: current.z
      }
    }
  }

  // 是否支持摇一摇
  isSupport() {
    return this._isSupport
  }

  // 开始监听摇一摇
  listen(callback) {
    this._callback = callback
    if (!this._isSupport) return
    this._lastTime = new Date().getTime()
    window.addEventListener('devicemotion', this._handler.bind(this), false)
  }

  // 销毁摇一摇
  destroy() {
    window.removeEventListener('devicemotion', this._handler)
  }
}

export default Shake
