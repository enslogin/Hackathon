import React, { useReducer, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useWeb3Context, Connectors } from 'web3-react'
import { darken, transparentize } from 'polished'
import Jazzicon from 'jazzicon'
import { ethers } from 'ethers'
import { Activity, ArrowRight } from 'react-feather'

import { shortenAddress } from '../../utils'
import { useENSName } from '../../hooks'
import WalletModal from '../WalletModal'
import { useAllTransactions } from '../../contexts/Transactions'
import { Spinner, Link } from '../../theme'
import Circle from '../../assets/images/circle.svg'
import { LoginForm } from '../../components/EnsLoginText/LoginForm'

const { Connector } = Connectors

const Web3StatusGeneric = styled.button`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  font-size: 0.9rem;
  align-items: center;
  padding: 0.5rem;
  border-radius: 2rem;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const ConnectContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const LogoutText = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  font-size: 0.4rem;
`
const LoginColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.salmonRed};
  color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.salmonRed};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.salmonRed)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.royalBlue};
  color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.royalBlue};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.royalBlue)};
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)`
  background-color: ${({ pending, theme }) => (pending ? theme.zumthorBlue : theme.white)};
  color: ${({ pending, theme }) => (pending ? theme.royalBlue : theme.doveGray)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.royalBlue : theme.mercuryGray)};
  font-weight: 400;
  :hover {
    background-color: ${({ pending, theme }) =>
      pending ? transparentize(0.9, theme.royalBlue) : transparentize(0.9, theme.mercuryGray)};
  }
  :focus {
    border: 1px solid
      ${({ pending, theme }) => (pending ? darken(0.1, theme.royalBlue) : darken(0.1, theme.mercuryGray))};
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  margin: 0 0.5rem 0 0.25rem;
  font-size: 0.83rem;
`

const Identicon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: ${({ theme }) => theme.silverGray};
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

