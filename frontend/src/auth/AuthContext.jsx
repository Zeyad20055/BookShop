import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

// Create Context
export const AuthContext = createContext();

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};


// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user login status
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/users/verify",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // ✅ تم التعديل هنا
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const response = await fetch(
        "http://localhost:5000/users/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);

        return {
          success: true,
          data,
        };
      }

      return {
        success: false,
        error: data.message,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        error: "Login failed",
      };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);

        return {
          success: true,
          data,
        };
      }

      return {
        success: false,
        error: data.message,
      };
    } catch (error) {
      console.error("Register error:", error);

      return {
        success: false,
        error: "Register failed",
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(
        "http://localhost:5000/users/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    refreshAuthStatus: checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};