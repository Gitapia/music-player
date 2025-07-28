import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }

  h1 { font-size: ${({ theme }) => theme.fontSizes.xxlarge}; }
  h2 { font-size: ${({ theme }) => theme.fontSizes.xlarge}; }
  h3 { font-size: ${({ theme }) => theme.fontSizes.large}; }
  h4 { font-size: ${({ theme }) => theme.fontSizes.medium}; }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primaryLight};
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
    color: inherit;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.backgroundLighter};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textDisabled};
    border-radius: ${({ theme }) => theme.borderRadius.small};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export default GlobalStyles;