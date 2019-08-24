const { ethers }              = require("ethers");
const regeneratorRuntime      = require("regenerator-runtime");
const createLedgerSubprovider = require("@ledgerhq/web3-subprovider").default;
const TransportU2F            = require("@ledgerhq/hw-transport-u2f").default;
const ProviderEngine          = require("web3-provider-engine");
const RpcSubprovider          = require("web3-provider-engine/subproviders/rpc");

window.provider = (config) => {

	const basicProvider = new ethers.providers.InfuraProvider(config.provider.network);

	const engine = new ProviderEngine();
	const getTransport = () => TransportU2F.create();
	const ledger = createLedgerSubprovider(getTransport, { accountsLength: 1 });
	engine.addProvider(ledger);
	engine.addProvider(new RpcSubprovider({ rpcUrl: '${basicProvider.baseUrl}/api' }));
	engine.start();
	return engine;
}
