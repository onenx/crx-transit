/**
 * 百度翻译的 API 支持
 *
 * http://dwz.cn/bau5M
 * 
 * jshint strict:true
 */
var sugar = require('sugar');
var $ = require('jquery');
var utils = require('../lib/utils');
var _ = require('lodash');

var PHRASE_URL = 'http://fanyi.baidu.com/v2transapi';

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
    var trans_result = result.trans_result.data[0];
    if (trans_result.src == trans_result.dst) return null;
    response.translation = trans_result.dst;
  }

  return response;
}

function requestText(text, callback) {
  var payload = {
    from: 'en',
    to: 'zh',
    query: text,
    transtype: 'translang',
    simple_means_flag: 3
  };

  var request = $.post(PHRASE_URL, payload);
  request.done(function(result) {
    callback(formatResult(result));
  });

  request.fail(function() {
    // TODO: Raise Error instead
    callback(null);
  });
}

var BaiduTranslator = { name: 'baidu' };

BaiduTranslator.translate = function(text, callback) {
  if (/^\s*$/.test(text)) {
    callback(null);
  } else {
    requestText(text, callback);
  }
};

module.exports = BaiduTranslator;