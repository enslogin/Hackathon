class Provider {
	constructor(config)
	{
		console.log("[debug|provider] constructor");
		console.log("config:", config);
	}
}

window.provider = (config) => new Provider(config)
