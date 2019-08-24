import React, { useState } from 'react'
import styled from 'styled-components'

import { ReactComponent as EthereumLogo } from '../../assets/images/ethereum-logo.svg'

import BAT from '../../assets/images/tokens/BAT.png'
import CVC from '../../assets/images/tokens/CVC.png'
import GNT from '../../assets/images/tokens/GNT.png'
import OMG from '../../assets/images/tokens/OMG.png'
import REP from '../../assets/images/tokens/REP.png'
import DAI from '../../assets/images/tokens/DAI.png'
import MKR from '../../assets/images/tokens/MKR.png'

const TOKEN_ICON_API = 'https://raw.githubusercontent.com/TrustWallet/tokens/master/tokens'
const BAD_IMAGES = {}

// TODO: find real icons
const kovanIcons = {
  '0xac94ea989f6955c67200dd67f0101e1865a560ea': MKR,
  '0xf8720eb6ad4a530cccb696043a0d10831e2ff60e': CVC,
  '0x4bb57bc8485ec4c4112aa25da4e746f373ad540e': GNT,
  // '0x3fa9fcd9456991fe1220d1bb77a5863695c01c05': OMG,
  // '0x4c7493b70f16bec1e087bf74a31d095f9b8f9c40': REP,
  '0xc4375b7de8af5a38a93548eb8453a498222c4ff2': DAI,
  '0x02f96ef85cad6639500ca1cc8356f0b5ca5bf1d2': BAT
}

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 1rem;
`

const Emoji = styled.span`
  width: ${({ size }) => size};
  font-size: ${({ size }) => size};
`

const StyledEthereumLogo = styled(EthereumLogo)`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function TokenLogo({ address, size = '1rem', ...rest }) {
  const [error, setError] = useState(false)

  let path = ''
  if (address === 'ETH') {
    return <StyledEthereumLogo size={size} />
  } else if (!error && !BAD_IMAGES[address]) {
    console.log('in')
    path = kovanIcons[address]
  } else {
    return (
      <Emoji {...rest}>
        <span role="img" aria-label="Thinking">
            {kovanIcons[address] || '🤔'}
        </span>
      </Emoji>
    )
  }

  return (
    <Image
      {...rest}
      alt={address}
      src={path}
      size={size}
      onError={() => {
        BAD_IMAGES[address] = true
        setError(true)
      }}
    />
  )
}
