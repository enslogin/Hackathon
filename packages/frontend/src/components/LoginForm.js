import React from 'react';
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import Web3 from 'web3'

import Account from './Account'

const ensLogin = require("../../node_modules/ens-login-sdk/lib/enslogin.js");

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
      web3: undefined,
      ensName: '',
      isCurrentProvider: false,
      account: '',
      balance: null
    }
  }

  logout = () => {
    this.setState({
      web3: undefined,
      ensName: '',
      isCurrentProvider: false,
      account: ''
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
                <Account logout={this.logout} web3={this.state.web3} account={this.state.account} balance={this.state.balance} />
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
        network: 'ropsten',
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
      let web3 = new Web3(await ensLogin.connect(this.state.ensName, config))

      this.setState({ web3 })

      let isProvider = await this.getProvider(this.state.web3)
      try {
        await this.state.web3.currentProvider.enable().then(console.log).catch(console.error);
        let accounts = await this.state.web3.eth.getAccounts()
        let balance = await this.state.web3.eth.getBalance(accounts[0])
        this.setState({
          account: accounts[0],
          balance: Math.round(this.state.web3.utils.fromWei(balance) * 1000) / 1000,
          isCurrentProvider: isProvider
        })
      } catch (e) {}
    } catch (err) {}
  }, 250)

  handleSubmit = async (event) => {
    event.preventDefault()
    const { ensName } = this.state
    console.log(ensName)
  }

  getProvider (web3 = '') {
    try {
      if (web3 && this.state.ensName) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log(e)
    }
    return false
  }
}

export default LoginForm;
