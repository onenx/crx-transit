/*
 * TransIt Event
 * 
 * jshint strict: true
 */

import cuid from 'cuid';
import translators from './translators';
import app from './config/application';

// Key name to store current text in local storage
const CURRENT_TEXT_KEY = 'transit_current_text';

// Setter / Getter for current text
// 
// If text if passed, update `current_text` in local storage,
// otherwise, read from local storage.
function currentText(text) {
  if (text) {
    localStorage.setItem(CURRENT_TEXT_KEY, text);
    return text;
  } else {
    return localStorage.getItem(CURRENT_TEXT_KEY);
  }
}

window.loadPage = function (url, callback) {
  chrome.tabs.executeScript(null, { code: 'document.body.setAttribute("goo", "time");' });
  const frame = document.createElement('iframe');
  frame.src = url;
  document.body.appendChild(frame);

  frame.addEventListener('load',function() {
    const token = cuid();
    frame.contentWindow.postMessage({ source: 'transit', token: token }, '*');

    window.addEventListener('message', function (e) {
      console.log('message from sub frame', e);

      const message = e.data;
      if (message.source == 'baidu_bridge' && message.token == token) {
        callback(message.result);
        window.removeEventListener.removeListener('message', arguments.callee);
      }
    });
  });
};

// Translate text and send result back
// 
// TODO: Cache translated result to speed up querying.
function translateHanlder(message, sender, sendResponse) {
  const translator = translators[app.options.translator];
  translator.translate(message.text, sendResponse);
}

// Save current selection to localStorage
function selectionHandler(message, sender, sendResponse) {
  currentText(message.text);
}

function currentTextHandler(message, sender, sendResponse) {
  sendResponse(currentText());
}

function linkInspectHandler(message, sender, sendResponse) {
  app.log(message);
  if (message.enabled) {
    chrome.browserAction.setIcon({ path: 'img/icon48-link.png' });
  } else {
    chrome.browserAction.setIcon({ path: 'img/icon48.png' });
  }
}

app.registerMessageDispatcher({
  translate: translateHanlder,
  selection: selectionHandler,
  currentText: currentTextHandler,
  linkInspect: linkInspectHandler
});

app.initOptions();

// Listen to extension update and show update notes
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == 'update') {
    app.showUpdateNotes();
  }
});
