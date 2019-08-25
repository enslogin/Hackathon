import React, { Component } from "react";
import PropTypes from 'prop-types';

import {
	MDBBtn,
	MDBCard,
	MDBCardBody,
	MDBCardHeader,
	MDBIcon,
	MDBTable,
	MDBTableBody,
	MDBTableHead,
} from 'mdbreact';

import TransferModal from './TransferModal';

import { Contract } from 'ethers';
import ERC20 from 'openzeppelin-solidity/build/contracts/ERC20Detailed.json'

class AssetsOverviewCard extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {};
	}

	componentDidMount()
	{
		this.subscription = this.props.services.emitter.addListener('tx', this.refresh.bind(this));
		this.refresh();
	}

	componentWillUnmount()
	{
		this.subscription.remove();
	}

	refresh()
	{
		this.props.services.web3.eth.getAccounts()
		.then(accounts => {
			this.setState({ address: accounts[0] })
			this.props.services.web3.eth.getBalance(accounts[0])
			.then(balance => this.setState({balance : (balance/(Math.pow(10,18))).toString()}))
			.catch(console.error);
		});
		// Promise.all(
		// 	this.props.services.config.assets
		// 	.map(address => new Contract(address, ERC20.abi, this.props.services.provider))
		// 	.map(contract => Promise.all([
		// 		contract.address,
		// 		contract.name(),
		// 		contract.symbol(),
		// 		contract.balanceOf(this.props.services.wallet.proxy),
		// 		contract.decimals(),
		// 	]))
		// )
		// .then(assets => this.setState({ assets }))
		// .catch(console.error);
	}

	forceRefresh(event)
	{
		event.preventDefault();
		this.refresh();
	}

	render()
	{
		return (
			<MDBCard>
				<MDBCardHeader>
					Account balance for { this.state.address }
				</MDBCardHeader>
				<MDBCardBody>
					<MDBTable btn fixed hover scrollY maxHeight="30vh">
						<MDBTableHead color="blue-gradient" textWhite>
							<tr>
								<th>Name</th>
								<th>Symbol</th>
								<th>Balance</th>
								<th>Transfer</th>
							</tr>
						</MDBTableHead>
						<MDBTableBody>
						<tr key="0">
							<th className="overflow-ellipsis">Ether</th>
							<th className="overflow-ellipsis">ETH</th>
							<th className="overflow-ellipsis">{ this.state.balance }</th>
							<th>
								<TransferModal services={this.props.services} asset={[null, "Ether", "ETH", null, 18]} />
							</th>
						</tr>
						{
							this.state.assets && this.state.assets.map(asset =>
								<tr key={asset[0]}>
									<th className="overflow-ellipsis">{ asset[1] }</th>
									<th className="overflow-ellipsis">{ asset[2] }</th>
									<th className="overflow-ellipsis">{ (asset[3]/(Math.pow(10,asset[4]))).toString() }</th>
									<th>
										<TransferModal services={this.props.services} asset={asset}/>
									</th>
								</tr>
							)
						}
						</MDBTableBody>
					</MDBTable>
					<MDBBtn gradient="blue" className="m-3 py-2" onClick={this.forceRefresh.bind(this)}>
						Refresh
						<MDBIcon icon="sync" className="ml-1" />
					</MDBBtn>
					<MDBBtn gradient="ripe-malinka" className="m-3 py-2">
						Buy tokens
						<MDBIcon icon="shopping-cart" className="ml-1" />
					</MDBBtn>
				</MDBCardBody>
			</MDBCard>
		);
	}
}

AssetsOverviewCard.propTypes =
{
	services: PropTypes.object,
};

export default AssetsOverviewCard;
