import { FormEvent, useEffect, useState } from 'react';
import { Form, Segment, Button } from 'semantic-ui-react'
import InputMask from 'react-input-mask';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import api from '../../services/api';
import viaCep from '../../services/viaCep';


interface RouteParams {
  id: string;
}

interface InputMaskData {
  mask: number;
  value: number; 
  onChange: () => void;
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
  const { addToast } = useToasts();


  useEffect(() => {
    api.get(`/usuarios/${id}`).then(response => {
      setName(response.data.name);
      setEmail(response.data.email);
      setCpf(response.data.cpf);
      setCep(response.data.address.cep);
      setStreet(response.data.address.street);
      setNumber(response.data.address.number);
      setDistrict(response.data.address.district);
      setCity(response.data.address.city);
    })
  }, [id]);

  useEffect(() => {
    viaCep.get(`${cep}/json`).then(response => {
      if (response.status === 200) {
      setStreet(response.data.logradouro);
      setDistrict(response.data.bairro);
      setCity(response.data.localidade);
      //numberInput.current?.focus();
      }
    })
  }, [cep]);

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
        if (response.status === 200) {
        addToast('Atualizado com Sucesso', { appearance: 'success' });
        history.push('/');
        }
      }).catch(error => {
        addToast(error.message, { appearance: 'error' });
      });
    }

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Input required
          fluid label='Nome'
          placeholder='Nome Completo'
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <InputMask
          mask='999.999.999-99'
          value={cpf}
          onChange={event => setCpf(event.target.value)}
        >
          {(inputProps: InputMaskData) => 
            <Form.Input {...inputProps}
            required
            fluid label='CPF'
            placeholder='CPF'
            />}
        </InputMask>
        <Form.Input required
          type="email"
          fluid label='E-mail'
          placeholder='E-mail'
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <InputMask 
          mask="99999-999" 
          value={cep} 
          onChange={event => setCep(event.target.value)}
          >
          {(inputProps: InputMaskData) => 
            <Form.Input {...inputProps} 
              required 
              fluid label='CEP' 
              placeholder='CEP' 
        />}
        </InputMask>
        <Form.Group>
          <Form.Input 
            label='Endereço' 
            placeholder='Endereço'
            value={street}
            onChange={event => setStreet(event.target.value)}
            width={12}
          />
          <Form.Input
            required
            label='Número'
            placeholder='Número'
            value={number}
            // ref={numberInput}
            onChange={event => setNumber(event.target.value)}
            width={4}
          />
        </Form.Group>
        <Form.Group widths={2}>
          <Form.Input
            label='Bairro' 
            placeholder='Bairro'
            value={district}
            onChange={event => setDistrict(event.target.value)}
          />
          <Form.Input
            label='Cidade'
            placeholder='Cidade'
            value={city}
            onChange={event => setCity(event.target.value)}
          />
        </Form.Group>
        <Button>Salvar</Button>
      </Form>
    </Segment>
  );
};

export default FormEdit;