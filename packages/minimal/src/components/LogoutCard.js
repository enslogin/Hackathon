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

class LogoutCard extends Component
{
	logout()
	{
		this.props.services.disconnect();
	}

	render()
	{
		return (
			<MDBCard>
				<MDBCardBody>
					<MDBBtn gradient="blue" className="m-3 py-2" onClick={this.logout.bind(this)}>
						Logout
						<MDBIcon icon="sync" className="ml-1" />
					</MDBBtn>
				</MDBCardBody>
			</MDBCard>
		);
	}
}

LogoutCard.propTypes =
{
	services: PropTypes.object,
};

export default LogoutCard;
