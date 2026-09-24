/// <reference types="vite/client" />
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthUser } from '../types/stock';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://nepse-alarm.onrender.com/api/v1';

export interface LastUser {
  name: string;
  email: string;
  avatar: string;
  role?: string;
  lastLoginAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('nepse_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('nepse_auth_token');
    } catch {
      return null;
    }
  });

  const [lastUser, setLastUser] = useState<LastUser | null>(() => {
    try {
      const saved = localStorage.getItem('nepse_last_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if first-time visitor or needs login prompt
  useEffect(() => {
    const hasActiveSession = !!user;
    const hasPrompted = sessionStorage.getItem('nepse_auth_prompted_this_session');

    // If user has no active session and hasn't been prompted in this browser session, open auth gate
    if (!hasActiveSession && !hasPrompted) {
      setIsAuthModalOpen(true);
      sessionStorage.setItem('nepse_auth_prompted_this_session', 'true');
    }
  }, [user]);

  const saveSession = (authenticatedUser: AuthUser, sessionToken: string, remember: boolean = true) => {
    setUser(authenticatedUser);
    setToken(sessionToken);
    try {
      localStorage.setItem('nepse_auth_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('nepse_auth_token', sessionToken);

      if (remember) {
        const remembered: LastUser = {
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          avatar: authenticatedUser.avatar,
          role: authenticatedUser.role,
          lastLoginAt: new Date().toISOString(),
        };
        localStorage.setItem('nepse_last_user', JSON.stringify(remembered));
        setLastUser(remembered);
      }
    } catch (e) {
      console.warn('LocalStorage error while saving session:', e);
    }
  };

  const login = useCallback(
    async (email: string, password: string, remember: boolean = true): Promise<boolean> => {
      setLoading(true);
      setAuthError(null);

      const normalizedEmail = email.trim().toLowerCase();

      try {
        // Attempt backend login first with timeout
        const res = await axios.post(
          `${API_BASE}/auth/login`,
          { email: normalizedEmail, password },
          { timeout: 4000 }
        );

        if (res.data?.user && res.data?.token) {
          saveSession(res.data.user, res.data.token, remember);
          setIsAuthModalOpen(false);
          return true;
        }
      } catch (err: any) {
        // If server returns explicit 401 (Unauthorized) or 400 (Bad Request), display message
        if (err.response?.status === 401 || err.response?.status === 400) {
          setAuthError(err.response?.data?.message || 'Invalid email or password.');
          setLoading(false);
          return false;
        }

        // Offline / fallback verification for default accounts if backend route is 404 or unreachable
        if (
          (normalizedEmail === 'demo@nepse.ai' || normalizedEmail === 'sakxam@nepse.ai') &&
          password === 'password123'
        ) {
          const fallbackUser: AuthUser = {
            id: 'usr-sakxam-01',
            name: 'Sakxam Bhattarai',
            email: normalizedEmail,
            role: 'Lead Quantitative Analyst',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            createdAt: new Date().toISOString(),
          };
          saveSession(fallbackUser, 'mock-jwt-token-sakxam', remember);
          setIsAuthModalOpen(false);
          setLoading(false);
          return true;
        }

        if (normalizedEmail === 'evaluator@tu.edu.np' && password === 'password123') {
          const fallbackUser: AuthUser = {
            id: 'usr-tu-eval',
            name: 'TU BCA Evaluator',
            email: normalizedEmail,
            role: 'Academic Examiner',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
            createdAt: new Date().toISOString(),
          };
          saveSession(fallbackUser, 'mock-jwt-token-evaluator', remember);
          setIsAuthModalOpen(false);
          setLoading(false);
          return true;
        }

        // Generic error
        setAuthError(err.message || 'Login failed. Please check your credentials or try again.');
        return false;
      } finally {
        setLoading(false);
      }

      return false;
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setAuthError(null);

      const normalizedEmail = email.trim().toLowerCase();

      try {
        const res = await axios.post(
          `${API_BASE}/auth/register`,
          { name: name.trim(), email: normalizedEmail, password },
          { timeout: 4000 }
        );

        if (res.data?.user && res.data?.token) {
          saveSession(res.data.user, res.data.token, true);
          setIsAuthModalOpen(false);
          return true;
        }
      } catch (err: any) {
        if (err.response?.data?.message) {
          setAuthError(err.response.data.message);
          setLoading(false);
          return false;
        }

        // Offline / fallback registration
        const fallbackUser: AuthUser = {
          id: 'usr-' + Math.random().toString(36).substring(2, 9),
          name: name.trim(),
          email: normalizedEmail,
          role: 'Active Trader',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1e293b,0f172a,3b82f6`,
          createdAt: new Date().toISOString(),
        };
        saveSession(fallbackUser, 'mock-jwt-token-' + Date.now(), true);
        setIsAuthModalOpen(false);
        setLoading(false);
        return true;
      } finally {
        setLoading(false);
      }

      return false;
    },
    []
  );

  const loginAsGuest = useCallback(() => {
    const guestUser: AuthUser = {
      id: 'guest-' + Math.random().toString(36).substring(2, 7),
      name: 'Guest Trader',
      email: 'guest@nepse.local',
      role: 'Guest Evaluator',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    saveSession(guestUser, 'guest-session-token', false);
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('nepse_auth_user');
      localStorage.removeItem('nepse_auth_token');
      // Keep lastUser intact so prompt can say "Welcome back [Name]"!
    } catch (e) {
      console.warn('Error clearing auth:', e);
    }
    setIsAuthModalOpen(true);
  }, []);

  const forgetLastUser = useCallback(() => {
    setLastUser(null);
    try {
      localStorage.removeItem('nepse_last_user');
    } catch {}
  }, []);

  return {
    user,
    token,
    lastUser,
    isAuthModalOpen,
    loading,
    authError,
    setAuthError,
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
    login,
    register,
    loginAsGuest,
    logout,
    forgetLastUser,
  };
}
