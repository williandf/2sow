import { Redirect, Route} from 'react-router-dom';

import { useAuth} from '../contexts/auth';

interface Props {
  path: string,
  component: React.FC,
  isPrivate?: boolean,
  exact?: boolean,
}

const RouteWrapper: React.FC<Props> = ({
  path, component, isPrivate, exact
}) => {
  const { signed } = useAuth();

  if (isPrivate && !signed) {
    return <Redirect to="/login" />
  }

  if (!isPrivate && signed) {
    return <Redirect to="/" />;
  }

  return <Route path={path} component={component} exact={exact} />;
};

export default RouteWrapper;