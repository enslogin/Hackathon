import React, { Component } from "react";
import PropTypes from 'prop-types';

import {
	MDBCard,
	MDBCardBody,
	MDBBtn,
	MDBIcon,
} from 'mdbreact';

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
						<MDBIcon icon="sign-out-alt" className="ml-1" />
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
