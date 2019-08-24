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
    width: 100px;
    justify-content: center;
  `,
  ImageContainer: styled.div`
    display: flex;
    flex-direction: column;
  `,
  MainContainer: styled.div`
    display: flex;
  `,
  AccountSections: styled.div`
    display: flex;
    justify-content: center;
  `,
  StyledEns: styled.img`
    width: 59px;
  `,
  StyledIcon: styled.img`
    width: 45px;
    height: 45px;
    align-self: center;
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
        <UI.ImageContainer>
          <UI.StyledIcon src="../authereum.png" alt="Authereum" />
          <UI.MainContainer>
            <UI.StyledEns src="../left.png" alt="Left" />
            <UI.AccountModal>
              <UI.AccountSections>
                <a href={`https://goerli.etherscan.io/address/${this.props.account}`}>
                  {this.props.account.substring(0,5)}...
                </a>
              </UI.AccountSections>
              <UI.AccountSections>
                {this.props.balance} ETH
              </UI.AccountSections>
              {/* <UI.AccountSections>
                Send
              </UI.AccountSections> */}
              <UI.AccountSections>
                <button onClick={this.handleLogout}>Log Out</button>
              </UI.AccountSections>
            </UI.AccountModal>
            <UI.StyledEns src="../right.png" alt="Right" />
          </UI.MainContainer>
        </UI.ImageContainer>
      </UI.Container>
    );
  }
}

export default Account;
