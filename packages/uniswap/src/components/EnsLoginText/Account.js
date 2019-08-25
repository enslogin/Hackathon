import React from 'react';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';

const UI = {
  Container: styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 0 auto;
    width: 100%;
    padding: 1em;
    margin-top: -40px;
    margin-left: -20px;
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
    margin-bottom: 2px;
  `,
  StyledEns: styled.img`
    width: 59px;
  `,
  StyledIcon: styled.img`
    width: 45px;
    height: 45px;
    align-self: center;
    margin-bottom: -20px;
  `
 }

const StyledButton = styled(Button)`
  border-radius: 2px;
  border-style: solid;
  border-color: #4F7CE8;
  color: white;
  height: 32px;
  box-shadow: 0 3px 5px 2px #4F7CE8;
  margin-bottom: 2px;
`;

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
                {console.log("eth")}
                {this.props.account ?
                  (
                    <a href={`https://ropsten.etherscan.io/address/${this.props.account}`}>
                      {this.props.account.substring(0,5)}...
                    </a>
                  ) : (
                    <span>No account</span>
                  )
                
                }
                
              </UI.AccountSections>
              {/* <UI.AccountSections>
                {this.props.balance} ETH
              </UI.AccountSections> */}
              <UI.AccountSections style={{ marginTop: '0.2em' }}>
                <StyledButton onClick={this.handleLogout}>Log Out</StyledButton>
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
