import { Menu } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'

function Header() {
  const history = useHistory();

  function goToHome() {
  history.push('/');
  }

  function goToAddUser() {
    history.push('/add');
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
        >
          Log Out
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

export default Header;