// services/api.ts
import axios from 'axios';
import { setToken, clearToken, getToken } from '@/services/auth';

const api = axios.create({
  baseURL: 'https:/api.faturizze.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para configurar o cabeçalho de autorização com token
const getAuthHeaders = () => {
  const token = getToken() as Auth;
  return token ? { Authorization: `Bearer ${token.token}` } : {};
};

// Função para tratar respostas de API e atualização de token
const handleResponse = async (response: any, setTokenIfExists: boolean = true) => {
  if (response.data.token && setTokenIfExists) {
    setToken(response.data);
  }
  return response.data;
};

// Função para fazer requisições POST com token
const postWithAuth = async (url: string, data: any) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    const response = await api.post(url, data, { headers });
    return handleResponse(response);
  }
  return {};
};

// Função para fazer requisições GET com token
const getWithAuth = async (url: string) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    const response = await api.get(url, { headers });
    return response.data;
  }
  return {};
};

// Função para fazer requisições DELETE com token
const deleteWithAuth = async (url: string) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    const response = await api.delete(url, { headers });
    return response.data;
  }
  return {};
};

// Função para fazer requisições PUT com token
const putWithAuth = async (url: string, data: any) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    const response = await api.put(url, data, { headers });
    return response.data;
  }
  return {};
};

// Função de login
export async function createLogin(data: { email: string; password: string }) {
  const response = await api.post(`/Auth/login`, data);
  return handleResponse(response);
}

// Logout
export async function logout() {
  const token = getToken() as Auth;
  if (token) {
    const response = await api.delete('/Auth/logout', {
      headers: { Authorization: `Bearer ${token.token}` },
    });
    if (response.data.token) {
      clearToken();
    }
    return response.data;
  }
  return {};
}

// Registrar novo usuário
export async function createUser(data: { name: string; surname: string; email: string; password: string }) {
  return postWithAuth('/User/register', data);
}

// Criar empresa
export async function createCompany(data: { name: string; description: string; imageUrl: string }) {
  return postWithAuth('/Company/add', data);
}

// Criar carteira
export async function createWallet(data: { clientId: string; publicKey: string; label: string; payMethodId: string; account: string }) {
  return postWithAuth('/Wallet/add', data);
}

// Criar assinatura
export async function createSignature(data: { packageId: string; account: string; isYearly: boolean }) {
  return postWithAuth('/Signature/add', data);
}

// Ativar carteira
export async function activateWallet(walletId: string) {
  return putWithAuth(`/Wallet/activate/${walletId}`, {});
}

// Refresh token
export async function refreshToken(companyId: string) {
  const response = await putWithAuth(`/Auth/refresh/${companyId}`, {});
  return handleResponse(response, false);
}

// Obter empresas
export async function getCompanies() {
  return getWithAuth('/Company/get/all');
}

// Obter pacotes
export async function getPackages() {
  return getWithAuth('/Package/get/all');
}

// Obter chaves de API
export async function getApiKeys() {
  return getWithAuth('/ApiKey/get/all');
}

// Obter detalhes da empresa
export async function getCompany() {
  return getWithAuth('/Company/get');
}

// Obter assinatura atual
export async function getSignature() {
  return getWithAuth('/Signature/current');
}

// Obter todas as assinaturas
export async function getSignatures() {
  return getWithAuth('/Signature/my');
}

// Obter pacote específico
export async function getPackage(packageId: string) {
  return getWithAuth(`/Package/get/${packageId}`);
}

// Obter todas as carteiras
export async function getWallets() {
  return getWithAuth('/Wallet/get');
}

// Deletar carteira
export async function deleteWallet(walletId: string) {
  return deleteWithAuth(`/Wallet/delete/${walletId}`);
}

// Obter detalhes da empresa
export async function getCompanyDetails() {
  return getWithAuth('/Company/get/details');
}

// Obter pedidos
export async function getOrders() {
  return getWithAuth('/Order/get');
}

// Obter usuário
export async function getUser() {
  return getWithAuth('/User/get');
}

// Obter todos os pedidos
export async function getAllOrders() {
  return getWithAuth('/Order/get/all');
}

// Obter faturas
export async function getInvoicing() {
  return getWithAuth('/Company/get/invoicing');
}

// Obter métodos de pagamento
export async function getMethods() {
  return getWithAuth('/PayMethod/get');
}

// Obter todos os métodos de pagamento
export async function getAllMethods() {
  return getWithAuth('/PayMethod/get/all');
}

// Obter resumo diário
export async function getDailySummary() {
  return getWithAuth('/DailySummary/get');
}

// Obter transações
export async function getTransactions() {
  return getWithAuth('/transaction/get');
}

// Criar pedido
export async function createOrder(data: {
  amount: number;
  description?: string;
  client?: string;
  expires?: string;
}) {
  const requestBody: any = { amount: data.amount, ...(data.description && { description: data.description }), ...(data.client && { client: data.client }), ...(data.expires && { expires: data.expires }) };
  return postWithAuth('/Order/add', requestBody);
}

// Cancelar pedido
export async function cancelOrder(orderId: string) {
  return putWithAuth(`/Order/cancel/${orderId}`, {});
}

// Obter pedido por ID
export async function getOrderById(orderId: string) {
  return getWithAuth(`/Order/get/${orderId}`);
}

// Confirmar manualmente pedido
export async function manualConfirmOrder(orderId: string) {
  return putWithAuth(`/Order/manual-confirm/${orderId}`, {});
}

// Estender prazo de pedido
export async function extendOrder(data: { orderId: string; expires: string }) {
  return putWithAuth(`/Order/extend`, data);
}

export type Auth = {
  token: string;
};
