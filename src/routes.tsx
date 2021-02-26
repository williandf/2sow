import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ToastProvider } from "react-toast-notifications";

import GlobalStyle from './styles/global';
import Home from './pages/Home';
import Register from './pages/Register';
import Edit from './pages/Edit';

function Routes() {
  return (
    <ToastProvider>
      <BrowserRouter>
      <GlobalStyle />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/usuarios/:id" exact component={Edit} />
          <Route path="/add" exact component={Register} />
        </Switch>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default Routes;