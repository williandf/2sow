import { useState, FormEvent } from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { useToasts } from 'react-toast-notifications';

import { useAuth } from '../../contexts/auth';

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const { addToast } = useToasts();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (email === '' || password === '') {
      addToast('Preencha os campos do Login', { appearance: 'error' });
    } else {
      signIn({ login: email });
    }
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh'}} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450}}>
        <Header as='h2' color='teal' textAlign='center'>
          Faça login na sua conta
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input 
              fluid 
              icon='user' 
              iconPosition='left' 
              type='email' 
              placeholder='Endereço de e-mail'
              onChange={event => setEmail(event.target.value)}
            />
            <Form.Input
              fluid
              icon='lock'
              placeholder='Password'
              type='password'
              onChange={event => setPassword(event.target.value)}
            />
            <Button color='teal' fluid size='large' type='submit'>
              Login
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Login;