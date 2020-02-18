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
1. config配置文件
2. 初始化 init函数 初始化内容包括 AudioContext、cancelAnimationFrame、requestAnimationFrame 三个window自带和音频处理相关的对象 都是HTML5新增的
3. 创建场景---包括scene、camera和render（场景、相机和渲染器）并添加三要素的相应设置
4. 添加播放器主体的柱子和盖子
5. 实现一个柱子
6. 实现整个播放器的柱子
7. 实现柱子上的白色盖子
8. 添加光源（定向光、聚光灯）
8. 添加plane
9. 添加轨道控制器