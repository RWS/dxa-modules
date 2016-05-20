//This is for the media manager videos.
//  we attach to events from MM using the "MMCE_[event name]"
//  data[0] == action [Show,Hide]
//  data[1] == overlay html DIV id
//  data[2] == how [animate,slow,pause, message]
$(document).bind('MMCE_EVENT', function (e) {
    var data = e.value.split(':');
    console.log('MMCE_EVENT::' + e.value);
    switch (data[0]) {
        case ('Show'):
            var overlay = $('div#' + data[1]);  //Get the correct DIV containing the content of the current action to show
            var video = $('div.projekktor').find("video"); //Get the video DIV's actual video div (the one inside it)
            $(overlay).css({    //This is to make the overlay responsive (if the video is bigger, then it will scale (full screen)
                width: $(video).width(),
                height: $(video).height()
            });
            var pos = video.offset();
            switch (data[2]) {
                case ('animate'): //Animage the image into view...
                    $(overlay).css({
                        top: (pos.top) + "px",
                        left: (pos.left + overlay.outerWidth()) + "px",
                        opacity: 0.1
                    });
                    $(overlay).show();
                    $(overlay).animate({
                        top: (pos.top) + "px",
                        left: (pos.left) + "px",
                        opacity: 1
                      }, {
                        duration: 600,
                        specialEasing: {
                            left: "swing",
                            opacity: "swing",
                            width: "linear"
                      },
                    });
                    break;
                default : //Just show the image...
                    $(overlay).css({
                        top: pos.top + "px",
                        left: pos.left + "px"
                    });
                    $(overlay).fadeIn();
                    break;
            }
            //Pause is down here as it is an ADD ON to the action (must be shown, and then paused!)
            if (data[2] == 'pause') {
                video.find('>:last-child').trigger('pause');
                if (overlay.outerWidth() > 650) {
                    overlay.find('div#overlay_message').animate({fontSize: '3em'}, 'slow');
                }
                $(overlay).bind('click', function () {
                    video.find('>:last-child').trigger('play');
                    overlay.find('div#overlay_message').fadeOut();
                });
            }
            else if (data[2] == 'message') {
                var message = overlay.find('div#overlay_message');
                var personalized = data[3];
                var claimRaw = personalized.match(/\[.*\]/gi);
                var claim = claimRaw[0].substr(1, claimRaw[0].indexOf(']') - 1).replace(/\|/g, ':');
                
                console.log('claim:' + claim);
				 
               $.ajax({
					url: "/api/ambientdata/claims/",
					dataType: "json",
					async: false,
					method: "GET",
					success: function (data) {
						claims = data;
					},
					failure: function (data) {
						console.log("Error with request: " + data);
					},
					error: function (xhr, status, error) {
						console.log("Error:", error);
					}
				});		
				var claimValue = claims[claim];
				 console.log('claimValue: ' + claimValue);
                personalized = personalized.replace(claimRaw, claimValue);
                $(message).text(personalized);
            }
            break;
        case ('Hide'):
            var overlay = $('div#' + data[1]);
            $(overlay).fadeOut('slow');
            break;
    }
    console.log('MMCE_FIRE::out');
});

$(document).ready(function () {
    $("body").append('<div id="MMCE_Shout" style="display: none; position: absolute; z-index: 2147483647;"><img src="/MMCE_Assets/MMCE_Shout.png" style="width: 100%" /></div>');
    $("body").append('<div id="MMCE_SDL" style="display: none; position: absolute; z-index: 2147483647;"><div id=\"overlay_message\" style=\"text-align: center; position: absolute; top: 0px; width: 100%; padding: 1px 2px 0px 2px; border: 1px solid #999; background-color: white; filter: alpha(opacity=80); -moz-opacity: 0.8; -khtml-opacity: 0.8; opacity: 0.5; text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff; \">This is an action event which can be anyting, a form to request information, or a link to add something to the shopping cart for instace. Perform the action, then the video resumes. \n\n Please click on the logo to continue...</div><img src="/MMCE_Assets/MMCE_SDL.png" style="width: 100%" /></div>');
    $("body").append('<div id="MMCE_Personal" style="display: none; position: absolute; z-index: 2147483647;"><div id=\"overlay_message\" style=\"text-align: center; position: absolute; font-size: 2em; width: 80%; margin: 10% 10%; color: white; font-weight: bold;\"></div><img src="/MMCE_Assets/MMCE_Personal.png" style="width: 100%" /></div>');
    $("body").append('<div id="MMCE_Future" style="display: none; position: absolute; z-index: 2147483647;"><img src="/MMCE_Assets/MMCE_Future.png" style="width: 100%" /></div>');
});
