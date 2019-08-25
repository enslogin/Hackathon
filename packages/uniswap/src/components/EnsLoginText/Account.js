import React from 'react';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';

const UI = {
  // Container: styled.div`
  //   display: flex;
  //   justify-content: flex-end;
  //   margin: 0 auto;
  //   width: 100%;
  //   padding: 1em;
  //   margin-top: -40px;
  //   margin-left: -20px;
  // `,
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
    width: 200px;
  `,
  AccountSections: styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 2px;
  `,
  StyledLink: styled.div`
    width: 200px;
    position: relative;
    left: 50px;
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

  render() {
    return (
      <>
        <UI.MainContainer>
          <UI.AccountModal>
            <UI.AccountSections>
              {console.log("eth")}
              {this.props.account ?
                (
                  <UI.StyledLink>
                    <a href={`https://ropsten.etherscan.io/address/${this.props.account}`}>
                      {this.props.account.substring(0,15)}...
                    </a>
                  </UI.StyledLink>
                ) : (
                  <span>No account</span>
                )
              
              }
              
            </UI.AccountSections>
            {/* <UI.AccountSections>
              {this.props.balance} ETH
            </UI.AccountSections> */}
          </UI.AccountModal>
        </UI.MainContainer>
      </>
    );
  }
}

export default Account;
