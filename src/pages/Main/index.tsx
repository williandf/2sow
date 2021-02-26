import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import { useToasts } from 'react-toast-notifications';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';

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

interface Props {
  data: Data[];
  getData: () => Promise<void>;
}

function Main({ data, getData }: Props) {
  const [showData, setShowData] = useState<Data[]>([]);
  const { addToast } = useToasts();
  const history = useHistory();

  useEffect(() => {
    api.get('usuarios').then(response => {
      setShowData(response.data);
    });
  }, [showData]);



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
  
  return (
    <>
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
      <Table.Body>
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
    </Table>
    </>
  )
}

export default Main;