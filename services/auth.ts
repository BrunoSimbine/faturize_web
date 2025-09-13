// services/auth.ts
const TOKEN_DATA = 'auth_token';

type Wallet = {
  id: string;
  clientId: string;
  publicKey: string;
  label: string;
  payMethodId: string;
  account: string;
  accountName: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  dateCreated: string;
  dateUpdated: string;
};


export function setToken(data: { token: string; active: boolean }) {
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 1000 * 6); // 30 min em ms
    document.cookie = `${TOKEN_DATA}=${encodeURIComponent(
      JSON.stringify(data)
    )}; expires=${expires.toUTCString()}; path=/`;
  }
}

export function setLocalMethods(data: object) {
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 1000 * 6); // 30 min em ms
    document.cookie = `${'methods_data'}=${encodeURIComponent(
      JSON.stringify(data)
    )}; expires=${expires.toUTCString()}; path=/`;
  }
}

export function setLocalWallets(data: object) {
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 1000 * 6); // 30 min em ms
    document.cookie = `${'wallets_data'}=${encodeURIComponent(
      JSON.stringify(data)
    )}; expires=${expires.toUTCString()}; path=/`;
  }
}


export function getToken(): object | null {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === TOKEN_DATA) {
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch (e) {
          console.error('Erro ao fazer parse do token:', e);
          return null;
        }
      }
    }
  }
  return null;
}

export function getLocalWallets(): Wallet[] | null {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "wallets_data") {
        try {
          return JSON.parse(decodeURIComponent(value)) as Wallet[];
        } catch (e) {
          console.error("Erro ao fazer parse das wallets:", e);
          return null;
        }
      }
    }
  }
  return null;
}

export function getLocalMethods(): PaymentMethod[] | null {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "methods_data") {
        try {
          return JSON.parse(decodeURIComponent(value)) as PaymentMethod[];
        } catch (e) {
          console.error("Erro ao fazer parse dos métodos:", e);
          return null;
        }
      }
    }
  }
  return null;
}


export function clearToken() {
  if (typeof document !== 'undefined') {
    document.cookie = `${TOKEN_DATA}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
}
