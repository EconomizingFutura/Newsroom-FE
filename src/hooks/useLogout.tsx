import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  return logout;
};

export default useLogout;
