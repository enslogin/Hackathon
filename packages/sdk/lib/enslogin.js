const { ethers } = require('ethers');
const ensutils   = require("./utils/ensutils");
const jsloader   = require("./utils/jsloader");

function resolveUsername(username, config = {})
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


			var addr;
			{
				const node     = ensutils.namehash(username);
        console.log('username', username)
        console.log('node', node)
				const resolver = await ensutils.getResolver(ens, node);
				if (resolver)
				{
					addr  = await resolver.addr(node);
					const descr = await resolver.text(node, 'web3-provider');
					console.log('Provider URL at web3-provider: ', descr)
					if (descr)
					{
						resolve({ addr, descr });
						return;
					}
				}
			}
			{
				const node     = ensutils.namehash(username.split('.').splice(1).join('.'));
				const resolver = await ensutils.getResolver(ens, node);
				if (resolver)
				{
					const descr = await resolver.text(node, 'web3-provider-default');
					console.log('Provider URL at web3-provider-default: ', descr)
					if (descr)
					{
						resolve({ addr, descr });
						return;
					}
				}
			}
			reject("No web3 provider specified for this user");
		}
		catch(e)
		{
			reject(e);
		}
	});
}

function connect(username, config = {})
{
	return new Promise((resolve, reject) => {
		resolveUsername(username, config)
		.then(({ addr, descr }) => {
			config.user = { addr, username };

			if (config.__callbacks && config.__callbacks.loadStart) { config.__callbacks.loadStart(); }

			const parsed     = descr.match('([a-zA-Z0-9_]*)://([^:]*)(:(.*))?');
			const protocol   = parsed[1];
			const uri        = parsed[2];
			const entrypoint = parsed[4] || 'provider';

      console.log(protocol, uri, entrypoint)

			switch (protocol)
			{
				case 'ipfs':
					jsloader.fromIPFS.api(uri, config)
					.then(async () => resolve(await eval(entrypoint)(config)))
					.catch(reject);
					break;
				case 'file':
					jsloader.fromFS(uri, config)
					.then(async () => resolve(await eval(entrypoint)(config)))
					.catch(reject);
					break;
				default:
					reject(`protocole ${protocol} is not supported`);
			}
		})
		.catch(reject);
	});
}

module.exports = { connect };
