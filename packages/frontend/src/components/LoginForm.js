import React from 'react';
import styled from 'styled-components'
import debounce from 'lodash/debounce'

import Account from './Account'

const ensLogin = require("../../node_modules/ENSLogin/lib/enslogin.js");

const UI = {
  Container: styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 0 auto;
    width: 100%;
    padding: 1em;
  `,
  FormContainer: styled.div`
    height: 3.5em;
    margin-bottom: 0.5em;
  `
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ensName: '',
      selectedProviderName: '',
      isCurrentProvider: false
    }
  }

  logout = () => {
    this.setState({
      isCurrentProvider: false
    })
  }

  render() {
    return (
      <UI.Container>
        <UI.FormContainer>
          {!this.state.isCurrentProvider ? 
            <form
              className="form"
              onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    value={this.state.ensName}
                    placeholder="ENS Name"
                    onChange={this.handleInputChange}
                    className="form-control"
                  />
            </form>
            : <div>
                <Account logout={this.logout} />
              </div>
          }
        </UI.FormContainer>
      </UI.Container>
    );
  }

  handleInputChange = async (event) => {
    this.setState({
      ensName: event.target.value
    })
    await this.handleAddressChangeDebounce()
  }

  handleAddressChangeDebounce = debounce(async () => {
    const config = {
      provider:
      {
        appId:   null,
        network: 'goerli',
        anchor:  null,
      },
      ipfs:
      {
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
      },
    }
    try {
      let web3 = await ensLogin.connect(this.state.ensName, config)
      await this.getProvider(web3)
      await web3.enable().then(console.log).catch(console.error);
    } catch (err) {
      await this.getProvider()
    }
  }, 250)

  handleSubmit = async (event) => {
    event.preventDefault()
    const { ensName } = this.state
    console.log(ensName)
  }

  getProvider (web3 = '') {
    try {
      if (web3._metamask && this.state.ensName) {
        this.setState({
          selectedProviderName: "Metamask",
          isCurrentProvider: true
        })
      } else {
        this.setState({
          selectedProviderName: "",
          isCurrentProvider: false
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export default LoginForm;
