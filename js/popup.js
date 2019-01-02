

(function () {
    ready(function () {
        //console.log(Webcam);
        document.querySelector("#show_options").onclick = show_options;
    });
    var show_options = function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    };
})();