import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Container, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import NotFoundPage from './Pages/404';
import Home from './Pages/Home';
import Navigation from './Pages/Navigation';
import pages from './Utils/pages';
import { theme } from './Utils/theme';

function checkLocalStorage() {
  if (!localStorage.getItem("ip")) {
    localStorage.setItem("ip", "127.0.0.1:8080");
  }

  if (!localStorage.getItem("fspeed")) {
    localStorage.setItem("fspeed", "1000");
  }
  if (!localStorage.getItem("mfspeed")) {
    localStorage.setItem("mfspeed", "2500");
  }
}

const MainComponent: FC = () => {
  checkLocalStorage();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Container>
          <Navigation />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFoundPage />} />
            {pages.map((page) => (
              <Route
                key={page.label}
                path={`/${page.link}`}
                element={page.node}
              />
            ))}
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return <MainComponent />;
};

export default App;
