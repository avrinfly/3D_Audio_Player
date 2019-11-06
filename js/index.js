/*
 * @Description: 
 * @Author: hetengfei
 * @Github: https://github.com/avrinfly
 * @Date: 2019-11-06 21:55:14
 * @LastEditors: hetengfei
 * @LastEditTime: 2019-11-06 22:11:06
 */
/*
 * 3D音乐播放器
 * revision 0.0.1
 * Nov 5,2019 Avrinfly
*/
let Config = function() {
  this.appName = 'HTML 3D Audio Spectrum Visualizer'; // 播放信息
  this.url = ''; // 音乐路径
  this.playInfo = document.getElementById('playInfo'); //播放信息
  this.playerMainBody = document.getElementById('playerMainBody'); //播放器主体
}

Config.prototype = {
    //初始化操作 准备音频和场景
    init() {
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        // 只有Firefox支持mozAnimationStartTime属性,其他浏览器可以使用Date.now()来替代
        window.cancelAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext
    },
}