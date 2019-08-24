const Torus = require("@toruslabs/torus-embed");

window.provider = async (config) => {
	const torus = new Torus.default();
	await torus.init();
	await torus.setProvider(config.provider.network);
	return torus.provider;
}
