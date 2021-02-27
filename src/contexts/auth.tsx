import { createContext, useState, useContext } from 'react';

interface User {
  login: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  signIn(user: User | null): void;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const userStorage = localStorage.getItem('user');
  const userItem: User | null = userStorage ? JSON.parse(userStorage) : null;
  
  const [user, setUser] = useState<User | null>(userItem);

  function signInAuthProvider(userLogin: User) {
    setUser(userLogin);
    localStorage.setItem('user', JSON.stringify(userLogin));
  }
  return (
    <AuthContext.Provider value={{ user, signed: !!user, signIn: signInAuthProvider }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export default AuthProvider;