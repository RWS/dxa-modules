//Image Resolution/Dimentions overlay - shows on each image on the page within the main content area, as well
//  as the pop-up/overlay images in the gallery the actual resolution of the image being displayed
//  this is so that you do not have to inspect element to show the resolution of an image. *@
function ShowResolution(img, offset, $imgResolution) {
    var pos = $(img).offset();
    $imgResolution.text(img.naturalWidth + "x" + img.naturalHeight)
        .css({
            top: (pos.top + $(img).outerHeight() - $imgResolution.outerHeight() - offset) + "px",
            left: (pos.left + $(img).outerWidth() - $imgResolution.outerWidth()) + "px"
        }).show();
}

function ShowVideoResolution(container, offset, $imgResolution) {
    var pos = $(container).offset();
    $imgResolution.text($(container).attr("data-resolution"))
        .css({
            top: (pos.top + $(container).outerHeight() - $imgResolution.outerHeight() - offset) + "px",
            left: (pos.left + $(container).outerWidth() - $imgResolution.outerWidth()) + "px"
        }).show();
}

$(function () {
    var $imgResolution = $('<div id="imgResolution"></div>').css({
        display: 'none',
        position: 'absolute',
        'z-index': 2043,
        padding: '1px 2px 0px 2px',
        border: '1px solid #999',
        'background-color': 'white',
        filter: 'alpha(opacity=80)',
        '-moz-opacity': 0.8,
        '-khtml-opacity': 0.8,
        opacity: 0.5,
        'text-shadow': '1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff'
    });

    var hideImgResolutionIfVisible = function () {
        if (imgResolutionVisible()) {
            $imgResolution.hide();
        }
    };

    var onHover = function (_this, offset, callback) {
        if (!imgResolutionVisible()) {
            callback(_this, offset, $imgResolution);
        }
    };

    $("body").append($imgResolution).bind("DOMSubtreeModified", function () {
        $("img.mfp-img").mouseenter(function () {
            onHover(this, 40, ShowResolution);
        });
        $("video").mouseenter(function () {
            onHover(this, 35, ShowVideoResolution);
        });
        $("video, img").mouseout(hideImgResolutionIfVisible);
    });

    var imgResolutionVisible = function () {
        $imgResolution.is(":visible");
    };

    $("main img").mouseenter(function () {
        onHover(this, 0, ShowResolution);
    });
    $("main video").mouseenter(function () {
        onHover(this, 0, ShowVideoResolution);
    });
    $("main video, main img").mouseout(hideImgResolutionIfVisible);
});