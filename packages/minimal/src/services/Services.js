import baseConfig from '../config/config';
import {EventEmitter} from 'fbemitter';
import ensLoginSdk from 'ens-login-sdk';
import Web3 from 'web3';

import StorageService from './StorageService';

class Services
{
	constructor(config = baseConfig, overrides = {})
	{
		this.config         = config;
		this.emitter        = new EventEmitter();
		this.provider       = null;
		this.web3           = null;
		this.storageService = overrides.storageService || new StorageService();
	}

	start()
	{
		this.config.__callbacks = {
			loadStart: () => {
				this.emitter.emit('setView', 'Loading');
			}
		};
		this.storageService.getIdentity().then(username => {
			this.tryConnect(username);
		});
	}

	stop()
	{
	}

	tryConnect(username)
	{
		console.log(username)
		ensLoginSdk.connect(username, this.config)
		.then(async (provider) => {
			await this.storageService.storeIdentity(username)
			this.provider = provider;
			this.web3     = new Web3(provider);
			try
			{
				this.provider.enable()
				.then(() => this.connected(username))
				.catch(() => console.error("connection refused"));
			}
			catch (e)
			{
				this.connected(username);
			}
		})
		.catch(e => {
			this.storageService.storeIdentity(undefined);
		})
	}

	connected(username)
	{
		if (username) this.emitter.emit("Notify", "info", `You are connected to ${username}`)
		this.emitter.emit('setView', 'Main');
	}

	disconnect()
	{
		this.provider = null;
		this.web3     = null;
		this.storageService.storeIdentity(undefined);
		this.emitter.emit("Notify", "warning", `Disconnected`)
		this.emitter.emit('setView', 'Login');
	}

}

export default Services;
