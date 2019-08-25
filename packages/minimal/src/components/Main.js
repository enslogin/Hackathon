import React, { Component } from "react";
import PropTypes from 'prop-types';

import AssetsOverviewCard     from './AssetsOverviewCard';
import TransactionCard        from './TransactionCard';
import LogoutCard             from './LogoutCard';
import "../css/Main.css";

class Main extends Component
{
	render()
	{
		return (
			<div id="main">
				<div className="container">
					<AssetsOverviewCard services={this.props.services}/>
					<TransactionCard    services={this.props.services}/>
					<LogoutCard         services={this.props.services}/>
				</div>
			</div>
		);
	}
}

Main.propTypes =
{
	services: PropTypes.object,
};

export default Main;
