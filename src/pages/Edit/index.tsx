import { Button, Modal } from 'semantic-ui-react';

import FormEdit from '../../components/FormEdit';

function Edit() {
  return (
    <>
    <Modal
      trigger={<Button>Editar Usuário</Button>}
      header='Editar Cadastro'
      content={<FormEdit />}
      actions={['Snooze', { key: 'done', content: 'Fechar', positive: true }]}
    />

    </>
  )
}

export default Edit;