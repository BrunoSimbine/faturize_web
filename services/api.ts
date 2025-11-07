// services/api.ts
import axios from 'axios';
import { setToken } from '@/services/auth';
import { getToken, clearToken } from '@/services/auth';

const api = axios.create({
  baseURL: 'https://api.faturizze.com/v1',
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

export async function logout() {
  const token = getToken() as Auth;

  if(token)
  {
      const response = await api.delete('/Auth/logout', {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });

    if (response.data.token) {
      clearToken();
    }

    return response.data;
  } else {
    return {};
  }

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

export async function createWallet(data: {publicKey: string, label: string, account: string}) {
  const token = getToken() as Auth;

  if(token)
  {
      const response = await api.post('/Wallet/add', data, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.data;
  } else {
    return {};
  }
}

export async function createSignature(data: {packageId: string, account: string, isYearly: boolean}) {
  const token = getToken() as Auth;

  if(token)
  {
      const response = await api.post('/Signature/add', data, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.data;
  } else {
    return {};
  }
}

export async function activateWallet(walletId: string) {
  const token = getToken() as Auth;

  if(token)
  {
    const response = await api.put(`/Wallet/activate/${walletId}`, {}, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response.data;
  }else {
    return {}
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
      const response = await api.get('/Company/get/all', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    }else{
      return {}
    }
}

export async function getPackages() {
    const token = getToken() as Auth;

    if(token)
    {
      const response = await api.get(`/Package/get/all`, {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    }else{
      return {}
    }
}

export async function getApiKeys() {
    const token = getToken() as Auth;

    if(token)
    {
      const response = await api.get('/ApiKey/get/all', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    }else{
      return {}
    }
}

export async function getCompany() {
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

export async function getSignature() {
    const token = getToken() as Auth;

    if(token)
    {
      const response = await api.get('/Signature/current', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    }else{
      return {}
    }
}

export async function getSignatures() {
    const token = getToken() as Auth;

    if(token)
    {
      const response = await api.get('/Signature/my', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    }else{
      return {}
    }
}

export async function getPackage(packageId: string) {
    const token = getToken() as Auth;

    if(token)
    {
      const response = await api.get('/Package/get/' + packageId, {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    }else{
      return {}
    }
}


export async function getWallets() {
    const token = getToken() as Auth;

    if(token)
    {
      const response = await api.get('/Wallet/get', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    }else{
      return {}
    }
}

export async function deleteWallet(walletId: string) {
    const token = getToken() as Auth;

    if(token)
    {
      const response = await api.delete('/Wallet/delete/' + walletId, {
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

export async function getUser() {
    const token = getToken() as Auth;
    if(token)
    {
      const response = await api.get('/User/get', {
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

export async function getAllMethods() {
    const token = getToken() as Auth;
    if(token)
    {
      const response = await api.get('/PayMethod/get/all', {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      return response.data;

    } else {
      return {}
    }
}

export async function getDailySummary() {
    const token = getToken() as Auth;
    if(token)
    {
      const response = await api.get('/DailySummary/get', {
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
      const response = await api.get('/transaction/get', {
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
  description?: string;
  client?: string;
  expires?: string;
}) {
  const token = getToken() as Auth;

  if (token) {
    // Cria um novo objeto apenas com as propriedades definidas
    const requestBody: any = {
      amount: data.amount,
      ...(data.description && { description: data.description }),
      ...(data.client && { client: data.client }),
      ...(data.expires && { expires: data.expires }),
    };

    const response = await api.post('/Order/add', requestBody, {
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

export async function getOrderById(orderId: string) {
    const token = getToken() as Auth;
    if(token)
    {
      const order = await api.get(`/Order/get/${orderId}` ,{
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