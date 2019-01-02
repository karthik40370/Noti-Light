
(function () {
    var lighted = false;
    var show_notification = function (site, count) {
        chrome.notifications.create("", {
            type: "basic",
            iconUrl: "icons/" + site + ".png",
            title: "Lightification from " + site,
            message: count + " unread notifications from " + site,
            buttons: [
                {
                    title: "Clear"
                }
            ],
            isClickable: true
        }, function (id) {

        });
    };
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.type == "notification") {
            show_notification(message.site, message.count);
            sendResponse("Nananananotified!");
        }
        if (message.type == "light") {
            var i = 0;
            if(lighted){
                i = 0;
            }
            if (!lighted) {
                lighted = true;
                if (!message.duration_per_blip) {
                    message.duration_per_blip = 400;
                }
                if (!message.number_of_blips) {
                    message.number_of_blips = 5;
                }
                var clr = setInterval(function () {
                    navigator.webkitGetUserMedia({video: true}, function (stream) {
                            s = stream;
                            setTimeout(function () {
                                s.getTracks()[0].stop();
                            }, message.duration_per_blip/2);
                        }, function (err) {
                        }
                    );
                    console.log("Lightification Blip " + (i / 2) + "!");
                    i++;

                    if (i >= message.number_of_blips) {
                        clearInterval(clr);
                        lighted = false;
                        sendResponse("Blipped!");
                    }
                }, message.duration_per_blip);
            }
        }
    });
})();
