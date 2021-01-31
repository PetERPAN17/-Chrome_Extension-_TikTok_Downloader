var allLinks = [];
var visibleLinks = [];

function excuteDownload(filename) {
  chrome.downloads.download({
    url: visibleLinks[0],
    filename: filename + '.mp4'
  });
}

// getRequest From send_links.js
chrome.extension.onRequest.addListener(function(sendData) {
  var src = sendData['src'];
  for (var index in src) {
    allLinks.push(src[index]);
  }
  allLinks.sort();
  visibleLinks = allLinks;

  var filename = sendData['filename'];

  excuteDownload(filename);
  window.close();
});

// Excute This Extension
window.onload = function() {
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
        chrome.tabs.executeScript(
          activeTabs[0].id, {file: 'send_info.js', allFrames: true});
    });
  });
};
