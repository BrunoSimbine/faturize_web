// services/api.ts
import axios from 'axios';
import { getToken, setToken, clearToken } from '@/services/auth';

export type Auth = {
  token: string;
};

// ------------------------------------------------------
// 🔹 Configuração base do Axios
// ------------------------------------------------------
const api = axios.create({
  baseURL: 'https://api.faturizze.com/v1',
  headers: { 'Content-Type': 'application/json' },
});

// ------------------------------------------------------
// 🔹 Interceptores globais (tratamento de erros e auth)
// ------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearToken();
      window.location.href = '/login';
    } else if (status === 403) {
      //clearToken();
      window.location.href = '/verify';
    }

    return Promise.reject(error);
  }
);

// ------------------------------------------------------
// 🔹 Funções auxiliares
// ------------------------------------------------------
function authHeader() {
  const token = getToken() as Auth | null;
  return token ? { Authorization: `Bearer ${token.token}` } : {};
}

async function safeRequest<T>(fn: () => Promise<T>): Promise<T | {}> {
  try {
    return await fn();
  } catch (err) {
    console.error('API Error:', err);
    return {};
  }
}

// ------------------------------------------------------
// 🔹 Auth
// ------------------------------------------------------
export async function createLogin(data: { email: string; password: string }) {
  return safeRequest(async () => {
    const res = await api.post('/Auth/login', data);
    if (res.data.token) setToken(res.data);
    return res.data;
  });
}

export async function logout() {
  return safeRequest(async () => {
    const token = getToken() as Auth;
    if (!token) return {};

    const res = await api.delete('/Auth/logout', { headers: authHeader() });
    clearToken();
    return res.data;
  });
}

export async function createUser(data: { name: string; surname: string; email: string; password: string }) {
  return safeRequest(async () => {
    const res = await api.post('/User/register', data);
    if (res.data.token) setToken(res.data);
    return res.data;
  });
}

// ------------------------------------------------------
// 🔹 Recursos gerais
// ------------------------------------------------------
export async function createCompany(data: { name: string; description: string; imageUrl: string }) {
  return safeRequest(async () =>
    (await api.post('/Company/add', data, { headers: authHeader() })).data
  );
}

export async function createWallet(data: { publicKey: string; label: string; account: string }) {
  return safeRequest(async () =>
    (await api.post('/Wallet/add', data, { headers: authHeader() })).data
  );
}

export async function createSignature(data: { packageId: string; account: string; isYearly: boolean }) {
  return safeRequest(async () =>
    (await api.post('/Signature/add', data, { headers: authHeader() })).data
  );
}

export async function activateUser(otp: string) {
  return safeRequest(async () =>
    (await api.post(`/User/activate?Otp=${otp}`, {}, { headers: authHeader() })).data
  );
}

export async function activateWallet(walletId: string) {
  return safeRequest(async () =>
    (await api.put(`/Wallet/activate/${walletId}`, {}, { headers: authHeader() })).data
  );
}

export async function refreshToken(companyId: string) {
  return safeRequest(async () => {
    const res = await api.put(`/Auth/refresh/${companyId}`, {}, { headers: authHeader() });
    if (res.data.token) setToken(res.data);
    return res.data;
  });
}

// ------------------------------------------------------
// 🔹 Funções GET (listagens e detalhes)
// ------------------------------------------------------
export async function getCompanies() {
  return safeRequest(async () => (await api.get('/Company/get/all', { headers: authHeader() })).data);
}

export async function getCompany() {
  return safeRequest(async () => (await api.get('/Company/get', { headers: authHeader() })).data);
}

export async function getCompanyDetails() {
  return safeRequest(async () => (await api.get('/Company/get/details', { headers: authHeader() })).data);
}

export async function getPackages() {
  return safeRequest(async () => (await api.get('/Package/get/all', { headers: authHeader() })).data);
}

export async function getPackage(packageId: string) {
  return safeRequest(async () => (await api.get(`/Package/get/${packageId}`, { headers: authHeader() })).data);
}

export async function getWallets() {
  return safeRequest(async () => (await api.get('/Wallet/get', { headers: authHeader() })).data);
}

export async function getApiKeys() {
  return safeRequest(async () => (await api.get('/ApiKey/get/all', { headers: authHeader() })).data);
}

export async function getSignature() {
  return safeRequest(async () => (await api.get('/Signature/current', { headers: authHeader() })).data);
}

export async function getSignatures() {
  return safeRequest(async () => (await api.get('/Signature/my', { headers: authHeader() })).data);
}

export async function getOrders() {
  return safeRequest(async () => (await api.get('/Order/get', { headers: authHeader() })).data);
}

export async function getAllOrders() {
  return safeRequest(async () => (await api.get('/Order/get/all', { headers: authHeader() })).data);
}

export async function getUser() {
  return safeRequest(async () => (await api.get('/User/get', { headers: authHeader() })).data);
}

export async function getInvoicing() {
  return safeRequest(async () => (await api.get('/Company/get/invoicing', { headers: authHeader() })).data);
}

export async function getMethods() {
  return safeRequest(async () => (await api.get('/PayMethod/get', { headers: authHeader() })).data);
}

export async function getAllMethods() {
  return safeRequest(async () => (await api.get('/PayMethod/get/all', { headers: authHeader() })).data);
}

export async function getDailySummary() {
  return safeRequest(async () => (await api.get('/DailySummary/get', { headers: authHeader() })).data);
}

export async function getTransactions() {
  return safeRequest(async () => (await api.get('/transaction/get', { headers: authHeader() })).data);
}

// ------------------------------------------------------
// 🔹 Orders
// ------------------------------------------------------
export async function createOrder(data: {
  amount: number;
  description?: string;
  client?: string;
  expires?: string;
}) {
  return safeRequest(async () => {
    const requestBody = {
      amount: data.amount,
      ...(data.description && { description: data.description }),
      ...(data.client && { client: data.client }),
      ...(data.expires && { expires: data.expires }),
    };

    const res = await api.post('/Order/add', requestBody, { headers: authHeader() });
    return res.data;
  });
}

export async function cancelOrder(orderId: string) {
  return safeRequest(async () =>
    (await api.put(`/Order/cancel/${orderId}`, {}, { headers: authHeader() })).data
  );
}

export async function getOrderById(orderId: string) {
  return safeRequest(async () =>
    (await api.get(`/Order/get/${orderId}`, { headers: authHeader() })).data
  );
}

export async function manualConfirmOrder(orderId: string) {
  return safeRequest(async () =>
    (await api.put(`/Order/manual-confirm/${orderId}`, {}, { headers: authHeader() })).data
  );
}

export async function extendOrder(data: { orderId: string; expires: string }) {
  return safeRequest(async () =>
    (await api.put('/Order/extend', data, { headers: authHeader() })).data
  );
}
