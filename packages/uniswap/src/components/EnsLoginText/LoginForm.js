import React from 'react';
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import Web3 from 'web3'

import { useWeb3Context, Connectors } from 'web3-react'
import Account from './Account'
import { Input } from '@material-ui/core';

const ensLogin = require("ens-login-sdk");

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

const StyledInput = styled(Input)`
  margin-right: 20px;
`;

export class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: undefined,
      ensName: '',
      isCurrentProvider: false,
      account: useWeb3Context.account
      // balance: null
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
                  <StyledInput
                    type="text"
                    value={this.state.ensName}
                    placeholder="ENS Name"
                    onChange={this.handleInputChange}
                    className="form-control"
                    />

                  {/* <input
                    type="text"
                    value={this.state.ensName}
                    placeholder="ENS Name"
                    onChange={this.handleInputChange}
                    className="form-control"
                  /> */}
            </form>
            : <div>
                <Account logout={this.logout} web3={this.state.web3} account={this.state.account} /> 
                {/* balance={this.state.balance} /> */}
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

  delay = async (delayInms) => {
    return new Promise(resolve  => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
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
      // let web3 = new Web3(window.web3.currentProvider)
      let web3 = new Web3(await ensLogin.connect(this.state.ensName, config))

      this.setState({ web3 })

      let isProvider = await this.getProvider(this.state.web3)
      try {
        console.log('1', this.state.web3.eth)
        await this.state.web3.currentProvider.enable().then(console.log).catch(console.error);
        // let accounts = await this.state.web3.eth.getAccounts()

        let userAccount
        this.state.web3.eth.getAccounts(function(error, result){
          if(!error)
              userAccount = result[0]
          else
              console.log("Error")
        })
        await this.delay(1000)
        // let balance;
        // this.state.web3.eth.getBalance(userAccount, function(error, result){
        //   if(!error)
        //       balance = result
        //   else
        //       console.log("THERE")
        // })
        // await this.delay(1000)
        // console.log('3', balance)

        // let simpleBalance
        // console.log("W# =", this.state.web3)
        // this.state.web3.fromWei(balance, function(error, result){
        //   if(!error)
        //      simpleBalance = result
        //   else
        //       console.log("THERE")
        //   })
        // await this.delay(1000)
        // console.log('4', simpleBalance)
        this.setState({
          account: userAccount,
          // balance: Math.round(this.state.web3.utils.fromWei(balance) * 1000) / 1000,
          isCurrentProvider: isProvider
        })
      } catch (e) {console.log("EEEE", e)}
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

// export default LoginForm;
