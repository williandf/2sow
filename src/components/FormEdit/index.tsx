import { FormEvent, useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../services/api';

interface RouteParams {
  id: string;
}

function FormEdit() {
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');


  useEffect(() => {
    api.get(`/usuarios/${id}`).then(response => {
      setName(response.data.name);
      setEmail(response.data.email);
      setCpf(response.data.cpf);
      setCep(response.data.cep);
      setStreet(response.data.street);
      setNumber(response.data.number);
      setDistrict(response.data.district);
      setCity(response.data.city);
    })
  }, [id]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      name,
      cpf,
      email,
      address: {
        cep,
        street,
        number,
        district,
        city,
      }
    }
      await api.patch(`usuarios/${id}`, data).then(response => {
        if (response.status === 204) {
        alert('Atualizado Com Sucesso');
        history.push('/');
        }
      }).catch(error => {
        alert(`${error.response.data.message}`);
      });
    }

  return (
    <section>
      <form onSubmit={handleSubmit}>
      <div>
          <label>Nome:</label>
          <input 
            type="text" 
            value={name} 
            placeholder="Nome"
            onChange={event => setName(event.target.value)}
          />
        </div>
        <div>
          <label>CPF:</label>
          <InputMask 
            mask="999.999.999-99" 
            value={cpf}
            onChange={event => setCpf(event.target.value)}
            placeholder="CPF"
          />
        </div>
        <div>
          <label>E-mail:</label>
          <input 
            type="email" 
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="E-mail"
          />
        </div>
        <div>
          <label>Endereço</label>
          <InputMask 
            mask="99999-999" 
            value={cep} 
            onChange={event => setCep(event.target.value)}
            placeholder="CEP" 
          />
          <input 
            type="text" 
            value={street}
            onChange={event => setStreet(event.target.value)}
            placeholder="Endereço"
          />
          <input 
            type="number" 
            value={number}
            onChange={event => setNumber(event.target.value)}
            placeholder="Número"
          />
          <input 
            type="text" 
            value={district}
            onChange={event => setDistrict(event.target.value)}
            placeholder="Bairro"
          />
          <input 
            type="text"
            value={city}
            onChange={event => setCity(event.target.value)}
            placeholder="Cidade"
          />
        </div>
        <button>Salvar</button>
      </form>
    </section>
  );
};

export default FormEdit;