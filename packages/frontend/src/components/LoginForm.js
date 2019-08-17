import React from 'react';
import styled from 'styled-components'

const UI = {
  Container: styled.div`
    margin: 0 auto;
    width: 400px;
    padding: 1em;
  `
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ensName: ''
    }
  }

  render() {
    return (
      <UI.Container>
        <form
          className="form"
          onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <input
              type="text"
              value={this.state.ensName}
              placeholder="ENS Name"
              onChange={this.handleInputChange}
              className="form-control"
            />
        </div>
        <div className="form-group row">
            <button
              type="submit"
              className="btn btn-primary">Login</button>
        </div>
        </form>
      </UI.Container>
    );
  }

  handleInputChange = async (event) => {
    this.setState({
      ensName: event.target.value
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { ensName } = this.state
    console.log(ensName)
  }
}

export default LoginForm;
