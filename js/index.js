/*
 * @Description: 
 * @Author: hetengfei
 * @Github: https://github.com/avrinfly
 * @Date: 2019-11-06 21:55:14
 * @LastEditors: hetengfei
 * @LastEditTime: 2020-04-11 23:56:00
 */
/*
 * 3D音乐播放器
 * revision 0.0.1
 * Nov 5,2019 Avrinfly
*/
let Config = function() {
  this.appName = 'HTML 3D Audio Spectrum Visualizer'; // 播放信息
  // this.url = 'E:/project/Music_Player_Base/material/千百顺 - 很任性.flac'; // 音乐路径 -- 不能是相对路径
  // this.url = 'E:/project/Music_Player_Base/material/高梨康治 (たかなし やすはる) - S級魔導士昇格試験.mp3';
  this.url = 'https://www.flygoing.cn/audio/高梨康治_(たかなし_やすはる)_-_S級魔導士昇格試験.mp3'
  this.playInfo = document.getElementById('playInfo'); //播放信息
  this.playerMainBody = document.getElementById('playerMainBody'); //播放器主体
  this.controlPanel = document.getElementById('controlPanel'); // 播放器控制板
  this.playDefault = document.getElementById('playDefault'); // 打开默认音频文件
  this.openFile = document.getElementById('openFile'); // 打开文件按钮
  this.audio = document.getElementById('musicDefault'); // 默认音频文件
  this.files; // 音频文件
  this.filesName = '';// 当前播放音频文件名
  this.audioContext; // 播放器
  this.DISTANCE = 1; // 柱子间的间隔（米）
  this.PWIDTH = 2; // 每个柱子的宽度
  this.MTHICKNESS = 1; // 柱子厚度
  this.COLUMNNUMBER = Math.round(100 / (this.PWIDTH + this.DISTANCE)); // 柱子数量
  this.scene; // 场景
  this.camera; // 相机
  this.render; // 渲染器
  this.orbitControls; // 轨道控制器
  this.clock;
  this.controls;
  this.loading = false; // 检测是否有正在加载中的文件，如果有，则停止加载新的文件
  this.newFileForce = false; // 被新打开文件覆盖或者当前音频文件播放结束
  this.source; // 音频文件
  this.utils; // 工具函数
}

