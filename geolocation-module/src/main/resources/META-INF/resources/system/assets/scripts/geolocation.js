$(document).ready(function () {
    'use strict';

    if (Modernizr.load) {
        Modernizr.load({
            test: Modernizr.geolocation,
            nope: 'geo.js',
            complete: function () {
                geolocate(function () {
                    // reload page to transfer cookie data
                    // and process location update

                    var url = window.location.href.replace(window.location.hash, '');
                    window.location = url;
                    //window.location.reload(true);
                });
            }
        });
    }

    function geolocate(callback) {

        if ('undefined' == typeof ($.cookie('lat'))) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    $.cookie('lat', position.coords.latitude, { path: '/' });
                    $.cookie('lon', position.coords.longitude, { path: '/' });
                    if (null != callback) {
                        callback();
                    }
                }
            )
        }
    }
});