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
class ENSLogin
{
	// static create(config = {})
	// {
	// 	return new Promise((resolve, reject) => {
	// 		// const ensprovider = ethers.getDefaultProvider();
	// 		// console.log(ensprovider)
	//
	// 		// const name = "name.provider.eth";
	// 		// let domain = name.split('.').splice(1).join('.')
	//
	// 		// name → nodehash
	// 		// - find resolver for nodehash
	// 		// - try getData(nodehash, 'web3-provider')
	// 		// domain → nodehash
	// 		// - find resolver for nodehash
	// 		// - try getData(nodehash, 'default-web3-provider')
	// 		// else error
	//
	// 		loadProvider().then(resolve).catch(reject);
	// 	});
	// }

	static loadProvider(descr, config = {})
	{
		return new Promise((resolve, reject) => {
			const [ uri, entrypoint = 'provider'] = descr.split(':');
			// Select `api` or `standalone` as a way to connect to ipfs
			loadJSfromIPFS.api(uri, config)
			.then(() => resolve(eval(entrypoint)(config.provider)))
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
			network: 'homestead',
			anchor:  null,
		},
		ipfs:
		{
			host: 'ipfs.infura.io',
			port: 5001,
			protocol: 'https',
		},
	}


	ENSLogin.loadProvider(
		// "lib/modules/__debug.js", // Single file
		// "QmWaVdwE3t9tvJp1kBAYtmLrLPqS7hVohGT9UqecxeWVuQ", // Single file
		// "lib/modules/__debug_multi", // Multiple file
		// "QmbhRi1dAsSG4yfMcPxRNeejX1a7P3NQqPMGXJt9pxpe6f", // Multiple Files
		// "lib/modules//default/index.js", // default
		"QmQ2P3xEokyHEfSrLmxEhYH7aFvqPmvcXXFcwTte3xjQhw", // default
		config
	)
	.then(console.log)
	.catch(console.error);



})().catch(console.eroor);
