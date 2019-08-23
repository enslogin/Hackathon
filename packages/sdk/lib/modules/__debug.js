class Provider {
	constructor(config)
	{
		console.log("[debug|provider] constructor");
		console.log("config:", config);
	}
}

provider = (config) => new Provider(config)
