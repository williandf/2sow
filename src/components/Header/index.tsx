import { Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { useAuth} from '../../contexts/auth';

const Header: React.FC = () => {
  const history = useHistory();
  const { signIn } = useAuth();

  function goToHome() {
  history.push('/');
  }

  function goToAddUser() {
    history.push('/add');
    }
  
    function logOut() {
      signIn(null);
    }

  return (
    <Menu stackable>
      <Menu.Item
        onClick={goToHome}
      >
        Home
      </Menu.Item>
      <Menu.Item
        onClick={goToAddUser}
      >
        Cadastrar Usuário
      </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item
          onClick={logOut}
        >
          Log Out
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

export default Header;