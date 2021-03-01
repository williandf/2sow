import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import { useToasts } from 'react-toast-notifications';
import { Table, Input, Segment } from 'semantic-ui-react';

import Header from '../../components/Header';

import api from '../../services/api';

interface Data {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
  }
}

function Home() {
  const [showData, setShowData] = useState<Data[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToasts();
  const history = useHistory();

  useEffect(() => {
    api.get(`usuarios?nome_like=${searchTerm}`).then(response => {
      setShowData(response.data);
    });
  }, [searchTerm]);

  async function handleDeleteData(id: string) {
    try {
      await api.delete(`usuarios/${id}`).then(response => {
        if (response.status === 200) {
          history.push('/');
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
          <Table.Cell>{[showData.nome]}</Table.Cell>
          <Table.Cell>{[showData.cpf]}</Table.Cell>
          <Table.Cell>{[showData.email]}</Table.Cell>
          <Table.Cell>{[showData.endereco.cidade]}</Table.Cell>
          <Table.Cell textAlign='center'>{<EditIcon className="editIcon" onClick={() => handleEditData(showData.id)} type="button"/>}</Table.Cell>
          <Table.Cell textAlign='center'>{<ClearIcon className="clearIcon" onClick={() => handleDeleteData(showData.id)} type='button'/>}</Table.Cell>
        </Table.Row>
      </Table.Body>
      )})}
    </Table>
    </>
  )
}

export default Home;