import { Switch} from 'react-router-dom';
import { ToastProvider } from "react-toast-notifications";

import Route from './route';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Edit from '../pages/Edit';
import Register from '../pages/Register';

const Routes: React.FC = () => (
  <ToastProvider>
    <Switch>
      <Route path="/" component={Home} exact isPrivate />
      <Route path="/usuarios/:id" exact component={Edit} isPrivate />
      <Route path="/add" exact component={Register} isPrivate/>
      <Route path="/login" component={Login} />
      <Route path="*" component={Login} />
    </Switch>
  </ToastProvider>
);

export default Routes;