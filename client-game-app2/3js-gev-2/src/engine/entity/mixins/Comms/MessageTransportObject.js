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

module.exports = MessageTransportObject;