import { useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "../services/api";
import {
  setLoading,
  setUser,
  clearUser,
} from "../redux/slices/authSlice";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreAuthentication = async () => {
      try {
        dispatch(setLoading(true));

        const response = await api.get("/auth/me");

        if (response.data.success && response.data.user) {
          dispatch(setUser(response.data.user));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        dispatch(clearUser());
      } finally {
        dispatch(setLoading(false));
      }
    };

    restoreAuthentication();
  }, [dispatch]);

  return children;
}

export default AuthInitializer;