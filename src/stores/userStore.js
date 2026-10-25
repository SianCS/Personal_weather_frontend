import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginUser } from "../api";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: "",
      login: async (credentials) => {
        const rs = await loginUser(credentials);
        set({ token: rs.data.token, user: rs.data.user });
        return rs;
      },
      logout: () => set({ token: "", user: null }),
    }),
    {
      name: "userState",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
