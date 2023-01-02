var src = [].slice.apply(document.getElementsByTagName('video'));
src = src.map(function(element) {
  var src = element.src;
  var hashIndex = src.indexOf('#');
  if (hashIndex >= 0) {
    src = src.substr(0, hashIndex);
  }
  return src;
});

// Create video div for download
var mainContainer = window.document.querySelector(".tiktok-1h8ubbu-DivMainContent");
var videoDiv = window.document.createElement('video');
videoDiv.src = src[0];
videoDiv.style.height = '100px';
mainContainer.insertBefore(videoDiv, null);

src.sort();

// Remove duplicates and invalid URLs.
var kBadPrefix = 'javascript';
for (var i = 0; i < src.length;) {
  if (((i > 0) && (src[i] == src[i - 1])) ||
      (src[i] == '') ||
      (kBadPrefix == src[i].toLowerCase().substr(0, kBadPrefix.length))) {
    src.splice(i, 1);
  } else {
    ++i;
  }
}

// Count Year include str
var yearCounter = function(str,year){
    return str.split(year).length - 1;
}

var filename = document.querySelector('[data-e2e="browser-nickname"]');
filename = filename.innerText;
var account = document.querySelector('[data-e2e="browse-username"]');
account = account.innerText;
var videoDecriptionElements = document.querySelector('[data-e2e="browse-video-desc"]').querySelectorAll("span, strong");
videoText = '';
if (videoDecriptionElements.length !== 0) {
    for (var node of videoDecriptionElements) {
        videoText += node.innerText;
    }
}

// recombination filename
var recombFilename = function(filename,seperate_str){
    return filename.split(seperate_str);
}
var filename_arr = recombFilename(filename, '\n·\n');

var now = new Date();

// Reset Date when if can't get Date.
var download = true;
var setNewDate = false;
if(filename_arr[1].indexOf('分前') >= 0){
	var getMinusMinute = Number(filename_arr[1].replace(/分前/g, ''));
	now.setMinutes(now.getMinutes() - getMinusMinute);
	setNewDate = true;
}else if(filename_arr[1].indexOf('時間前') >= 0){
    var getMinusHour = Number(filename_arr[1].replace(/時間前/g, ''));
    now.setHours(now.getHours() - getMinusHour);
    setNewDate = true;
}else if(filename_arr[1].indexOf('日前') >= 0){
    var getMinusDate = Number(filename_arr[1].replace(/日前/g, ''));
    now.setDate(now.getDate() - getMinusDate);
    setNewDate = true;
}else if(filename_arr[1].indexOf('週間前') >= 0){
    now.setDate(now.getDate() - 7);
    setNewDate = true;
};
if(setNewDate){
    filename_arr[1] = (now.getMonth() + 1) + '-' + now.getDate();
};

// check filename
function checkFilename(filename){
    // var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    var special_pattern = /[~!;:?🧏🏼‍♀️‪‪☺︎‬*"\/]/gi;
    if( special_pattern.test(filename) == true ){
        // filename = str.replace(/[`~!@#$%^&*|\\\'\";:\/?]/gi, '');
        filename = filename.replace(special_pattern, '');
    };
    return filename;
};

if(download){
    var NowYear = now.getFullYear();
    for (var i = 1; i <= 5; i++) {
        var year = null;
        if(yearCounter(filename_arr[1], NowYear - i) === 1){
          year = NowYear - i;
          filename = filename_arr[1] + '_' + account + '_' + filename_arr[0] + '_' + videoText;
          break;
        }
        year = NowYear;
        filename = NowYear + '-' + filename_arr[1] + '_' + account + '_' + filename_arr[0] + '_' + videoText;
    }

    filename = checkFilename(filename);
    console.log(filename);

    var sendData = {
        src : src,
        filename : filename
    };

    chrome.extension.sendRequest(sendData);
};
