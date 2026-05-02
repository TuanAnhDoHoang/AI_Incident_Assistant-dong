// ===== Auth Context =====
// Mock authentication. Replace with real auth provider later.

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthState, User } from '../types';
import { findUserByPhone, allUsers } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const login = async (phone: string, _password: string): Promise<boolean> => {
    // Mock login: match by phone number.
    // Accounts:
    //   anhdoo → 0901 (admin in AWS)
    //   DAT    → 0902 (admin in Google Cloud)
    //   CUONG  → 0903 (admin in Vercel)
    // If phone is empty, default to first user (anhdoo).
    return new Promise((resolve) => {
      setTimeout(() => {
        let user: User | undefined;

        // Try exact phone match
        user = findUserByPhone(phone);

        // If no match, default to anhdoo for quick login
        if (!user) {
          user = allUsers[0];
        }

        setAuthState({ isAuthenticated: true, user });
        resolve(true); //true simulator
      }, 800);
    });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
