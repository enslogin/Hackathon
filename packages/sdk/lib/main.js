const enslogin = require("./enslogin");

(async () => {

	const config = {
		provider:
		{
			appId:   null,
			network: 'goerli',
			anchor:  null,
		},
		ipfs:
		{
			host: 'ipfs.infura.io',
			port: 5001,
			protocol: 'https',
		},
	}

	// enslogin.connect("hadriencroubois.mylogin.eth", config)
	enslogin.connect("metamask.eth", config)
	.then(console.log)
	.catch(e => console.error("ERROR:", e));


})().catch(console.eroor);
