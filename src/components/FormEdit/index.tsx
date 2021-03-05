import { FormEvent, useEffect, useState, useRef } from 'react';
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
  value: string; 
  onChange: () => void;
}

function FormEdit() {
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const [user, setUser] = useState({
    nome: '',
    cpf: '',
    email: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: ''
    }
  });
  const { addToast } = useToasts();
  const numberInput = useRef<HTMLInputElement>(null);


  useEffect(() => {
    api.get(`/usuarios/${id}`).then(response => {
      setUser(user => ({
        ...user,
        nome: (response.data.nome),
        email: (response.data.email),
        cpf: (response.data.cpf),
        endereco: {
        ...user.endereco,
          cep: (response.data.endereco.cep),
          rua: (response.data.endereco.rua),
          numero: (response.data.endereco.numero),
          bairro: (response.data.endereco.bairro),
          cidade: (response.data.endereco.cidade),
        }
      }))
    })
  }, [id]);

  useEffect(() => {
    const regex = /[0-9]{5}-[0-9]{3}/
    const isValidCep = regex.test(user.endereco.cep)
    if(isValidCep){
      viaCep.get(`${user.endereco.cep}/json`).then(response => {
        if (response.status === 200 && !response.data.erro) {
          setUser(user => ({
            ...user,
            endereco: {
              ...user.endereco,
              rua: response.data.logradouro,
              bairro: response.data.bairro,
              cidade: response.data.localidade,
            }
          }))
        numberInput.current?.focus();
        } else {
          addToast('Cep inválido', { appearance: 'error' });
        }
      })
    }
  }, [addToast, user.endereco.cep]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

      await api.patch(`usuarios/${id}`, user).then(response => {
        if (response.status === 200) {
        addToast('Atualizado com Sucesso', { appearance: 'success' });
        history.push('/');
        }
      }).catch(error => {
        addToast(error.message, { appearance: 'error' });
      });
    }

    const handleChange = (input: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (input === 'endereco') {
        setUser(user => ({
          ...user,
          endereco: {...user.endereco, [event.target.name]: event.target.value}
        }))
      } else {
        setUser( user => ({
          ...user,
          [event.target.name]: event.target.value
        }))
      }
    }

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Input required
          name='nome'
          fluid label='Nome'
          placeholder='Nome Completo'
          value={user.nome}
          onChange={handleChange('')}
        />
        <InputMask
          name='cpf'
          mask='999.999.999-99'
          value={user.cpf}
          onChange={handleChange('')}
        >
          {(inputProps: InputMaskData) => 
            <Form.Input {...inputProps}
            required
            fluid label='CPF'
            placeholder='CPF'
            />}
        </InputMask>
        <Form.Input required
          name='email'
          type="email"
          fluid label='E-mail'
          placeholder='E-mail'
          value={user.email}
          onChange={handleChange('')}
        />
        <InputMask 
          name='cep'
          mask="99999-999" 
          value={user.endereco.cep} 
          onChange={handleChange('endereco')}
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
            name='endereco'
            required
            label='Endereço' 
            placeholder='Endereço'
            value={user.endereco.rua}
            onChange={handleChange('endereco')}
            width={12}
          />
          <Form.Input
            name='numero'
            required
            label='Número' 
            placeholder='Número'
            value={user.endereco.numero}
            onChange={handleChange('endereco')}
            width={12}
            input={{ ref: numberInput }}
          />
        </Form.Group>
        <Form.Group widths={2}>
          <Form.Input
            name='bairro'
            required
            label='Bairro' 
            placeholder='Bairro'
            value={user.endereco.bairro}
            onChange={handleChange('endereco')}
          />
          <Form.Input
            name='cidade'
            required
            label='Cidade'
            placeholder='Cidade'
            value={user.endereco.cidade}
            onChange={handleChange('endereco')}
          />
        </Form.Group>
        <Button>Salvar</Button>
      </Form>
    </Segment>
  );
};

export default FormEdit;