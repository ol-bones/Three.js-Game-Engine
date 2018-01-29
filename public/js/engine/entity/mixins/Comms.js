"use strict";

let Comms = (Entity) => class extends Entity
{
    constructor()
    {
	super();

	this.InboundCommsQueue = [];
	this.OutboundCommsQueue = [];
    }

    ProcessInboundCommsQueue()
    {
	this.OutboundCommsQueue.push(...this.InboundCommsQueue);
	this.InboundCommsQueue = [];

	if(this.OutboundCommsQueue.length === 0) { return; }

	let curTime = Date.now();
	this.OutboundCommsQueue.sort((a,b) =>
	{
	    return ( (a.Delay - (curTime - a.Sent)) - (b.Delay - (curTime - b.Sent)) );
	});

	while(true)
	{
	    let MTO = this.OutboundCommsQueue.shift();
	    if(!MTO || MTO === null) { break; }
	    if(MTO.Destination.Reference === this)
	    {
		let ref = MTO.Destination.Reference;
		if(ref.m_Components && ref.m_Components[MTO.Destination.Component])
		{
		    ref.m_Components[MTO.Destination.Component][MTO.Message.Function].call(
			ref.m_Components[MTO.Destination.Component],
			...MTO.Message.Data
		    )
		}
		else
		{
		    ref[MTO.Message.Function].call(
			MTO.Destination.Reference,
			...MTO.Message.Data
		    );
		}
	    }
	    else
	    {
		this.SendMessageTransportObject(MTO, this.GetDestination(MTO.Destination.ID));
	    }
	    if((MTO.Delay - (curTime - MTO.Sent)) > 2) { break; }
	}
    }

    GetDestination(id)
    {
	let destination = entities().find(e => e.m_ID === id);
	return destination || ENGINE.m_World;
    }

    SendMessageTransportObject(MTO, destinationReference)
    {
	MTO.Destination.Reference = destinationReference;
	destinationReference.ReceiveMessageTransportObject(MTO);
    }

    ReceiveMessageTransportObject(MTO)
    {
	MTO.Received = Date.now();
	this.InboundCommsQueue.push(MTO);
    }

    SendComms(dest, data, func, delay)
    {
	let self = this;
	self.InboundCommsQueue.push(new MessageTransportObject(
	{
	    Origin: new EntityTransportReference(
	    {
		ID: (self.m_ID === null && self.m_Parent === null) ?
			((self.constructor.name === "Entity")
			    ? self.m_ID : self.m_Parent.m_ID) : null,
		Reference: self,
		Component: (self.constructor.name === "Component") ? self.constructor.name : null
	    }),
	    Destination: new EntityTransportReference(
	    {
		ID: dest ? dest.ID : null,
		Reference: dest ? dest.Reference : null,
		Component: dest ? dest.Component : null
	    }),
	    Message: new CommsMessage({ data: data, function: func }),
	    Delay: delay || 0
	}));
    }
}

class MessageTransportObject
{
    constructor(data)
    {
	this.Origin = data.Origin;
	this.Destination = data.Destination;
	this.Message = data.Message;
	this.Delay = data.Delay;
	this.Sent = Date.now();
	this.Received = 0;
    }
}

class EntityTransportReference
{
    constructor(data)
    {
	this.ID = data.ID;
	this.Reference = data.Reference;
	this.Component = data.Component;
    }
}

class CommsMessage
{
    constructor(data)
    {
	this.Data = data.data || null;
	this.Function = data.function;
    }
}





