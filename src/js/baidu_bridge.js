(function() {
  let retries = 0;

  function getTranslation (callback) {
    retries += 1;

    const result = document.querySelector('#transOtherResutl');
    if (result) {
      callback(result.innerHTML);
    } else if (retries <= 10) {
      setTimeout(function() {
        getTranslation(callback);
      }, 200);
    } else {
      callback(null);
    }
  }

  function receiveMessage (e) {
    console.log('message from bg', e);
    const message = e.data;
    if (message.source == 'transit') {
      getTranslation (function (result) {
        e.source.postMessage({
          source: 'baidu_bridge',
          token: message.token,
          result: result
        }, '*');
      });
    }
  }
  
  window.addEventListener('message', receiveMessage);
})();