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
  this.render; // 渲染器
  this.orbitControls; // 轨道控制器
  this.clock;
  this.controls;
}

Config.prototype = {
  // 初始化操作 准备音频和场景
  init() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    // 只有Firefox支持mozAnimationStartTime属性,其他浏览器可以使用Date.now()来替代
    window.cancelAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext
    // 准备音频
    // 准备场景
    this.__initScene__();
  },

  __initScene__() {
    let __that__ = this;
    WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    MTHICKNESS = __that__.MTHICKNESS;
    PWIDTH = __that__.PWIDTH;
    DISTANCE = __that__.DISTANCE;
    COLUMNNUMBER = __that__.COLUMNNUMBER;

    scene = new THREE.Scene(); //创建场景
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000); //创建相机
    // 相机配置
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 100;
    camera.lookAt(scene.position);

    render = new THREE.WebGLRenderer({
      antialias: true
    });// 创建渲染器
    render.setSize(WIDTH, HEIGHT); // 设置渲染器的尺寸
    render.setClearColor(0x212121); // 设置渲染器的透明颜色
    render.shadowMapEnabled = true; //设置在场景中使用阴影贴图
    render.shadowMapAutoUpdate = true; //设置场景中的阴影贴图自动更新

    // 创建平面几何(plane) --> 地面
    planeGeometry = new THREE.PlaneGeometry(500, 500, 32);
    planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide
    });
    planeMaterial = new THREE.MeshPhongMaterial({
      color: 0x222222,
      // color: 0x228B22,
      ambient: 0x555555,
      specular: 0xdddddd,
      shininess: 5,
      reflectivity: 2
    });

    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    // 添加轨道控制器
    orbitControls = new THREE.OrbitControls(camera);
    orbitControls.minDistance = 50;
    orbitControls.maxDistance = 200;
    orbitControls.maxPolarAngle = 1.5;
    orbitControls.noPan = true;
    clock = new THREE.Clock();

    //创建柱子形状
    let columnShape = new THREE.CubeGeometry(PWIDTH, 1, MTHICKNESS);
    //设置柱子材质
    let columnMaterial = new THREE.MeshPhongMaterial({
      color: 0x01FF00,
      specular: 0x01FF00,
      ambient: 0x01FF00,
      shininess: 20,
      reflectivity: 5.5
    });

    //创建白色盖子
    let coverShape = new THREE.CubeGeometry(PWIDTH, .7, MTHICKNESS);
    //设置盖子的材质
    let coverMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      specular: 0xFFFFFF,
      ambient: 0xFFFFFF,
      shininess: 20,
      reflectivity: 5.5
    })
    
    //将单个柱子和单个盖子组合为一个模型
    for (let index = COLUMNNUMBER - 1; index >= 0; index--) {
      //柱子合并
      let column = new THREE.Mesh(columnShape, columnMaterial);
      column.position.x = -45 + (PWIDTH + DISTANCE) * index;
      column.position.y = -1;
      column.position.z = 0.5;
      column.castShadow = true;
      scene.add(column); //柱子添加到场景中

      //盖子合并
      let cover = new THREE.Mesh(coverShape, coverMaterial);
      cover.position.x = -45 + (PWIDTH + DISTANCE) * index;
      cover.position.y = 0;
      cover.position.z = 0.5;
      cover.castShadow = true;
      scene.add(cover); //盖子添加到场景中
    }

    // 点光源
    let spotLight = new THREE.SpotLight(0xffffff);
    // 软白光
    let ambientLight = new THREE.AmbientLight(0x0c0c0c);
    
    spotLight.position.set(0, 60, 60);
    scene.add(spotLight) // 添加到场景中
    scene.add(ambientLight) // 添加到场景中

    // 定向光
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.castShadow = true;
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    playerMainBody.appendChild(render.domElement); //将渲染器添加到播放器主体里

    render.render(scene, camera);

    __that__.scene = scene;
    __that__.render = render;
    __that__.camera = camera;
    __that__.clock = clock;
    __that__.orbitControls = orbitControls;

    // 配置轨道控制器
    __that__.__initAnimation(scene, render, camera)
  },

  __initAnimation(scene, render, camera, analyser) {
    // 轨道控制器
    let __that__ = this;
    COLUMNNUMBER = __that__.COLUMNNUMBER;
    clock = __that__.clock;
    controls = __that__.controls;
    orbitControls = __that__.orbitControls;
    let renderAnimation = () => {
      // 配置轨道控制器
      let delta = clock.getDelta();
      orbitControls.update(delta);
      render.render(scene, camera);
      __that__.animationId = requestAnimationFrame(renderAnimation);
    };
    __that__.animationId = requestAnimationFrame(renderAnimation);
  }
}



window.onload = function () {
  let config = new Config();
  config.init();
}