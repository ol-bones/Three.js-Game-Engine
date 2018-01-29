"use strict";

// Dependencies
// @Engine@

window.Engine = {};
var ENGINE = window.Engine;

window.Config = [];
var CONFIG = window.Config;

window.whtml = {};
var WHTML = window.whtml;

$.ajax("/whiskerTemplates").done(xhr =>
{
    xhr.forEach(json => WHTML[json.name] = json.contents);
}).then(() =>
{
    $.ajax("/componentTypes").done(xhr =>
    {
	xhr.forEach(type => Component.Types.push(eval(type)));
    })
.then(() =>
{
    $.ajax("/texturelist").done(xhr =>
    {
	xhr.forEach(json => AssetCache.TextureList.push(json));
    })
.then(() =>
{
    $.ajax("/config").done(xhr =>
    {
	Object.keys(xhr).map(key => [key, xhr[key]])
	    .forEach(json => CONFIG[json[0]] = json[1]);
    })
.then(() =>
{
    $.ajax("/modellist").done(xhr =>
    {
	xhr.forEach(json => AssetCache.ModelList.push(json));
    })
.then(() =>
{
    ENGINE = new Engine();
    new (eval(CONFIG.EntryClass))();
    ENGINE.Initialise();
})})})})});

$(window).on("resize", () =>
{
    ENGINE.m_World.m_Camera.aspect = window.innerWidth / window.innerHeight;
    ENGINE.m_World.m_Camera.updateProjectionMatrix();

    ENGINE.m_World.m_Renderer.setSize( window.innerWidth, window.innerHeight );

});

$(document).on("mobileinit", function()
{
    $.mobile.autoInitializePage = false;
    $.mobile.loadingMessage = false;
});

// this cauzed errors
// $.mobile.autoInitializePage = false;




