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
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const { addToast } = useToasts();

  interface InputMaskData {
    mask: number;
    value: number; 
    onChange: () => void;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      nome,
      cpf,
      email,
      endereco: {
        cep,
        rua,
        numero,
        bairro,
        cidade,
      }
    }
    
  await api.post('usuarios', data).then(response => {
    if (response.status === 201) {
      addToast('Saved Successfully', { appearance: 'success' });
      setNome('');
      setEmail('');
      setCpf('');
      setCep('');
      setRua('');
      setNumero('');
      setBairro('');
      setCidade('');
      history.push('/');
    }
  }).catch(error => {
    addToast(error.message, { appearance: 'error' });
  });
  }

  useEffect(() => {
    const regex = /[0-9]{5}-[0-9]{3}/
    const isValidCep = regex.test(cep)
    if(isValidCep){
      viaCep.get(`${cep}/json`).then(response => {
        if (response.status === 200) {
        setRua(response.data.logradouro);
        setBairro(response.data.bairro);
        setCidade(response.data.localidade);
        numberInput.current?.focus();
        }
      })
    }
  }, [cep]);

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Input required
          fluid label='Nome'
          placeholder='Nome Completo'
          value={nome}
          onChange={event => setNome(event.target.value)}
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
            value={rua}
            onChange={event => setRua(event.target.value)}
            width={12}
          />
          <div className="required four wide field">
            <label>Número</label>
            <div className="ui input">
              <input 
                required 
                type="text"
                value={numero}
                ref={numberInput}
                placeholder='Número'
                onChange={event => setNumero(event.target.value)}
                width={4}
              />
            </div>
          </div>
        </Form.Group>
        <Form.Group widths={2}>
          <Form.Input
            label='Bairro' 
            placeholder='Bairro'
            value={bairro}
            onChange={event => setBairro(event.target.value)}
          />
          <Form.Input
            label='Cidade'
            placeholder='Cidade'
            value={cidade}
            onChange={event => setCidade(event.target.value)}
          />
        </Form.Group>
        <Button>Salvar</Button>
      </Form>
    </Segment>
  );
}

export default FormUser;