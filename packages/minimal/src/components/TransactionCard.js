import React, { Component } from "react";
import PropTypes from 'prop-types';

import {
	MDBCard,
	MDBCardHeader,
	MDBCardBody,
	MDBBtn,
	MDBIcon,
	MDBInput
} from 'mdbreact';

import { ethers } from 'ethers';

class TransactionCard extends Component
{
	async toAddress(address)
	{
		try
		{
			return ethers.utils.getAddress(address);
		}
		catch (e)
		{
			return false;
			// return this.props.services.sdk.resolveName(address);
		}
	}

	async transaction(event)
	{
		event.preventDefault();
		const to    = event.target.to.value    || ethers.constants.AddressZero;
		const data  = event.target.data.value  || '';
		const value = event.target.value.value || '0';
		const from  = (await this.props.services.web3.eth.getAccounts())[0];

		this.toAddress(to).then(resolved => {
			if (resolved === false)
			{
				this.props.services.emitter.emit('Notify', 'error', 'Failled to resolve destination address');
				return;
			}
			this.props.services.web3.eth.sendTransaction({ from, to, data, value: Math.floor(parseFloat(value) * 10**18) })
			.then (() => {
				this.props.services.emitter.emit('Notify', 'success', 'Transaction succesfull');
				this.props.services.emitter.emit('tx');
			})
			.catch((e) => this.props.services.emitter.emit('Notify', 'error', `Error during transaction ${e}`));
		})
	}

	render()
	{
		return (
			<MDBCard>
				<MDBCardHeader>
					Send transaction
				</MDBCardHeader>
				<MDBCardBody>
					<form className="col-8 offset-2" onSubmit={this.transaction.bind(this)}>
						<MDBInput label="to"          name="to"    hint={ethers.constants.AddressZero}/>
						<MDBInput label="value (ETH)" name="value" hint="0"/>
						<MDBInput label="data"        name="data"  hint="0x"/>
						<MDBBtn gradient="blue" className="m-0 py-2" type="submit">
							Send transaction<MDBIcon icon="paper-plane" className="ml-1" />
						</MDBBtn>
					</form>
				</MDBCardBody>
			</MDBCard>
		);
	}
}

TransactionCard.propTypes =
{
	services: PropTypes.object,
};

export default TransactionCard;