const ArrowIcon = styled(ArrowRight)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.25rem 0 0.25rem;
`

const walletModalInitialState = {
  open: false,
  error: undefined
}

const WALLET_MODAL_ERROR = 'WALLET_MODAL_ERROR'
const WALLET_MODAL_OPEN = 'WALLET_MODAL_OPEN'
const WALLET_MODAL_OPEN_ERROR = 'WALLET_MODAL_OPEN_ERROR'
const WALLET_MODAL_CLOSE = 'WALLET_MODAL_CLOSE'

function walletModalReducer(state, { type, payload }) {
  switch (type) {
    case WALLET_MODAL_ERROR: {
      const { error } = payload
      return { ...state, error }
    }
    case WALLET_MODAL_OPEN: {
      return { ...state, open: true }
    }
    case WALLET_MODAL_OPEN_ERROR: {
      const { error } = payload || {}
      return { open: true, error }
    }
    case WALLET_MODAL_CLOSE: {
      return { ...state, open: false }
    }
    default: {
      throw Error(`Unexpected action type in walletModalReducer reducer: '${type}'.`)
    }
  }
}

export default function Web3Status() {
  const { t } = useTranslation()
  const { active, account, connectorName, setConnector } = useWeb3Context()

  console.log('active', active)
  console.log('connectorName', connectorName)
  console.log('account', account)

  const ENSName = useENSName(account)

  const allTransactions = useAllTransactions()
  const pending = Object.keys(allTransactions).filter(hash => !allTransactions[hash].receipt)
  const confirmed = Object.keys(allTransactions).filter(hash => allTransactions[hash].receipt)

  const hasPendingTransactions = !!pending.length

  const [{ open: walletModalIsOpen, error: walletModalError }, dispatch] = useReducer(
    walletModalReducer,
    walletModalInitialState
  )
  function setError(error) {
    dispatch({ type: WALLET_MODAL_ERROR, payload: { error } })
  }
  function openWalletModal(error) {
    dispatch({ type: WALLET_MODAL_OPEN, ...(error ? { payload: { error } } : {}) })
  }
  function closeWalletModal() {
    dispatch({ type: WALLET_MODAL_CLOSE })
  }

  // janky logic to detect log{ins,outs}...
  useEffect(() => {
    // if the injected connector is not active...
    const { ethereum } = window
    if (connectorName !== 'Injected') {
      const activateInjected = !!(connectorName === 'Network' && ethereum && ethereum.on && ethereum.removeListener)
      console.log('activateInjected', activateInjected)
      if (activateInjected) {
        function tryToActivateInjected() {
          console.log('trying to activate')
          const library = new ethers.providers.Web3Provider(window.ethereum)
          // if calling enable won't pop an approve modal, then try to activate injected...
          library.listAccounts().then(accounts => {
            console.log('accounts', accounts)
            if (accounts.length >= 1) {
              setConnector('Injected', { suppressAndThrowErrors: true })
                .then(() => {
                  setError()
                })
                .catch(error => {
                  // ...and if the error is that they're on the wrong network, display it, otherwise eat it
                  if (error.code === Connector.errorCodes.UNSUPPORTED_NETWORK) {
                    setError(error)
                  }
                })
            }
          })
        }

        tryToActivateInjected()
        ethereum.on('networkChanged', tryToActivateInjected)
        ethereum.on('accountsChanged', tryToActivateInjected)

        return () => {
          if (ethereum.removeListener) {
            ethereum.removeListener('networkChanged', tryToActivateInjected)
            ethereum.removeListener('accountsChanged', tryToActivateInjected)
          }
        }
      }
    } else {
      // ...poll to check the accounts array, and if it's ever 0 i.e. the user logged out, update the connector
      if (ethereum) {
        const accountPoll = setInterval(() => {
          const library = new ethers.providers.Web3Provider(ethereum)
          library.listAccounts().then(accounts => {
            console.log("ACCOUNTS")
            if (accounts.length === 0) {
              setConnector('Network')
            }
          })
        }, 750)

        return () => {
          clearInterval(accountPoll)
        }
      }
    }
  }, [connectorName, setConnector])

  function onClick() {
    if (walletModalError) {
      console.log('1')
      openWalletModal()
    } else if (connectorName === 'Network' && (window.ethereum || window.web3)) {
      console.log('2')
      setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
        console.log("in", error)
        if (error.code === Connector.errorCodes.UNSUPPORTED_NETWORK) {
          console.log('in')
          setError(error)
        }
      })
    } else {
      console.log('3')
      openWalletModal()
    }
  }

  function handleLogout() {
    // TODO: handle ENS Login logout
    console.log(window.ethereum)
    window.ethereum.logout()
  }

  const ref = useRef()
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = ''
      if (account) {
        ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
      }
    }
  }, [account, walletModalError])

  function getWeb3Status() {
    if (walletModalError) {
      // this is ok because we're guaranteed that the error is a wrong network error
      return (
        <Web3StatusError onClick={onClick}>
          <NetworkIcon />
          <Text>Wrong Network</Text>
        </Web3StatusError>
      )
    } else if (!account) {
      return (
        <LoginColumn>
          <LoginForm />
          <Web3StatusConnect style={{height: '25px', width: '100px', marginTop: "-40px", marginLeft: "90px"}} onClick={onClick}>
            <Text>{t('Connect')}</Text>
            {/* <ArrowIcon /> */}
          </Web3StatusConnect>
        </LoginColumn>
      )
    } else {
      return (
        <ConnectContainer>
          <LoginForm name={'authereum.eth'} />
          <Web3StatusConnect style={{height: '25px', width: '100px', marginTop: "-40px", marginLeft: "90px"}} onClick={handleLogout}></Web3StatusConnect>
            <Text>{t('Logout')}</Text>
            {/* <ArrowIcon />
          </Web3StatusConnect>
          {/* <Web3StatusConnected onClick={onClick} pending={hasPendingTransactions}>
            {hasPendingTransactions && <SpinnerWrapper src={Circle} alt="loader" />}
            <Text>{ENSName || shortenAddress(account)}</Text>
            <Identicon ref={ref} />
          </Web3StatusConnected>
          <LogoutText>
            <Link
              onClick={handleLogout}
            >
              Click to log out
            </Link>
          </LogoutText> */}
        </ConnectContainer>
      )
    }
  }

  return (
    active && (
      <>
        {getWeb3Status()}
        <WalletModal
          isOpen={walletModalIsOpen}
          error={walletModalError}
          onDismiss={closeWalletModal}
          ENSName={ENSName}
          pendingTransactions={pending}
          confirmedTransactions={confirmed}
        />
      </>
    )
  )
}
