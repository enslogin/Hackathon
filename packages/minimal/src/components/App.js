import React, { Component } from "react";
import PropTypes from 'prop-types';

import Root     from './Root';
import Services from '../services/Services';

class App extends Component
{
	constructor(props)
	{
		super(props);
		this.services = props.services || new Services();
	}

	componentDidMount()
	{
		this.services.start();
	}

	componentWillUnmount()
	{
		this.services.stop();
	}

	render()
	{
		return (
			<Root services={this.services} />
		);
	}
}

App.propTypes =
{
	services: PropTypes.object
};

export default App;
