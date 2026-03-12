import { create } from 'zustand';
import {jwtDecode} from "jwt-decode"

export const useAuthStore = create(set => ({
  user:  null,
  token: null,

  setAuth: (user, token) => {
    // Sačuvaj token
    localStorage.setItem('token', token);

    // Dekodiranje tokena (ako treba za logiku)
    const decoded = jwtDecode(token);
    console.log("Podaci iz tokena:", decoded);


    const isAdmin = user?.permissions?.length >= 4 ? true : false;

    const userWithAdminFlag = { ...user, is_admin: isAdmin };

    // Sačuvaj user u localStorage
    localStorage.setItem('user', JSON.stringify(userWithAdminFlag));
    console.log("User permissions:", user.permissions);
    // Update state-a
    set({ user: userWithAdminFlag, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  initFromStorage: () => {
    const token = localStorage.getItem('token');
    const raw   = localStorage.getItem('user');
    let user = null;

    if (raw && raw !== 'undefined') {
      try {
        user = JSON.parse(raw);
      } catch (err) {
        console.error("Nevalidan JSON u localStorage za user:", raw);
        localStorage.removeItem('user');
      }
    }

    if (token) set({ token, user });
  },
}));
