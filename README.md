<!--
 * @Description: 
 * @Author: hetengfei
 * @Github: https://github.com/avrinfly
 * @Date: 2019-11-06 22:00:48
 * @LastEditors: hetengfei
 * @LastEditTime: 2019-11-08 23:32:00
 -->
# 3D Audio player
3D音乐播放器

> three.js
> webGL

a 3d audio player built with three.js

## 步骤：

- config配置文件
- 初始化 init函数 初始化内容包括 AudioContext、cancelAnimationFrame、requestAnimationFrame三个window对象自带的和音频处理相关的API，都是HTML5新增的
- 创建场景---包括scene、camera和render（场景、相机和渲染器）