Config.prototype = {
  // 初始化操作 准备音频和场景
  init() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    // 只有Firefox支持mozAnimationStartTime属性,其他浏览器可以使用Date.now()来替代
    window.cancelAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    // 准备音频
    try {
      this.audioContext = new AudioContext();
    }
    catch (e) {
      this.playInfo.textContent = '暂不支持音频格式的文件';
    }
    //音乐播放功能
    this.__musicPlay();
    // 准备场景
    this.__initScene__();
    // 添加轨道控制器
    // this.__control__();
    // 播放器控制板动画效果添加
    this.__controlAnimation();
  },

  __initScene__() {
    // 场景初始化
    let __that__ = this;
    WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    MTHICKNESS = __that__.MTHICKNESS;
    PWIDTH = __that__.PWIDTH;
    DISTANCE = __that__.DISTANCE;
    COLUMNNUMBER = __that__.COLUMNNUMBER;

    scene = new THREE.Scene(); //创建场景
    camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 1000); //创建相机
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
    });
    
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
    scene.add(spotLight); // 添加到场景中
    scene.add(ambientLight); // 添加到场景中

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
    __that__.__initAnimation(scene, render, camera);
  },

  __initAnimation(scene, render, camera, analyser) {
    // 轨道控制器
    let __that__ = this;
    COLUMNNUMBER = __that__.COLUMNNUMBER;
    clock = __that__.clock;
    orbitControls = __that__.orbitControls;
    let renderAnimation = () => {
      // 配置轨道控制器
      let delta = clock.getDelta();
      orbitControls.update(delta);
      render.render(scene, camera);
      __that__.animationId = requestAnimationFrame(renderAnimation);
    };
    __that__.animationId = requestAnimationFrame(renderAnimation);
  },

  __controlAnimation() {
    // 播放器控制板动画效果
    let __that__ = this;
    let panel = document.getElementById('action');
    panel.onclick = () => {
      let left = __that__.controlPanel.style.left;
      if (left === '0px' || left === '') {
        __that__.controlPanel.style.left = '-210px';
        panel.textContent = '>>';
      }
      else {
        __that__.controlPanel.style.left = '0px';
        panel.textContent = '<<';
      }
    }
  },

  __musicPlay() {
    let __that__ = this,
    pageContent = document.body,
    openBtn = __that__.openFile;
    // 音频文件上传
    openBtn.onchange = () => {
      if (!__that__.audioContext) {
        return;
      }
      // 当有文件正在上传时
      if (openBtn.files.length !== 0) {
        __that__.loading = true;
        __that__.playInfo.textContent = '音频解码加载中...';
        console.log('open file', openBtn.files[0]);
        __that__.files = openBtn.files[0]; // 音频文件
        __that__.filesName = openBtn.files[0].name; // 文件名
        console.log(openBtn.files[0].name, __that__.filesName);
        // 读取文件
        __that__.__readFile(__that__.files);

        openBtn.value = ''; // 在上传音频文件后，将上传文件中的内容清空，防止当上传同一音频文件时，onchange事件不触发
      }
    }
  },

  __readFile(file) {
    // 读取文件
    let __that__ = this,
      reader = new FileReader(); // new一个FileReader实例
    console.log(/text+/.test(file.type),file.type);
    if (!__that__.utils.judgeAudioFormat(file.type)) {
      // 判断文件类型，是不是text类型
      alert('请选择正确格式的音频文件');
      // 重置播放器状态
      __that__.playInfo.textContent = 'HTML5 3D音乐播放器';
    } else {
      reader.onload = (e) => {
        console.log('eeeeeeeeeeeee',e);
        const result = e.target.result;
        if (!result) {
          return;
        }
        // reader.readAsDataURL(file);
        __that__.__play(result); // 音乐播放功能
      }
      reader.readAsArrayBuffer(file);
      reader.onerror = (e) => {
        console.log(e);
        __that__.playInfo.textContent = '打开音频文件失败!';
      }
    }
  },

  __play(file) {
    // 核心功能->音乐播放功能
    let __that__ = this;
    __that__.playInfo.textContent = '音频解码加载中...';

    // 异步解码音频文件中的 ArrayBuffer(decodeData)
    __that__.audioContext.decodeAudioData(file).then(function(decodedData) {
      // 音频文件解码完成，数据加载完成
      __that__.playInfo.textContent = '解码成功，开始播放...';
      // https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/createBufferSource
      let AudioContext = __that__.audioContext,
        audioBufferSouceNode = AudioContext.createBufferSource(),
        analyser = AudioContext.createAnalyser();
      // 将实时分析的音频节点导入到要播放的音频文件中
      audioBufferSouceNode.connect(analyser);
      // 要播放的音频文件导入到播放器中，这样我们就能听到声音了(原话->https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/createBufferSource)
      analyser.connect(AudioContext.destination);
      // 设置播放的音频文件中的缓冲区
      audioBufferSouceNode.buffer = decodedData;

      // 在每次播放音频文件时，如果上一段音频未结束，则停止播放上一段音频
      if (__that__.source) {
        if (__that__.source != 0) {
          __that__.source.stop(0);
        }
      }
      console.log('>>>>>>>>>>>>>>>>>>',file);
      __that__.source = audioBufferSouceNode;
      audioBufferSouceNode.start(0);

      // 音频文件播放结束 重置播放器状态
      __that__.source.onended = () => {
        __that__.playInfo.textContent = 'HTML5 3D音乐播放器';
      }

      // 播放成功后 展示正在播放的音频文件名称
      setTimeout(() => {
        __that__.playInfo.textContent = '正在播放： ' + __that__.filesName;
      }, 1000);

    }, (err) => {
      // 打开文件的失败callback
      console.log(err);
      __that__.playInfo.textContent = '打开文件失败!';
    });
  },

  __musicPlayDefault(url) {
    let __that__ = this;
    // 播放默认音频文件功能
    let audio = document.getElementById('musicDefault');
    audio.src = url;
    if (audio.paused) {
      audio.play();
      setTimeout(() => {
        __that__.playInfo.textContent = '正在播放： 千百顺 - 很任性.flac';
      }, 1000);
    } else {
      audio.pause();
      audio.currentTime = 0; //音乐从头播放
    }

    audio.onended = () => {
      console.log('播放结束');
      __that__.playInfo.textContent = 'HTML5 3D音乐播放器';
    }
    
  }
}

window.onload = () => {
  let config = new Config();
  config.init();
  config.utils = window;
  config.playDefault.onclick = () => {
    config.__musicPlayDefault(config.url);
  };
  config.audio.pause();
}