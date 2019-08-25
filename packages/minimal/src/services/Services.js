import baseConfig from '../config/config';
import {EventEmitter} from 'fbemitter';
import Web3 from 'web3';

class Services
{
	constructor(config = baseConfig, overrides = {})
	{
		this.config   = config;
		this.emitter  = new EventEmitter();
		this.provider = null;
		this.web3     = null;
		// this.storageService = overrides.storageService || new StorageService();
	}

	start()
	{
	}

	stop()
	{
	}

	connect(provider, username = null)
	{
		this.provider = provider;
		this.web3     = new Web3(provider);
		try
		{
			this.provider.enable();
		}
		catch (e)
		{}
		finally
		{
			if (username) this.emitter.emit("Notify", "info", `You are connected to ${username}`)
			this.emitter.emit("updateView");
		}
	}

	disconnect()
	{
		this.provider = null;
		this.web3     = null;
		this.emitter.emit("Notify", "warning", `Disconnected`)
		this.emitter.emit("updateView");
	}

}

export default Services;
