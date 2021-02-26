import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import Main from '../Main';
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

function Home() {
  const [data, setData] = useState<Data[]>([]);

  const getData = () => {
    return api.get('/usuarios').then(response => {
      setData(response.data);
    })
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <div id="page-landing">
      <Header />
      <Main data={data} getData={getData} />
    </div>
  );
}

export default Home;