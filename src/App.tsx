import { BrowserRouter } from 'react-router-dom';

import GlobalStyle from './styles/global';
import AuthProvider from './contexts/auth';
import Routes from './routes';

const src: React.FC = () => (
  <>
    <AuthProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </AuthProvider>
    <GlobalStyle />
  </>
);

export default src;
