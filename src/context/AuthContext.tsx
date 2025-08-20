// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../components/api";

type User = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  title?: string;
  role?: string;
  bio?: string;
  experienceLevel: string;
  hourlyRate: number;
  portfolioLinks: string;
  languages: string;
  // add other fields as needed
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/api/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
