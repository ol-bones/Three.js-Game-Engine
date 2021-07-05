class CommsMessage
{
    constructor(data)
    {
	this.Data = data.data || null;
	this.Function = data.function;
    }
}

module.exports = CommsMessage;