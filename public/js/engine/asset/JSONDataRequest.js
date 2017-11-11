// Dependencies
// @AssetRequest@

class JSONDataRequest extends mix(AssetRequest).with()
{
    constructor(uri)
    {
	super(uri);
    }

    Initialise()
    {
	this.m_LoadState = LOADSTATE.INITIALISING;

	this.onInitialised();
    }

    Download()
    {
	try
	{
	    let self = this;
	    $.ajax(
	    {
		type: "GET",
		url: this.m_URI,
		async: true,
		beforeSend: (xhr) =>
		{
		    if (xhr && xhr.overrideMimeType)
		    {
			xhr.overrideMimeType("application/json;charset=utf-8");
		    }
		    self.onDownloading();
		},
		dataType: "json",
		success: (data) => self.onFinished(data)
	    });

	}
	catch(Exception)
	{
	    this.onError();
	}
    }

    onFinished(json)
    {
	this.m_Asset = json;
	super.onFinished();
    }
}
