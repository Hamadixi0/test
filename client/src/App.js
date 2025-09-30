import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import styled, { ThemeProvider } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Home from './components/Home';
import GameBuilder from './components/GameBuilder';
import GamesList from './components/GamesList';
import GamePlayer from './components/GamePlayer';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const MainContent = styled.main`
  padding-top: 80px; // Account for fixed header
  min-height: calc(100vh - 80px);
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/build" element={<GameBuilder />} />
              <Route path="/games" element={<GamesList />} />
              <Route path="/games/:gameId" element={<GamePlayer />} />
            </Routes>
          </MainContent>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;