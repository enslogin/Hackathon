import React, { Component } from "react";
import PropTypes from 'prop-types';
import ensLoginSdk from 'ens-login-sdk';

import {
	MDBInput,
} from 'mdbreact';

import logo from '../assets/logo.png';
import "../css/Login.css";


class Login extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			modal: false,
			connections: [],
			creations:   [],
		};
	}

	toggle()
	{
		this.setState({ modal: !this.state.modal });
	}

	async update(event)
	{
		const username = event.target.value;
		ensLoginSdk.connect(username, this.props.services.config)
		.then(provider => { this.props.services.connect(provider, username); })
		.catch(e => {})
	}

	render()
	{
		return (
			<>
				<div id="login">
					<div className="login-card">
						<div className="login-header">
							<img src={logo} className="logo" alt="logo" />
							<span className="title">ENSLogin</span>
						</div>
						<div className="login-body">
							<MDBInput label="Username" className="input" onChange={this.update.bind(this)}/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

Login.propTypes =
{
	services: PropTypes.object,
};

export default Login;
