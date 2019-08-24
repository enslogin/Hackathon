const { ethers } = require('ethers');
const ensutils   = require("./utils/ensutils");
const jsloader   = require("./utils/jsloader");

class ENSLogin
{
	static resolveUsername(username, config = {})
	{
		return new Promise(async (resolve, reject) => {
			// DEBUG !
			// resolve({ addr:null, descr: "ipfs://QmQ2P3xEokyHEfSrLmxEhYH7aFvqPmvcXXFcwTte3xjQhw" }); // default on IPFS
			// resolve({ addr:null, descr: "file://lib/modules/__debug.js" });
			// DEBUG !
			try
			{
				const basicProvider = ethers.getDefaultProvider(config.provider.network);
				const ens           = await ensutils.getENS(basicProvider);

				var addr, descr;
				{
					const node     = ensutils.namehash(username);
					const resolver = await ensutils.getResolver(ens, node);
					if (resolver)
					{
						addr  = await resolver.addr(node);
						descr = await resolver.text(node, 'web3-provider');
					}
					if (descr)
					{
						resolve({ addr, descr });
						return;
					}
				}
				{
					const node     = ensutils.namehash(username.split('.').splice(1).join('.'));
					const resolver = await ensutils.getResolver(ens, node);
					if (resolver)
					{
						descr = await resolver.text(node, 'web3-provider-default');
					}
					if (descr)
					{
						resolve({ addr, descr });
						return;
					}
				}
				reject("toto");
			}
			catch(e)
			{
				reject(e);
			}
		});
	}

	static create(username, config = {})
	{
		return new Promise((resolve, reject) => {
			ENSLogin.resolveUsername(username, config)
			.then(({ addr, descr }) => {
				config.user = { addr, username };

				const parsed     = descr.match('([a-zA-Z0-9_]*)://([^:]*)(:(.*))?');
				const protocol   = parsed[1];
				const uri        = parsed[2];
				const entrypoint = parsed[4] || 'provider';

				switch (protocol)
				{
					case 'ipfs':
						jsloader.fromIPFS.api(uri, config)
						.then(() => resolve(eval(entrypoint)(config)))
						.catch(reject);
						break;
					case 'file':
						jsloader.fromFS(uri, config)
						.then(() => resolve(eval(entrypoint)(config)))
						.catch(reject);
						break;
					default:
						reject(`protocole ${protocol} is not supported`);
				}
			})
			.catch(reject);
		});
	}
}


/*****************************************************************************
 *                                   Main                                    *
 *****************************************************************************/
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

	// "lib/modules/__debug.js", // Single file
	// "QmWaVdwE3t9tvJp1kBAYtmLrLPqS7hVohGT9UqecxeWVuQ", // Single file
	// "lib/modules/__debug_multi", // Multiple file
	// "QmbhRi1dAsSG4yfMcPxRNeejX1a7P3NQqPMGXJt9pxpe6f", // Multiple Files
	// "lib/modules//default/index.js", // default
	// "QmQ2P3xEokyHEfSrLmxEhYH7aFvqPmvcXXFcwTte3xjQhw", // default

	// ENSLogin.create("hadriencroubois.mylogin.eth", config).then(console.log).catch(console.error);
	ENSLogin.create("metamask.eth", config).then(console.log).catch(console.error);



})().catch(console.eroor);
