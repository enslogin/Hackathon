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

	// enslogin.connect("hadriencroubois.mylogin.eth", config).then(console.log).catch(console.error);
	enslogin.connect("metamask.eth", config).then(console.log).catch(console.error);


})().catch(console.eroor);
