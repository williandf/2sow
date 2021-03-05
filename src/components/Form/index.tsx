import { useState, useEffect, FormEvent, useRef } from 'react';
import { Form, Segment, Button } from 'semantic-ui-react'
import { useToasts } from 'react-toast-notifications';
import InputMask from 'react-input-mask';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';
import viaCep from '../../services/viaCep';

function FormUser() {
  const history = useHistory();
  const numberInput = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState({
    nome: '',
    cpf: '',
    email: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
    }
  });
  const { addToast } = useToasts();

  interface InputMaskData {
    mask: number;
    value: number; 
    onChange: () => void;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    
    await api.post('usuarios', user).then(response => {
      if (response.status === 201) {
        addToast('Usuário Cadastrado com Sucesso', { appearance: 'success' });
          setUser({
            nome: '',
            cpf: '',
            email: '',
            endereco: {
              cep: '',
              rua: '',
              numero: '',
              bairro: '',
              cidade: '',
            }
          })
          history.push('/');
        }
      }).catch(error => {
        addToast(error.message, { appearance: 'error' });
      });
    }

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

  const handleChange = (input: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (input === 'endereco') {
      setUser(user => ({
        ...user,
        endereco: {...user.endereco, [event.target.name]: event.target.value}
      }))
    }else {
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
            label='Numero' 
            placeholder='Numero'
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
}

export default FormUser;