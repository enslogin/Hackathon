const Portis = require("@portis/web3");

window.provider = (config) => {
	return (new Portis("3269932e-25a4-4350-b543-e5e762acb9ae", config.provider.network)).provider;
}
