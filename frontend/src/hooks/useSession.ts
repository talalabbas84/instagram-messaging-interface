// hooks/useSession.ts
import { useEffect, useState } from 'react';
import { User } from '../types/types';

export function useSession() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>({ username: '', password: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('instagramUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('instagramUser', JSON.stringify(user));
  };

  const logout = () => {
    setUser({ username: '', password: '' });
    setIsLoggedIn(false);
    localStorage.removeItem('instagramUser');
  };

  return { isLoggedIn, user, login, logout, setUser };
}
