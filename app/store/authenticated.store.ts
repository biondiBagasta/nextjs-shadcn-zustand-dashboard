import { create } from "zustand";
import { User } from "../interfaces/user";

interface AuthenticatedState {
  userState: User
  setUserState: (user: User) => void
}

export const useAuthenticatedStore = create<AuthenticatedState>((set) => ({
  userState: {
    id: 0,
    username: "biondi_bagasta",
    password: "",
    full_name: "Biondi Bagasta Wiko Putra",
    address: "Jln. Industri, GG. Gurita no. 5, Gatep Permai, Taman Sari",
    phone_number: "082236343053",
    role: "SUPER ADMIN",
    active: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  setUserState: (user) => set(() => ({ userState: user }))
}))