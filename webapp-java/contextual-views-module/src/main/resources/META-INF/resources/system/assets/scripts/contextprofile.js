$(document).ready(function() {
    $("<div class='xpm-button context-profile-button' data-enabled='false'><a href='#' title='Contextual Views' class='fa-stack fa-lg'>" +
        "<i class='fa fa-square fa-stack-2x'></i>" +
        "<i class='fa fa-mobile fa-inverse fa-stack-1x'></i>" +
        "<i class='fa fa-toggle-off'></i>" +
      "</a></div>").appendTo("body");

    $(".context-profile").hover(
        function() {
            if ( SDL_ENV.isInXpm && contextProfileOverviewEnabled() ) {
                var contextProfile = $(this).data("context-profile");
                var position = "left: " + $(this).position().left + "px; top: " + $(this).position().top + "px;";
                $("<span id='context-profile-label' class='label label-default' style='" + position + "'>" + contextProfile + "</span>").appendTo(this);
            }
        },
        function() {
            if ( SDL_ENV.isInXpm && contextProfileOverviewEnabled() ) {
                $(this).find('#context-profile-label').remove();
            }
        }
    );

    $(".context-profile-button a").click( function() {
        var enabled = $(this).parent().data("enabled");
        $(this).parent().data("enabled", !enabled);
    });

    function contextProfileOverviewEnabled() {
        var enabled = $(".context-profile-button").data("enabled");
        return enabled;
    }

});
