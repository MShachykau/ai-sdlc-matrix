import { useState, useEffect, useCallback, useRef } from 'react';

const TRIGGER_WORD = 'update';
const CREDENTIALS = { username: 'admin', password: 'admin' };
const STORAGE_KEY = 'ai_matrix_auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const bufferRef = useRef('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside inputs/textareas to avoid accidental triggers
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      bufferRef.current = (bufferRef.current + e.key).slice(-TRIGGER_WORD.length);

      if (bufferRef.current === TRIGGER_WORD) {
        bufferRef.current = '';
        if (!isAuthenticated) {
          setShowAuthModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setShowAuthModal(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  const dismissModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  return { isAuthenticated, showAuthModal, login, logout, dismissModal };
}
