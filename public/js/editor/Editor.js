// Dependencies
// @Game@
// @World@
// @Entity@
// @Component@

// @EntityTreeView@

class Editor
{
    constructor()
    {
	this.m_UpdateIntervalID = null;

	this.m_SelectedTool = null;

	this.m_SelectedTexture = "";
	this.m_TextureBrowserIndex = 0;

	this.m_LastEntitySelectTime = 0;
	this.m_ref_LastSelectedEntity = null;
	this.m_ref_SelectedEntity = null;

	this.m_EntityTreeViewView = new EntityTreeView();
	this.m_EntityManipulator = new EntityPropertyManipulatorView();

	this.m_DebugRendererToggled = false;
	this.m_EditModeToggled = false;
    }

    render()
    {
	this.m_EntityTreeViewView.render();
    }

    ClearEditComponents(entity)
    {
	Object.keys(entity.m_Components)
	    .filter(c => entity.m_Components[c].m_Name.includes("EditComponent"))
	    .map(c => entity.m_Components[c].m_Name)
	    .forEach(c => entity.RemoveComponent(c));
    }

    SelectPositionEditTool()
    {
	if(this.m_EditModeToggled && this.m_SelectedTool !== null
	&& this.m_ref_SelectedEntity && this.m_ref_SelectedEntity.m_Components)
	{
	    this.ClearEditComponents(this.m_ref_SelectedEntity);
	    this.m_SelectedTool = "PositionEditComponent";
	    let ToolType = (Component._TypeFromName({"name":this.m_SelectedTool}));
	    this.m_ref_SelectedEntity.AddComponent(new ToolType({Parent:
this.m_ref_SelectedEntity}));
	}
	else
	{
	    this.m_SelectedTool = "PositionEditComponent";
	}
    }

    SelectScaleEditTool()
    {
	if(this.m_EditModeToggled && this.m_SelectedTool !== null
	&& this.m_ref_SelectedEntity && this.m_ref_SelectedEntity.m_Components)
	{
	    this.ClearEditComponents(this.m_ref_SelectedEntity);
	    this.m_SelectedTool = "ScaleEditComponent";
	    let ToolType = (Component._TypeFromName({"name":this.m_SelectedTool}));
	    this.m_ref_SelectedEntity.AddComponent(new ToolType({Parent:
this.m_ref_SelectedEntity}));
	}
	else
	{
	    this.m_SelectedTool = "ScaleEditComponent";
	}
    }

    SelectRotateEditTool()
    {
	if(this.m_EditModeToggled && this.m_SelectedTool !== null
	&& this.m_ref_SelectedEntity && this.m_ref_SelectedEntity.m_Components)
	{
	    this.ClearEditComponents(this.m_ref_SelectedEntity);
	    this.m_SelectedTool = "RotateEditComponent";
	    let ToolType = (Component._TypeFromName({"name":this.m_SelectedTool}));
	    this.m_ref_SelectedEntity.AddComponent(new ToolType({Parent:
this.m_ref_SelectedEntity}));
	}
	else
	{
	    this.m_SelectedTool = "RotateEditComponent";
	}
    }

    SelectEntity(id)
    {
	if((Date.now() - this.m_LastEntitySelectTime) > 750)
	{
	    let entity = entities().find(e => e.m_ID === id);
	    if(entity)
	    {
		this.m_ref_LastSelectedEntity = this.m_ref_SelectedEntity;
		this.m_ref_SelectedEntity = entity;
		this.m_EntityManipulator.onEntitySelect(entity.GetSavableData());
	    }
	    console.log(Date.now() - this.m_LastEntitySelectTime);
	    this.m_LastEntitySelectTime = Date.now();
	}
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
	    this.m_EntityManipulator.FillMaterialEditor(this.m_SelectedTexture);
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

    NavMenuItemToggle(e) { $(e.srcElement).toggleClass("menu-toggled"); }

    ToggleEditMode(e)
    {
	this.NavMenuItemToggle(e);

	if(this.m_EditModeToggled)
	{
	    this.m_EditModeToggled = false;
	    if(this.m_ref_SelectedEntity
	    && this.m_ref_SelectedEntity.m_Components[this.m_SelectedTool])
	    {
		this.m_ref_SelectedEntity.RemoveComponent(this.m_SelectedTool);
	    }
	    clearInterval(this.m_UpdateIntervalID);
	    delete this.m_ref_SelectedEntity;
	    delete this.m_Ref_LastSelectedEntity;
	    GAME.BeginUpdateLoop();
	}
	else
	{
	    this.m_EditModeToggled = true;
	    clearInterval(GAME.m_UpdateIntervalID);
	    this.m_UpdateIntervalID = setInterval(this.UpdateWorldEditMode.bind(this), 1000/30);
	}
    }

    ToggleDebugRenderer(e)
    {
	this.NavMenuItemToggle(e);

	if(this.m_DebugRendererToggled)
	{
	    entities().forEach(e => e.RemoveComponent("DebugComponent"));
	    this.m_DebugRendererToggled = false;
	}
	else
	{
	    entities().forEach(e =>
	    {
		if(e.m_Components.RenderComponent && e.m_Components.RenderComponent.m_Debuggable)
		{
		    try
		    {
			e.AddComponent(new DebugComponent({Parent: e}));
		    } catch(Exception) {}
		}
	    });
	    this.m_DebugRendererToggled = true;
	}
    }

    UpdateWorldEditMode()
    {
	GAME.m_World.m_Entities.forEach(e => e.Update());
	GAME.m_AssetCache.Update();
	GAME.m_World.m_DebugRenderer.update();
    }
}

window.Editor = {};
let EDITOR = window.Editor;

$(document).ready(() =>
{
    EDITOR = new Editor();
    EDITOR.ToggleEditMode($($($("#Debug").children(0).prevObject[0].nextElementSibling).children()[0]).children(0)[0]);
});
