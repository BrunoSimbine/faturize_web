// services/auth.ts

const TOKEN_DATA = '';

export function setToken(data: {token: string, active: boolean}) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_DATA, JSON.stringify(data));
  }
}

export function getToken(): object | null {
  if (typeof window !== 'undefined') {
    const tokenStr = localStorage.getItem(TOKEN_DATA); // Substitua por sua constante, se necessário
    if (tokenStr) {
      try {
        return JSON.parse(tokenStr);
      } catch (e) {
        console.error('Erro ao fazer parse do token:', e);
        return null;
      }
    }
  }
  return null;
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_DATA);
  }
}
