"use strict";

// Dependencies
// @Game@
// @World@

window.Game = {};
var GAME = window.Game;

window.Config = [];
var CONFIG = window.Config;

window.whtml = {};
var WHTML = window.whtml;

$.holdReady(true);
$.ajax("/whiskerTemplates").done(xhr =>
{
    xhr.forEach(json => WHTML[json.name] = json.contents);
}).then(() =>
{
    $.ajax("/componentTypes").done(xhr =>
    {
	xhr.forEach(type => Component.Types.push(eval(type)));
    });
}).then(() =>
{
    $.ajax("/texturelist").done(xhr =>
    {
	xhr.forEach(json => AssetCache.TextureList.push(json));
    });
}).then(() =>
{
    $.ajax("/config").done(xhr =>
    {
	Object.keys(xhr).map(key => [key, xhr[key]])
	    .forEach(json => CONFIG[json[0]] = json[1]);
    });
}).then(() =>
{
    $.ajax("/modellist").done(xhr =>
    {
	xhr.forEach(json => AssetCache.ModelList.push(json));
	$.holdReady(false);
    });
});


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

$(window).on("resize", () =>
{
    GAME.m_World.m_Camera.aspect = window.innerWidth / window.innerHeight;
    GAME.m_World.m_Camera.updateProjectionMatrix();

    GAME.m_World.m_Renderer.setSize( window.innerWidth, window.innerHeight );

});

$(document).on("mobileinit", function()
{
    $.mobile.autoInitializePage = false;
    $.mobile.loadingMessage = false;
});

// this cauzed errors
// $.mobile.autoInitializePage = false;




