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
    type: 'list',
    title: 'TransIt V1.6.3 更新记录',
    message: '',
    iconUrl: 'img/icon48.png',
    items: [
      {
        title: '',
        message: '修复百度和必应翻译失效的问题'
      }
    ]
  }, function () {});
};

module.exports = app;
