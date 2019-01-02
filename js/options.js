
ready(function () {
    navigator.webkitGetUserMedia({video:true},function(stream){stream.stop();},function(err){});
});