(() => {
  let defining = {
    // 判断音频格式类型
    judgeAudioFormat: function (type) {
      // /text+/.test(file.type) 判断是否是text格式
      const typeList = {
        "": false,
        'audio/flac': true,
        'audio/mp3': true,
        'audio/mpeg': true,
        'text/plain': false
      }
      return typeList[type]
    },
    queryFileName(url) {
      const regx = '[^/]+(?!.*/)';
      let target = url.match(regx)[0]
      return target
    },
    c: function () {
      console.log('我是c');
    }
};

Object.keys(defining).forEach(key => {
  window[key] = defining[key];
  });
})(); 