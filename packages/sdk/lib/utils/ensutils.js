const { ethers } = require('ethers');
const ENSABI      = require("../abi/ENS.json").abi;
const RESOLVERABI = require("../abi/Resolver.json").abi;

function labelhash(label)
{
	return ethers.utils.solidityKeccak256([ "string" ], [ label.toLowerCase() ])
}

function compose(labelHash, rootHash)
{
	return ethers.utils.solidityKeccak256([ "bytes32", "bytes32" ], [ rootHash,  labelHash ]);
}

function namehash(domain)
{
	return domain.split('.').reverse().reduce(
		(hash, label) => compose(labelhash(label), hash),
		"0x0000000000000000000000000000000000000000000000000000000000000000"
	);
}

function getENS(basicProvider)
{
	return new Promise(async (resolve, reject) => {
		basicProvider.ready
		.then(chain => {
			resolve(new ethers.Contract(chain.ensAddress, ENSABI, basicProvider));
		})
		.catch(reject);
	});
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

module.exports = {
	labelhash,
	compose,
	namehash,
	getENS,
	getResolver,
};
