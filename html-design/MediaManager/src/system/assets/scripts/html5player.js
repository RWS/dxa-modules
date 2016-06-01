var SDL;
(function (SDL) {
    var MediaDelivery;
    (function (MediaDelivery) {
        var Html5PlayerOptions = (function () {
            function Html5PlayerOptions() {
            }
            return Html5PlayerOptions;
        })();
        MediaDelivery.Html5PlayerOptions = Html5PlayerOptions;
        var Quality = (function () {
            function Quality(url, resolution, resolutionData) {
                this.url = url;
                this.resolution = resolution;
                this.resolutionData = resolutionData;
            }
            return Quality;
        })();
        MediaDelivery.Html5Player = (function () {
            function Html5Player(container, options) {
                this.container = container;
                this.options = options;
            }
            Html5Player.prototype.render = function () {
                var _this = this;
                $.ajax(this.options.url, {
                    async: true,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        _this.renderView(response, _this.container);
                    }                    
                });
            };
            Html5Player.prototype.renderView = function (distribution, container) {
                var _this = this;
                if (distribution != null) {
                    // Only the first asset in the first asset container gets displayed.
                    if (distribution.assetContainers.length > 0) {
                        var assetContainer = distribution.assetContainers[0];
                        if (assetContainer.assets != null && assetContainer.assets.length > 0) {
                            var id = distribution.id;
                            var asset = distribution.assetContainers[0].assets[0];  
                            var qualities = [];                                
                            asset.renditionGroups.forEach(function (renditionGroup) {
                                var resolution;                                
                                switch (renditionGroup.name) {                                  
                                    case 'MobileLo - Source':
                                        resolution = 240;                                       
                                        break;
                                    case 'MobileHi - Source':
                                        resolution = 360;
                                        break;
                                    case 'Web - Source':
                                        resolution = 480;
                                        break;
                                    case 'HD720 - Source':
                                        resolution = 720;
                                        break;
                                    case 'HD1080 - Source':
                                        resolution = 1080;
                                        break;
                                    default:
                                        break;
                                }
                                renditionGroup.renditions.forEach(function (rendition) {
                                    if (rendition.url != null) {
                                        qualities.push(new Quality(rendition.url, resolution, rendition.name));
                                    }
                                });
                            });
                            if(qualities.length == 0) return;
                            qualities.sort(function(a,b) {return (a.resolution < b.resolution) ? 1 : ((b.resolution < a.resolution) ? -1 : 0);});
                            qualities.sort(function(a,b) {
                                // prefer mp4 formats
                                var t0 = a.url.indexOf(".mp4") != -1;
                                var t1 = b.url.indexOf(".mp4") != -1;
                                return (t0 == t1) ? 0 : ((t0 && !t1) ? -1 : 1);                               
                            });
                            var quality = null;
                            for(var i=0; i<qualities.length; i++) {
                                if(qualities[i].resolution <= this.options.quality) {
                                    quality = qualities[i];
                                    break;
                                }
                            }
                            quality = quality==null ? qualities[0] : quality;                          
                            var video = document.createElement("video");
                            video.setAttribute("crossorigin", "anonymous");
                            video.id = id;
                            video.controls = this.options.controls;                          
                            video.autoplay = this.options.autoplay;
                            video.style.width = "100%";
                            video.style.height = "100%";
                            // Add the source
                            var resolutionAttribute = "data-resolution";
                            var source = document.createElement("source");
                            source.type = quality.url.indexOf(".webm") != -1 ? "video/webm" : "video/mp4";
							source.src = quality.url;
                            video.setAttribute(resolutionAttribute, quality.resolutionData);
                            video.appendChild(source);
                            // Add the subtitles
                            if (asset.enrichments.subtitles != null) {
                                if (this.options.subtitles) {
                                    asset.enrichments.subtitles.forEach(function (subtitle) {
                                        var subtitleTrack = document.createElement("track");
                                        subtitleTrack.kind = "subtitles";
                                        subtitleTrack.src = subtitle.webVideotextTrackUrl;
                                        subtitleTrack.srclang = subtitle.cultureName.toLowerCase();
                                        subtitleTrack.label = subtitle.cultureName;
                                        if (/firefox/i.test(navigator.userAgent)) {
                                            subtitleTrack.addEventListener("load", function () {
                                                video.textTracks[0].mode = "showing"; // thanks Firefox
                                            });
                                        }
                                        video.appendChild(subtitleTrack);
                                    });
                                }
                            }
                            container.appendChild(video);
                        }
                    }
                }
            };
            return Html5Player;
        })();       
    })(MediaDelivery = SDL.MediaDelivery || (SDL.MediaDelivery = {}));
})(SDL || (SDL = {}));
(function ($) {
    sdlmediaHtml5Player = function (options) {
        var $container = options.selector;
        var html5PlayerOptions = new SDL.MediaDelivery.Html5PlayerOptions();
        html5PlayerOptions.url = options.url;
        html5PlayerOptions.subtitles = options.subtitles;
        html5PlayerOptions.autoplay = options.autoplay;
        html5PlayerOptions.quality = options.quality;
        html5PlayerOptions.controls = options.controls;
        var html5Player = new SDL.MediaDelivery.Html5Player($container.get(0), html5PlayerOptions);
        html5Player.render();
    };
    $(document).ready(function () {        
        $("div[id|='video']").each(function (index, value) {       
            sdlmediaHtml5Player({ 
                selector: $(this), 
                url: $(this).data('mm-url'), // MM Json distribution data url
                quality: $(this).data("mm-quality"), // 240,360,480,720,1080
                subtitles: $(this).data("mm-subtitles"), // true/false
                autoplay: $(this).data("mm-autoplay"), // true/false
                controls: $(this).data("mm-controls")}); // true/false           
        });    
    });
}(jQuery));