import React, { createContext, useState, useEffect, useContext } from 'react';
import ApplicationStore from '../utils/localStorageUtil';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = ApplicationStore().getStorage('userDetails');
      // We will change to store token separately or extract from userDetails
      // if sticking to the old structure initially.
      const storedToken = ApplicationStore().getStorage('token');

      // Adaptation to existing structure where everything might be in 'userDetails'
      // The previous code did: const { token, userDetails } = ApplicationStore().getStorage('userDetails');
      // So 'userDetails' key in localStorage actually contained { token, userDetails: {...} }

      const storedData = ApplicationStore().getStorage('userDetails');

      if (storedData && storedData.token) {
        setToken(storedData.token);
        setUser(storedData.userDetails);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (data) => {
    // Expecting data to be the full response object from login API
    // { success: true, data: { token: "...", userDetails: { ... }, ... } } or similar
    // Based on user request: 
    // Response: { success: true, message: "...", data: { locationDetails:..., userDetails:..., token:... } }

    // OR based on the existing code in LoginPageComponent.jsx which sets:
    // ApplicationStore().setStorage('userDetails', data);
    // where 'data' seems to be the response from LoginService.

    // Let's standardize.

    const { token, userDetails } = data;

    setToken(token);
    setUser(userDetails);
    setIsAuthenticated(true);

    // Persist
    // We will keep the existing key 'userDetails' for backward compatibility if needed, 
    // OR we can migrate to 'authData' or separate keys. 
    // For now, let's stick to the pattern but maybe clean it up later.
    // The previous app used 'userDetails' key to store { token, userDetails, ... }
    ApplicationStore().setStorage('userDetails', data);

    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    ApplicationStore().clearStorage();
    // Optional: Navigate to login is usually handled by the component calling logout or protected routes
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    setUserAuthetication: setUser // Keep compatibility with existing code calling setUserAuthetication
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
