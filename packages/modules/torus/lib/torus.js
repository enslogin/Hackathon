const Torus = require("@toruslabs/torus-embed");

window.provider = async (config) => {
	const torus = new Torus.default();
	await torus.init();
	return torus.provider;
}
