import React from 'react'
import styled from 'styled-components'

import { Link } from '../../theme'
import Web3Status from '../Web3Status'
import { darken } from 'polished'

const HeaderElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const Title = styled.div`
  display: flex;
  align-items: center;

  #image {
    font-size: 1.5rem;
    margin-right: 1rem;
  }

  #link {
    text-decoration-color: ${({ theme }) => theme.wisteriaPurple};
  }

  #title {
    display: inline;
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.wisteriaPurple};
    :hover {
      color: ${({ theme }) => darken(0.2, theme.wisteriaPurple)};
    }
  }
`

const Subtitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.5rem;
  color: ${({ theme }) => theme.wisteriaPurple};
  justify-content: flex-end;
`

export default function Header() {
  return (
    <>
      <HeaderElement>
        <Title>
          <span id="image" role="img" aria-label="Unicorn Emoji">
            🦄
          </span>

          <TitleContainer>
            <Link id="link" href="https://uniswap.io">
              <h1 id="title">Uniswap</h1>
            </Link>
            <Subtitle>
              RINKEBY
            </Subtitle>
          </TitleContainer>
        </Title>
      </HeaderElement>

      <HeaderElement>
        <Web3Status />
      </HeaderElement>
    </>
  )
}
