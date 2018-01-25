import app from '../lib/crxkit';

app.setup({
  name: 'transit',
  options: {
    notifyTimeout: 5,     // 页面划词结果显示时间
    pageInspect: true,    // 是否启用页面划词
    linkInspect: true,    // 是否启用链接划词
    pushItem: false,      // 是否推送单词到服务端,
    notifyMode: 'margin', // 结果默认显示在右上角
    translator: 'youdao', // 默认的翻译服务
  }
});

app.showUpdateNotes = function() {
  chrome.notifications.create({
    type: 'basic',
    title: 'TransIt V1.6.5 更新记录',
    message: '- 解决升级依赖导致的脚本错误',
    iconUrl: 'img/icon48.png'
  }, function () {});
};

module.exports = app;
