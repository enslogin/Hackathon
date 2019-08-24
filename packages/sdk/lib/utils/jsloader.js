const fs         = require('fs');
// const IPFS       = require('ipfs');
const IPFSHTTP   = require('ipfs-http-client')
const vm         = require('vm');

// FOR BROWSER - IPFSHTTP
// <script src="https://unpkg.com/ipfs-http-client/dist/index.min.js"></script>
// const ipfs = window.IpfsHttpClient('localhost', '5001')

class fromIPFS
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

	// static standalone(fileHash, config = {})
	// {
	// 	return new Promise((resolve, reject) => {
	// 		const node = new IPFS();
	// 		node.once('ready', () => {
	// 			console.log('node started');
	// 			this.__node(node, fileHash)
	// 			.then(() =>{ node.stop(resolve); })
	// 			.catch(reject);
	// 		});
	// 		node.once('stop', () => {
	// 			console.log('node stopped');
	// 		});
	// 	});
	// }
}

function fromFS(path, config = {})
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

module.exports = {
	fromIPFS,
	fromFS,
};
