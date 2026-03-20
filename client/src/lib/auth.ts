const TOKEN_KEY = 'token';
const CUSTOMER_KEY = 'customer';

interface CustomerData {
  id: string;
  phone: string;
  name?: string;
  email?: string;
}

const AUTH_CHANGE_EVENT = 'auth:changed';

function dispatchAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
}

export const auth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getCustomer(): CustomerData | null {
    const customerJson = localStorage.getItem(CUSTOMER_KEY);
    if (!customerJson) return null;
    try {
      return JSON.parse(customerJson);
    } catch {
      return null;
    }
  },

  setCustomer(customer: CustomerData): void {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
  },

  removeCustomer(): void {
    localStorage.removeItem(CUSTOMER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    this.removeToken();
    this.removeCustomer();
    dispatchAuthChange();
  },

  login(token: string, customer: CustomerData): void {
    this.setToken(token);
    this.setCustomer(customer);
    dispatchAuthChange();
  },

  onAuthChange(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  }
};
