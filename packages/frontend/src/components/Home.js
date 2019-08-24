import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import LoginForm from './LoginForm'

class Home extends React.Component {
  render () {
    return (
      <Router>
        <Route path="/" exact={true} component={LoginForm} />
      </Router>
    );
  }
}

export default Home;
