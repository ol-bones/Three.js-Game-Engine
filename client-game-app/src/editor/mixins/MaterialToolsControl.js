"use strict";

let MaterialToolsControl = (Main) => class extends Main
{
    constructor()
    {
	super();

	this.m_SelectedTexture = "";
	this.m_TextureBrowserIndex = 0;
    }

    SelectTexture(src)
    {
	this.m_SelectedTexture = src.replace("/textures/","");
    }

    ApplyTexture()
    {
	this.m_ref_SelectedEntity.m_Components.RenderComponent.SetTexture(this.m_SelectedTexture);

	setTimeout(() =>
	{
	    this.FillMaterialEditor(this.m_SelectedTexture);
	}, 300);
    }

    OpenTextureBrowser()
    {
	$("#texture-select-modal").modal();
	if(this.m_TextureBrowserIndex === 0)
	{
	    this.LoadAndAppendTextureBrowserRow(0);
	    this.LoadAndAppendTextureBrowserRow(1);

	    this.m_TextureBrowserIndex = 1;
	}

	let container = $("#texture-browser-container");

	container.bind('scroll', () =>
	{
	   if (Math.round(container.scrollTop() + container.innerHeight(), 10) >=
Math.round(container[0].scrollHeight, 10))
	    {
		this.m_TextureBrowserIndex++;
		this.LoadAndAppendTextureBrowserRow(this.m_TextureBrowserIndex);
            }
	});
    }

    LoadAndAppendTextureBrowserRow(row)
    {
	let texture_URIs = AssetCache.TextureList.slice(row*4, (row*4)+4);
	if(texture_URIs.length === 0) { return; }
	let texture_tiles = [];

	texture_URIs.forEach(URI =>
	{
	    texture_tiles.push(whiskers.render(WHTML["texture-browser-image-tile"],
	    {
		ImageSrc: "/textures/" + URI.path
	    }));
	});

	$("#texture-browser-container").append(whiskers.render(WHTML["texture-browser-image-tile-row"],
	{
	    ImageTiles: texture_tiles
	}));
    }
}
