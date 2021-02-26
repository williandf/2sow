import { useState, useEffect, FormEvent } from 'react';
import { Form, Input, Segment, Button } from 'semantic-ui-react'
import { useToasts } from 'react-toast-notifications';
import InputMask from 'react-input-mask';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';
import viaCep from '../../services/viaCep';

function FormUser() {
  const history = useHistory();
  //const numberInput = createRef<HTMLInputElement | null>();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const { addToast } = useToasts();

  interface InputMaskData {
    mask: number;
    value: number; 
    onChange: () => void;
  }

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
    
  await api.post('usuarios', data).then(response => {
    if (response.status === 201) {
      addToast('Saved Successfully', { appearance: 'success' });
      setName('');
      setEmail('');
      setCpf('');
      setCep('');
      setStreet('');
      setNumber('');
      setDistrict('');
      setCity('');
      history.push('/usuarios');
    }
  }).catch(error => {
    addToast(error.message, { appearance: 'error' });
  });
  }

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
  

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Input required
          fluid label='Nome'
          placeholder='Nome Completo'
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <Input required
          fluid label='CPF'
          placeholder='CPF'
          value={cpf}
          onChange={event => setCpf(event.target.value)}
        />
        <Input required
          type="email"
          fluid label='E-mail'
          placeholder='E-mail'
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <InputMask 
          mask="99999-999" 
          required
          value={cep} 
          onChange={event => setCep(event.target.value)}
          >
          {(inputProps: InputMaskData) => <Input {...inputProps} required fluid label='CEP' placeholder='CEP' />}
        </InputMask>
        <Form.Group>
          <Input 
            label='Endereço' 
            placeholder='Endereço'
            value={street}
            onChange={event => setStreet(event.target.value)}
            width={12}
          />
          <Input
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
          <Input
            label='Bairro' 
            placeholder='Bairro'
            value={district}
            onChange={event => setDistrict(event.target.value)}
          />
          <Input
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
}

export default FormUser;