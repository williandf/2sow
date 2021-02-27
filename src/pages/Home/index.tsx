import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import { useToasts } from 'react-toast-notifications';
import { Table, Input, Menu, Icon, Segment } from 'semantic-ui-react';

import Header from '../../components/Header';

import api from '../../services/api';

interface Data {
  id: string;
  name: string;
  cpf: string;
  email: string;
  address: {
    cep: string;
    street: string;
    number: string;
    district: string;
    city: string;
  }
}

function Home() {
  const [showData, setShowData] = useState<Data[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToasts();
  const history = useHistory();

  useEffect(() => {
    api.get(`usuarios?q=${searchTerm}`).then(response => {
      setShowData(response.data);
    });
  }, [searchTerm]);

  async function handleDeleteData(id: string) {
    try {
      await api.delete(`usuarios/${id}`).then(response => {
        if (response.status === 200) {
          addToast('Usuário Excluido Com Sucesso', { appearance: 'success' });
        }
      });
    } catch (err) {
      addToast('Erro ao deletar usuário', { appearance: 'error' });
    }
  }

  function handleEditData(id: string) {
    history.push(`/usuarios/${id}`);
  }

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value)
  }
  
  return (
    <>
    <Header />
    <Segment basic textAlign='right'>
        <Input 
          icon='search' 
          placeholder='Search...'
          value={searchTerm}
          onChange={handleChange}
        />
    </Segment>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Nome</Table.HeaderCell>
          <Table.HeaderCell>CPF</Table.HeaderCell>
          <Table.HeaderCell>E-mail</Table.HeaderCell>
          <Table.HeaderCell>Cidade</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Editar</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Deletar</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {showData.map((showData) => {
        return (
      <Table.Body key={showData.id}>
        <Table.Row>
          <Table.Cell>{[showData.name]}</Table.Cell>
          <Table.Cell>{[showData.cpf]}</Table.Cell>
          <Table.Cell>{[showData.email]}</Table.Cell>
          <Table.Cell>{[showData.address.city]}</Table.Cell>
          <Table.Cell textAlign='center'>{<EditIcon className="editIcon" onClick={() => handleEditData(showData.id)} type="button"/>}</Table.Cell>
          <Table.Cell textAlign='center'>{<ClearIcon className="clearIcon" onClick={() => handleDeleteData(showData.id)} type='button'/>}</Table.Cell>
        </Table.Row>
      </Table.Body>
      )})}
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan='6'>
            <Menu floated='right' pagination>
              <Menu.Item as='a' icon>
                <Icon name='chevron left' />
              </Menu.Item>
              <Menu.Item as='a'>1</Menu.Item>
              <Menu.Item as='a'>2</Menu.Item>
              <Menu.Item as='a'>3</Menu.Item>
              <Menu.Item as='a'>4</Menu.Item>
              <Menu.Item as='a' icon>
                <Icon name='chevron right' />
              </Menu.Item>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
    </>
  )
}

export default Home;