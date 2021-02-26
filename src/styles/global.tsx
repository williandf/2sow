import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    max-width: 1440px;
    width: 90%;
    margin: 0 auto;
    color: #000;
    background: #fff;
    -webkit-font-smoothing: antialiased !important;
  }
  body html #root {
    height: 100%;
  }
  body, input, button, textarea {
    font: 400 16px Roboto, sans-serif;
  }
  @media (max-width: 588px) { 
    body {
      width:100%;
    }
  }
`;
 
export default GlobalStyle;