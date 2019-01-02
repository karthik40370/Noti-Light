
(function () {
    var observerConfig = {
        childList: true,
        subtree: true
    };

    var lighted = false;
    var count = 0;
    ready(function () {
        var cl = document.createElement("div");
        cl.id = "lightification_element";
        cl.style["width"] = "320px";
        cl.style["height"] = "240px";
        cl.style["display"] = "none";
        document.querySelector("body").appendChild(cl);

        var pattern = /\(([0-9]+)\)/;
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                Array.prototype.slice.call(mutation.addedNodes).forEach(function (addedNode) {
                    var match = addedNode.textContent.match(pattern);

                    if (match) {
                        var new_count = match[1];
                        watch_count(new_count, function (count, changed) {
                            if(changed){
                                if (count > 0) {
                                    blip_light_and_show_notification(count);
                                }
                            }
                        });
                    }
                });
            });
        });

        var targetNode = document.querySelector("head > title");
        observer.observe(targetNode, observerConfig);
    });

    var blip_light_and_show_notification = function (notif_count, duration_per_blip, number_of_blips) {
        var i = 0;
        if (!lighted) {
            //lighted = true;
            //if (!duration_per_blip) {
            //    duration_per_blip = 100;
            //}
            //if (!number_of_blips) {
            //    number_of_blips = 5;
            //}
            //var clr = setInterval(function () {
            //    if (i % 2 == 0) {
            //        Webcam.attach("#lightification_element");
            //        console.log("Lightification Blip " + (i / 2) + "!");
            //    }
            //    else {
            //        Webcam.reset();
            //    }
            //    i++;
            //
            //    if (i >= 2 * number_of_blips) {
            //        clearInterval(clr);
            //        lighted = false;
            //    }
            //}, duration_per_blip * number_of_blips);

            chrome.runtime.sendMessage({
                count: notif_count,
                duration: duration_per_blip,
                blips: number_of_blips,
                type: "light"
            }, function (response) {
                console.log(response);
            });

            chrome.runtime.sendMessage({
                site: getDomainName(window.location.host),
                count: notif_count,
                type: "notification"
            }, function (response) {
                console.log(response);
            });
        }


        //Webcam.on('error', function (err) {
        //    //user probably disabled it
        //    console.log("Error: " + err);
        //    clearInterval(clr);
        //});
    };

    var watch_count = function (new_count,callback) {
        setTimeout(function () {
            if (count == new_count) {
                //console.log("The value hasn't changed.");
                callback(null,false);
            } else if (count > new_count) {
                //console.log("The value has decreased."+count+" "+new_count);
                count = new_count;
                callback(null,false);
            }
            else if (count < new_count) {
                //console.log("The value has increased."+count+" "+new_count);
                count = new_count;
                callback(count,true);
            }
        }, 1000);
    };

})();