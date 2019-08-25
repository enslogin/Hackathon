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
  '0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6': MKR,
  '0xf8720eb6ad4a530cccb696043a0d10831e2ff60e': CVC,
  '0x4bb57bc8485ec4c4112aa25da4e746f373ad540e': GNT,
  // '0x3fa9fcd9456991fe1220d1bb77a5863695c01c05': OMG,
  // '0x4c7493b70f16bec1e087bf74a31d095f9b8f9c40': REP,
  '0xaD6D458402F60fD3Bd25163575031ACDce07538D': DAI,
  '0xDb0040451F373949A4Be60dcd7b6B8D6E42658B6': BAT
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
