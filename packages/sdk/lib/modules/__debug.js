class Provider {
	constructor()
	{
		console.log("[debug|provider] constructor");
	}
}

provider = (config) => new Provider(config)
