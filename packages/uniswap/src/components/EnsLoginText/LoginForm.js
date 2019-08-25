import React from 'react';
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import Web3 from 'web3'

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

    let web3
    if (this.props.provider) {
      web3 = new Web3(this.props.provider)
    }

    const cachedEnsName = window.sessionStorage.getItem('cachedEnsName')

    this.state = {
      web3: web3,
      ensName: cachedEnsName ? cachedEnsName : '',
      isCurrentProvider: !!this.props.provider,
      account: null
      // balance: null
    }

    this.fetchAccount()
    if (cachedEnsName) {
      this.handleAddressChangeDebounce()
    }
  }

  async fetchAccount() {
    const web3 = this.state.web3

    const callback = (err, accounts) => {
      if (err) {
        console.error(err)
        return
      }
      this.setState({ account: accounts[0] })
    }

    if (web3) {
      const accounts = await web3.eth.getAccounts(callback)
      console.log('accounts: ', accounts)
      if (!accounts) return
      this.setState({ account: accounts[0] })
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
      const cachedEnsName = window.sessionStorage.getItem('cachedEnsName')
      console.log('cachedEnsName: ', cachedEnsName)
      const provider = await ensLogin.connect(this.state.ensName, config)
      if (provider && this.state.ensName.includes('authereum')) {
        window.sessionStorage.setItem('cachedEnsName', this.state.ensName)
      }
      const web3 = new Web3(provider)
      window.ensLoginProvider = provider
      this.props.providerCallback(provider)

      this.setState({ web3 })

      let isProvider = await this.getProvider(this.state.web3)
      try {
        console.log('1', this.state.web3.eth)
        await this.state.web3.currentProvider.enable()//.then(console.log).catch(console.error);
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
    } catch (err) {
      console.error('LoginForm Error: ', err)
    }
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
