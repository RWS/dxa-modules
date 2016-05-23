//Image Resolution/Dimentions overlay - shows on each image on the page within the main content area, as well
//  as the pop-up/overlay images in the gallery the actual resolution of the image being displayed
//  this is so that you do not have to inspect element to show the resolution of an image. *@
function ShowResolution(img, offset) {
    var pos = $(img).offset();
    $("#imgResolution").text(img.naturalWidth + "x" + img.naturalHeight);
    $("#imgResolution").css({
        top: (pos.top + $(img).outerHeight() - $("#imgResolution").outerHeight() - offset) + "px",
        left: (pos.left + $(img).outerWidth() - $("#imgResolution").outerWidth()) + "px"
    }).show();
}
function ShowVideoResolution(container, offset) {
    var pos = $(container).offset();
    $("#imgResolution").text($(container).attr("data-resolution"));
    $("#imgResolution").css({
        top: (pos.top + $(container).outerHeight() - $("#imgResolution").outerHeight() - offset) + "px",
        left: (pos.left + $(container).outerWidth() - $("#imgResolution").outerWidth()) + "px"
    }).show();
}
$(document).ready(function () {
    $("body").append("<div id=\"imgResolution\" style=\"display: none; position: absolute; z-index: 2043; padding: 1px 2px 0px 2px; border: 1px solid #999; background-color: white; filter: alpha(opacity=80); -moz-opacity: 0.8; -khtml-opacity: 0.8; opacity: 0.5; text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;\"></div>");
    $("main img").mouseenter(function (e) {
        if (!$("#imgResolution").is(":visible"))
            ShowResolution(this, 0);
    });
    $("main video").mouseenter(function (e) {
        if (!$("#imgResolution").is(":visible"))
            ShowVideoResolution(this, 0);
    });
    $("main video,main img").mouseout(function (e) {
        if ($("#imgResolution").is(":visible"))
            $("#imgResolution").hide();
    });
    $("body").bind("DOMSubtreeModified", function () {
        $("img.mfp-img").mouseenter(function (e) {
            if (!$("#imgResolution").is(":visible"))
                ShowResolution(this, 40);
        });
        $("video").mouseenter(function (e) {
            if (!$("#imgResolution").is(":visible"))
                ShowVideoResolution(this, 35);
        });
        $("video, img").mouseout(function (e) {
            if ($("#imgResolution").is(":visible"))
                $("#imgResolution").hide();
        });
    });
});
