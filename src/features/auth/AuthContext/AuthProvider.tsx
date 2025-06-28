import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  requestPhoneOtpApi,
  requestEmailOtpApi,
  verifyPhoneOtpApi,
  verifyEmailOtpApi,
} from '../services/authService';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  iat: number;
  // Add more fields if your token has them
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [fullhash, setFullhash] = useState<string | null>(null);
  const [emailToken, setEmailToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<number | undefined | null>(null);
  const [user, setUser] = useState<any>(null);

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('https://sone-taran-backend.onrender.com/api/user/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Session not valid');

        const data = await res.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (err) {
        // Check if token is valid for email OTP fallback
        const storedEmailToken = localStorage.getItem('emailToken');
        const storedUser = localStorage.getItem('user');

        if (storedEmailToken && isTokenValid(storedEmailToken) && storedUser) {
          setEmailToken(storedEmailToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          logout();
        }
      }
    };

    fetchSession();
  }, []);

  const requestOtp = async (phone: string) => {
    const response = await requestPhoneOtpApi(phone);

    setFullhash(response.fullhash);
    setPhoneNumber(phone);
    setOtpSent(response.otp);
  };

  const requestEmailOtp = async (email: string) => {
    const response = await requestEmailOtpApi(email);
    setEmail(email);
    setEmailToken(response.token);
  };

  const verifyOtp = async (otp: number) => {
    if (!fullhash || !phoneNumber) return false;

    const response = await verifyPhoneOtpApi(
      String(phoneNumber),
      otp,
      fullhash
    );

    if (response?.success) {
      localStorage.setItem('user', JSON.stringify(response.user));
      setIsAuthenticated(true);
      setUser(response.user);
      return true;
    }
    return false;
  };

  const verifyEmailOtp = async (otp: string) => {
    if (!emailToken) return false;
    const response = await verifyEmailOtpApi(otp, emailToken);

    if (response?.success) {
      localStorage.setItem('user', JSON.stringify(response.user));
      setIsAuthenticated(true);
      setUser(response.user);
      return true;
    }

    return false;
  };

  const logout = async () => {
    try {
      await fetch('https://sone-taran-backend.onrender.com/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.warn('Logout failed:', e);
    }
    setPhoneNumber(null);
    setEmail(null);
    setIsAuthenticated(false);
    setEmailToken(null);
    setUser(null);
    localStorage.removeItem('emailToken');
  };

  return (
    <AuthContext.Provider
      value={{
        phoneNumber,
        email,
        requestOtp,
        requestEmailOtp,
        verifyOtp,
        verifyEmailOtp,
        logout,
        otpSent,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
