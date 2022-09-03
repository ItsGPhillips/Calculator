import type { NextPage } from 'next'
import Head from 'next/head'
import styled, { createGlobalStyle } from 'styled-components'
import Calculator from '../components/calculator'

const GlobalStyles = createGlobalStyle`
  :root {
    --border-radius: 5px;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: 'Rubik', sans-serif;
  }
`
const Main = styled.main`
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Calculator</title>
        <meta name="description" content="calculator app" />
      </Head>
      <GlobalStyles />
      <Main>
        <Calculator />
      </Main>
    </>
  )
}

export default Home
