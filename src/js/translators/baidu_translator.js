/**
 * 使用百度翻译 API 提供翻译功能
 *
 * http://fanyi-api.baidu.com/api/trans/product/apidoc
 */

import $ from 'jquery';
import _ from 'lodash';

const API_URL = 'http://fanyi.baidu.com/basetrans';
const USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

// 修改百度翻译 API 请求，将 User Agent 修改为移动设备
chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
  let header = null;

  header = _.find(details.requestHeaders, { name: 'User-Agent' });
  header.value = USER_AGENT;

  header = _.find(details.requestHeaders, { name: 'Origin' });
  header.value = 'http://fanyi.baidu.com';

  return { requestHeaders: details.requestHeaders };
}, { urls: [API_URL] }, ['blocking', 'requestHeaders']);

function formatResult(result) {
  if (!result) return null;

  const response = {};

  if (_.has(result, 'dict.symbols[0].parts')) {
    try {
      const phonetic = _.get(result, 'dict.symbols[0].ph_am');
      if (phonetic) {
        response.phonetic = `[${phonetic}]`;
      }

      const parts = _.get(result, 'dict.symbols[0].parts', []);
      response.translation = _.map(parts, (part) => `${part.part} ${part.means.join(';')}`).join('<br/>');
    } catch (e) {
      return null;
    }
  } else {
    const trans_result = _.get(result, 'trans[0]', {});
    if (trans_result.src == trans_result.dst) {
      return null;
    } else {
      response.translation = trans_result.dst;
    }
  }

  return response;
}

function requestText(text, callback) {
  let headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  fetch(API_URL, {
    method: 'POST',
    body: $.param({ from: 'en', to: 'zh', 'query': text }),
    headers: headers
  }).then(response => response.json())
    .then(result => callback(formatResult(result)))
    .catch(() => callback(null));
}

export default {
  name: 'baidu',
  translate (text, callback) {
    if (/^\s*$/.test(text)) {
      callback(null);
    } else {
      requestText(text, callback);
    }
  }
};
