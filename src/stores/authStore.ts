import { create } from 'zustand';
import { User, UserRole } from '../types';
import { getUsers } from '../utils/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: (username: string, password: string, role: UserRole) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    
    // Update in localStorage users array
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Update current user
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  initAuth: () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      set({ user, isAuthenticated: true });
    }
  }
}));
