;(function() {
  var pageWidth = 750
  var screenWidth = window.screen.width
  var scale = screenWidth / pageWidth
  if (screenWidth > 750) scale = 1
  var meta =
    '<meta name="viewport" content="width=750' +
    ', initial-scale=' +
    scale +
    ', minimum-scale=' +
    scale +
    ', maximum-scale=' +
    scale +
    ', user-scalable=no">'
  document.write(meta)
})()

// 这里的微信签名只是为了ios能顺利播放提示音
window.onload = function() {
  wx.config({})
  wx.ready(function() {
    var circleAudio = document.querySelector('#circleAudio')
    if (circleAudio) {
      circleAudio.play()
      circleAudio.pause()
    }
  })
}
