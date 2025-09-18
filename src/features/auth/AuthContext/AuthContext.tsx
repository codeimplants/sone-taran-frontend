import { createContext } from 'react';

export interface AuthContextType {
  phoneNumber: any | null;
  email: string | null;
  requestEmailOtp: (email: string) => Promise<void>;
  requestOtp: (phone: any) => Promise<void>;
  verifyOtp: (otp: number) => Promise<boolean>;
  verifyEmailOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  user: any | null;
  loadingAPI: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
