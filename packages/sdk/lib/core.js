const { ethers } = require('ethers');
const fs         = require('fs');
const IPFS       = require('ipfs');
const IPFSHTTP   = require('ipfs-http-client')
const vm         = require('vm');

// FOR BROWSER - IPFSHTTP
// <script src="https://unpkg.com/ipfs-http-client/dist/index.min.js"></script>
// const ipfs = window.IpfsHttpClient('localhost', '5001')

/*****************************************************************************
 *                      Javascript loading - from ipfs                       *
 *****************************************************************************/
class loadJSfromIPFS
{
	static __node(node, fileHash, config = {})
	{
		return new Promise((resolve, reject) => {
			node.get(fileHash).then(files => {
				files
				.filter(file => file.content !== undefined)
				.forEach(file => {
					vm.runInThisContext(
						file.content.toString('utf8'),
						{ filename: file.name }
					);
				});
				resolve();
			})
			.catch(reject);
		});
	}

	static api(fileHash, config = {})
	{
		return this.__node(
			IPFSHTTP(config.ipfs || { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }),
			fileHash,
		);
	}

	static standalone(fileHash, config = {})
	{
		return new Promise((resolve, reject) => {
			const node = new IPFS();
			node.once('ready', () => {
				console.log('node started');
				this.__node(node, fileHash)
				.then(() =>{ node.stop(resolve); })
				.catch(reject);
			});
			node.once('stop', () => {
				console.log('node stopped');
			});
		});
	}
}

/*****************************************************************************
 *            Javascript loading - from file system (for testing)            *
 *****************************************************************************/
function loadJSfromFS(path, config = {})
{
	return new Promise((resolve, reject) => {
		const stats = fs.lstatSync(path);
		if (stats.isFile())
		{
			vm.runInThisContext(
				code    = fs.readFileSync(path).toString(),
				options = { filename: path }
			);
			resolve();
		}
		else if (stats.isDirectory())
		{
			Promise.all(
				fs.readdirSync(path).map(file => loadJSfromFS(`${path}/${file}`))
			)
			.then(() => { resolve() })
			.catch(reject);
		}
		else
		{
			reject("unsupported filePath format");
		}
	});
}

/*****************************************************************************
 *                                 ENSLogin                                  *
 *****************************************************************************/

const ENSABI      = JSON.parse(fs.readFileSync("lib/abi/ENS.json")).abi;
const RESOLVERABI = JSON.parse(fs.readFileSync("lib/abi/Resolver.json")).abi;

class ENSTools
{
	static labelhash(label)
	{
		return ethers.utils.solidityKeccak256([ "string" ], [ label.toLowerCase() ])
	}

	static compose(labelHash, rootHash)
	{
		return ethers.utils.solidityKeccak256([ "bytes32", "bytes32" ], [ rootHash,  labelHash ]);
	}

	static namehash(domain)
	{
		return domain.split('.').reverse().reduce(
			(hash, label) => ENSTools.compose(ENSTools.labelhash(label), hash),
			"0x0000000000000000000000000000000000000000000000000000000000000000"
		);
	}
}

function getResolver(ens, node)
{
	return new Promise(async (resolve, reject) => {
		ens.resolver(node).then(addr => {
			if (addr === ethers.constants.AddressZero)
			{
				resolve(null);
			}
			else
			{
				resolve(new ethers.Contract(addr, RESOLVERABI, ens.provider));
			}
		})
		.catch(reject);
	});
}

function resolveUsername(username, config = {})
{
	return new Promise(async (resolve, reject) => {
		try
		{
			const basicProvider = ethers.getDefaultProvider(config.provider.network);
			const chain         = await basicProvider.ready
			const ens           = new ethers.Contract(chain.ensAddress, ENSABI, basicProvider);

			var addr, descr;
			{
				const node     = ENSTools.namehash(username);
				const resolver = (await getResolver(ens, node)) || reject();
				addr           = await resolver.addr(node);
				descr          = await resolver.text(node, 'web3-provider');
			}
			// DEBUG !
			// descr = "ipfs://QmQ2P3xEokyHEfSrLmxEhYH7aFvqPmvcXXFcwTte3xjQhw"; // default on IPFS
			// descr = "file://lib/modules/__debug.js";
			// DEBUG !
			if (descr !== '') { resolve({ addr, descr }); }

			{
				const node     = ENSTools.namehash(username.split('.').splice(1).join('.'));
				const resolver = (await getResolver(ens, node)) || reject();
				descr          = await resolver.text(node, 'web3-provider-default');
			}
			if (descr !== '') { resolve({ addr, descr }); }

			reject(null);
		}
		catch(e)
		{
			reject(e);
		}
	});
}


class ENSLogin
{
	static create(username, config = {})
	{
		return new Promise((resolve, reject) => {
			resolveUsername(username, config)
			.then(({ addr, descr }) => {
				config.user = { addr, username, }

				const parsed     = descr.match('([a-zA-Z0-9_]*)://([^:]*)(:(.*))?');
				const protocol   = parsed[1];
				const uri        = parsed[2];
				const entrypoint = parsed[4] || 'provider';

				switch (protocol)
				{
					case 'ipfs':
						loadJSfromIPFS.api(uri, config)
						.then(() => resolve(eval(entrypoint)(config)))
						.catch(reject);
						break;
					case 'file':
						loadJSfromFS(uri, config)
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
	ENSLogin.create("metamask.eth", config).then(console.log).catch(console.error);



})().catch(console.eroor);