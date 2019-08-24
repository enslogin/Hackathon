import React from 'react';
import styled from 'styled-components'

const UI = {
  Container: styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 0 auto;
    width: 100%;
    padding: 1em;
  `,
  AccountModal: styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 2px;
    width: 100px;
  `,
  AccountSections: styled.div`
    display: flex;
    justify-content: center;
  `
 }

class Account extends React.Component {
  constructor(props) {
    super(props)
  }

  handleLogout= () => {
    return this.props.logout()
  }

  render() {
    return (
      <UI.Container>
        <UI.AccountModal>
          <UI.AccountSections>
            <a href={`https://etherscan.io/tx/0x0000000000000000000000000000000000000000`}>
              0x123...
            </a>
          </UI.AccountSections>
          <UI.AccountSections>
            0.1 ETH
          </UI.AccountSections>
          {/* <UI.AccountSections>
            Send
          </UI.AccountSections> */}
          <UI.AccountSections>
            <button onClick={this.handleLogout}>Redirect</button>
          </UI.AccountSections>
        </UI.AccountModal>
      </UI.Container>
    );
  }
}

export default Account;
