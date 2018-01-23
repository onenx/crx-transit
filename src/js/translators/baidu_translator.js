/**
 * 使用百度翻译 API 提供翻译功能
 *
 * http://fanyi-api.baidu.com/api/trans/product/apidoc
 */

import $ from 'jquery';
import utils from '../lib/utils';
import _ from 'lodash';
import settings from '../config/settings';
import md5 from 'md5';

const API_URL = 'http://fanyi.baidu.com/basetrans';

function formatResult(result) {
  if (!result) return null;

  var response = {};

  if (!_.isEmpty(result.dict_result)) {
    try {
      var symbols = result.dict_result.simple_means.symbols[0];

      if (symbols.ph_am) {
        response.phonetic = `[${symbols.ph_am}]`;
      }

      response.translation = symbols.parts.map(function (part) {
        return `${part.part} ${part.means.join('; ')}`;
      }).join('<br/>');
    } catch (e) {
      return null;
    }
  } else {
    console.log(result);
    var trans_result = result.trans_result.data[0];
    if (trans_result.src == trans_result.dst) return null;
    response.translation = trans_result.dst;
  }

  return response;
}

function generateSign (text, salt) {
  const source = `${settings.BAIDU_APP_ID}${text}${salt}${settings.BAIDU_APP_SECRET}`;
  return md5(source);
}

function requestText(text, callback) {
  fetch(API_URL, {
    method: 'POST',
    body: $.param({ from: 'en', to: 'en', 'query': text }),
    mode: 'cors',
  }).then(response => console.log(response))
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
