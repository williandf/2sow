import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Modal } from 'semantic-ui-react'
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';

import FormUser from '../../components/Form';


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
          alert('Dados excluidos com sucesso');
        }
      });
    } catch (err) {
      alert('Erro ao deletar dados, tente novamente.');
    }
  }

  function handleEditData(id: string) {
    history.push(`/usuarios/${id}`);
  }
  
  return (
    <main>
      {showData.map((showData) => {
        return (
          <div key={showData.id}>
            <div>
              <EditIcon className="editIcon" onClick={() => handleEditData(showData.id)} type="button"/>
              <ClearIcon className="clearIcon" onClick={() => handleDeleteData(showData.id)} type='button'/>
            </div>
            <div>
              <p>Dados</p>
            </div>
            <div>
              <p>{[showData.name]}</p>
            </div>
            <div>
              <p>{[showData.cpf]}</p>
            </div>
            <div>
              <p>{[showData.email]}</p>
            </div>
            <div>
              <p>Endereço</p>
              <p>{[showData.address.cep]}</p>
              <p>{[showData.address.street]}</p>
              <p>{[showData.address.number]}</p>
              <p>{[showData.address.district]}</p>
              <p>{[showData.address.city]}</p>
            </div>
            </div>
        )})}
    </main>
  )
}

export default Main;