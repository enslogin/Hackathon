import React from 'react';
import styled from 'styled-components'
import debounce from 'lodash/debounce'

const ensLogin = require("../../node_modules/ENSLogin/lib/enslogin.js");

const UI = {
  Container: styled.div`
    margin: 0 auto;
    width: 400px;
    padding: 1em;
  `,
  FormContainer: styled.div`
    height: 3.5em;
    margin-bottom: 0.5em;
  `,
  Subtext: styled.div`
    margin-top: 0.6em;
    font-size: 0.6em;
    color: gray;
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



  render() {
    return (
      <UI.Container>
        <UI.FormContainer>
          <form
            className="form"
            onSubmit={this.handleSubmit}>
              {!this.state.isCurrentProvider ? 
                <input
                  type="text"
                  value={this.state.ensName}
                  placeholder="ENS Name"
                  onChange={this.handleInputChange}
                  className="form-control"
                />
              : <div> 
                  goBack
                </div>
              }
          </form>
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
