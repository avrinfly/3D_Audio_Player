/*
 * @Description: 
 * @Author: hetengfei
 * @Github: https://github.com/avrinfly
 * @Date: 2019-11-06 21:55:14
 * @LastEditors: hetengfei
 * @LastEditTime: 2019-11-08 23:38:35
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
  this.DISTANCE = 1; //柱子间的间隔（米）
  this.PWIDTH = 2; //每个柱子的宽度
  this.MTHICKNESS = 1; //柱子厚度
  this.COLUMNNUMBER = Math.round(100 / (this.PWIDTH + this.DISTANCE));//柱子数量
  this.scene; // 场景
  this.camera; // 相机
  this.render; // 
  this.orbitControls; // 轨道控制器
  this.clock;
  this.controls;
}

Config.prototype = {
  //初始化操作 准备音频和场景
  init() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    // 只有Firefox支持mozAnimationStartTime属性,其他浏览器可以使用Date.now()来替代
    window.cancelAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext
    // 准备音频
    //准备场景
    this.__initScene__();
  },

  __initScene__() {
    let __that__ = this;
    WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    DISTANCE = 1; //柱子间的间隔（米）
    PWIDTH = 2; //每个柱子的宽度 

    scene = new THREE.Scene(); //创建场景
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000); //创建相机
    scene.add(camera); //将相机添加到场景中
    render = new THREE.WebGLRenderer();// 创建渲染器
    render.setSize(WIDTH, HEIGHT); // 设置渲染器的尺寸
    __that__.playerMainBody.appendChild(render.domElement); //将渲染器添加到播放器主体里
  }
}

window.onload = function () {
  let config = new Config();
  config.init();
}