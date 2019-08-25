import React from 'react';
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import Web3 from 'web3'
import Button from '@material-ui/core/Button';

import Account from './Account'
import { Input } from '@material-ui/core';

const ensLogin = require("ens-login-sdk");

const StyledInput = styled(Input)`
  margin-right: 20px;
  width: 200px;
`;

const UI = {
  Container: styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 0 auto;
    width: 100%;
    padding: 1em;
  `,
  FormContainer: styled.form`
    position: relative;
    top: 7px;
    left: 9px;
  `,
  AccountModal: styled.div`
    display: flex;
    flex-direction: column;
    width: 100px;
    justify-content: center;
  `,
  ImageContainer: styled.div`
    display: flex;
    flex-direction: row;
  `,
  MainContainer: styled.div`
    display: flex;
  `,
  AccountSections: styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 2px;
  `,
  StyledEns: styled.img`
    width: 25px;
  `,
  StyledIcon: styled.img`
    width: 45px;
    height: 45px;
    align-self: center;
    margin-bottom: -20px;
    position: relative;
    top: -11px;
    left: 8px;
  `,
  StyledButton: styled.div`
    margin: 5px 15px 0 0;
  `
 }

const StyledButton = styled(Button)`
  border-radius: 2px;
  border-style: solid;
  border-color: #4F7CE8;
  color: white;
  height: 32px;
  box-shadow: 0 3px 5px 2px #4F7CE8;
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

  renderAccount() {
    return (
      <Account web3={this.state.web3} account={this.state.account} /> 
    )
  }

  renderForm() {
    return (
      <UI.FormContainer>
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
      </UI.FormContainer>
    )
  }

  renderContents() {
    if (this.state.isCurrentProvider) {
      return this.renderAccount()
    } else {
      return this.renderForm()
    }
  }

  render() {
    const cachedEnsName = window.sessionStorage.getItem('cachedEnsName')
    const isLoggedIn = this.state.isCurrentProvider
    return (
      <UI.Container>
        { isLoggedIn ? (
            <UI.StyledButton>
              <StyledButton onClick={this.handleLogout}>Log Out</StyledButton>
            </UI.StyledButton>
          ) : (
            null
          )
        }
        <UI.ImageContainer>
          <UI.StyledEns src="../left.png" alt="Left" />
            {this.renderContents()}
          <UI.StyledEns src="../right.png" alt="Right" />
        </UI.ImageContainer>
        { cachedEnsName ? (
            <UI.StyledIcon src="../authereum.png" alt="Authereum" />
          ) : (
            null
          )
        }
      </UI.Container>
    )

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

  handleLogout= () => {
    return this.logout()
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
