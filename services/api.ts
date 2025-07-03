// services/api.ts
import axios from 'axios';
import { setToken } from '@/services/auth';
import { getToken } from '@/services/auth';

const api = axios.create({
  baseURL: 'https://api.privaxnet.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exemplo de função que retorna um JSON
export async function createLogin(data: {email: string, password: string}) {
  const response = await api.post(`/Auth/login`, data);

    if (response.data.token) {
      setToken(response.data);
    }

  return response.data;
}

// Exemplo de função que retorna um JSON
export async function createUser(data: {name: string, surname: string, email: string, password: string}) {
  const response = await api.post(`/User/register`, data);

    if (response.data.token) {
      setToken(response.data);
    }

  return response.data;
}

export type Auth = {
  token: string
} 

export async function createCompany(data: {name: string, description: string, imageUrl: string}) {
  const token = getToken() as Auth;

  if(token)
  {
      const response = await api.post('/Company/add', data, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.data;
  } else {
    return {};
  }
}

export async function refreshToken(companyId: string) {
  const token = getToken() as Auth;

  if(token)
  {
    const response = await api.put(`/Auth/refresh/${companyId}`, {}, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });

    if (response.data.token) {
      setToken(response.data);
    }

    return response.data;
  }else {
    return {}
  }
}

export async function getCompanies() {
    const token = getToken() as Auth;

    if(token)
    {
      const response = await api.get('/Company/get', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    }else{
      return {}
    }
}

export async function getCompanyDetails() {
    const token = getToken() as Auth;

    if(token)
    {
      const response = await api.get('/Company/get/details', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;
    } else {
      return {}
    }

}

export async function getOrders() {
    const token = getToken() as Auth;
    if(token)
    {
      const response = await api.get('/Order/get', {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        });
      return response.data;
    } else {
      return {}
    }
}

export async function getAllOrders() {
    const token = getToken() as Auth;
    console.log(token)
    if(token)
    {
      const response = await api.get('/Order/get/all', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;
    } else {
      return [{}]
    }

}

export async function getInvoicing() {
    const token = getToken() as Auth;
    if(token)
    {
      const response = await api.get('/Company/get/invoicing', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    } else {
      return {}
    }
}

export async function getMethods() {
    const token = getToken() as Auth;
    if(token)
    {
      const response = await api.get('/PayMethod/get', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    } else {
      return {}
    }
}

export async function getTransactions() {
    const token = getToken() as Auth;
    if(token)
    {
      const response = await api.get('/transaction/get/all', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    } else {
      return {}
    }
}

export async function createOrder(data: {
  amount: number;
  payMethodId: string;
  account: string;
  expires: string;
}) {
  const token = getToken() as Auth;

  if (token) {
    const order = await api.post('/Order/add', data, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });

    const payload = {
      ...data,
      orderId: order.data.id,
    };

    const response = await api.post('PaymentMapper/add', payload, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });

    return response.data;
  } else {
    return {};
  }
}


export async function cancelOrder(orderId: string) {
    const token = getToken() as Auth;
    if(token)
    {
      const order = await api.put(`/Order/cancel/${orderId}`, {} ,{
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });

      return order.data;

    } else {
      return {}
    }
}

export async function manualConfirmOrder(orderId: string) {
    const token = getToken() as Auth;
    if(token)
    {
      const order = await api.put(`/Order/manual-confirm/${orderId}`, {} ,{
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });

      return order.data;

    } else {
      return {}
    }
}

export async function extendOrder(data: {orderId: string, expires: string}) {
    const token = getToken() as Auth;
    if(token)
    {
      const order = await api.put(`/Order/extend`, data ,{
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });

      return order.data;

    } else {
      return {}
    }
}