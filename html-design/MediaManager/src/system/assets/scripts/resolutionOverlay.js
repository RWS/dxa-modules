//Image Resolution/Dimensions overlay - shows on each image on the page within the main content area, as well
//  as the pop-up/overlay images in the gallery the actual resolution of the image being displayed
//  this is so that you do not have to inspect element to show the resolution of an image. *@
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

    var ShowResolution = function ($elem, text, offset, $imgResolution) {
        var pos = $elem.offset();
        $imgResolution.text(text)
            .css({
                top: (pos.top + $elem.outerHeight() - $imgResolution.outerHeight() - offset) + "px",
                left: (pos.left + $elem.outerWidth() - $imgResolution.outerWidth()) + "px"
            }).show();
    };

    var ShowImgResolution = function (img, offset, $imgResolution) {
        ShowResolution($(img), img.naturalWidth + "x" + img.naturalHeight, offset, $imgResolution);
    };

    var ShowVideoResolution = function (video, offset, $imgResolution) {
        var $video = $(video);
        ShowResolution($video, $video.attr("data-resolution"), offset, $imgResolution);
    };

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

    var imgResolutionVisible = function () {
        return $imgResolution.is(":visible");
    };

    $("body").append($imgResolution)
        .on('mouseenter', 'main img', function () {
            onHover(this, 0, ShowImgResolution);
        })
        .on('mouseenter', 'main video', function () {
            onHover(this, 0, ShowVideoResolution);
        })
        .on('mouseleave', 'main img, main video', hideImgResolutionIfVisible);
});