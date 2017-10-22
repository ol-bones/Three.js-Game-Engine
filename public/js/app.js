// Dependencies
// @Game@
// @World@

window.Game = {};
window.texture = function(uri)
{
    return window.GAME.m_AssetCache.GetAsset(uri, "texture");
}

var GAME = window.Game;
var texture = window.texture;

$(document).ready(function ()
{
    $("#fullscreen-button").on("click", function()
    {
        $('.navbar').hide();
        var el = document.documentElement,
        rfs = el.requestFullscreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullscreen;

        rfs.call(el);

        // wait for DOM update from hide()^
        setTimeout(function()
        {
            $(".game-content").css({"top":"0%", "position": "absolute"});
        }, 100);
    });

    GAME = new Game();
    GAME.initialise();
});

$(document).on("mobileinit", function()
{
    $.mobile.autoInitializePage = false;
    $.mobile.loadingMessage = false;
});

// this cauzed errors
// $.mobile.autoInitializePage = false;




