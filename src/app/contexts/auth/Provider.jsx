
// Import Dependencies
import { useEffect, useReducer } from "react";

import PropTypes from "prop-types";



// Local Imports
import axios from "utils/axios";
import { isTokenValid, setSession } from "utils/jwt";
import { AuthContext} from "./context";


// ----------------------------------------------------------------------


const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
};




const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },

  LOGIN_REQUEST: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },

  LOGIN_SUCCESS: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      user,
    };
  },

  LOGIN_ERROR: (state, action) => {
    const { errorMessage } = action.payload;

    return {
      ...state,
      errorMessage,
      isLoading: false,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
 
  useEffect(() => {
    const init = async () => {
      try {
        const authToken = window.localStorage.getItem("authToken");
if (authToken && isTokenValid(authToken)) {
  setSession(authToken);
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/profile`);
  const { user } = response.data.data;

  dispatch({
    type: "INITIALIZE",
    payload: { isAuthenticated: true, user },
  });
} else {
  setSession(null);
  dispatch({ type: "INITIALIZE", payload: { isAuthenticated: false, user: null } });
}

      } catch (err) {
        console.error("Auth init error:",err);
         setSession(null);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    init();
  }, []);
const login = async ({ user, accessToken }) => {
    if (!accessToken || typeof accessToken !== "string" || !user) {
      throw new Error("Invalid token login");
    }
    window.localStorage.setItem("authToken", accessToken); // persist token
    setSession(accessToken);

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { user },
    });
  };





  const logout = async () => {
    setSession(null);
    window.localStorage.removeItem("authToken"); // clear token
    dispatch({ type: "LOGOUT" });
  };

  if (!children) {
    return null;
  }

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
