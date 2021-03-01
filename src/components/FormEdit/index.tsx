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
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const { addToast } = useToasts();
  const numberInput = useRef<HTMLInputElement>(null);


  useEffect(() => {
    api.get(`/usuarios/${id}`).then(response => {
      setNome(response.data.nome);
      setEmail(response.data.email);
      setCpf(response.data.cpf);
      setCep(response.data.endereco.cep);
      setRua(response.data.endereco.rua);
      setNumero(response.data.endereco.numero);
      setBairro(response.data.endereco.bairro);
      setCidade(response.data.endereco.cidade);
    })
  }, [id]);

  useEffect(() => {
    const regex = /[0-9]{5}-[0-9]{3}/
    const isValidCep = regex.test(cep)
    if(isValidCep){
      viaCep.get(`${cep}/json`).then(response => {
        if (response.status === 200) {
        setRua(response.data.logradouro);
        setBairro(response.data.bairro);
        setCidade(response.data.localidade)
        numberInput.current?.focus();
        }
      })
    }
  }, [cep]);

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
            required
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
                value={numero}
                type="text"
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
            required
            label='Bairro' 
            placeholder='Bairro'
            value={bairro}
            onChange={event => setBairro(event.target.value)}
          />
          <Form.Input
            required
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
};

export default FormEdit;