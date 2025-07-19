import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutTemp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/"); // Redirect back after state reset
  }, [navigate]);

  return null; // No UI needed
};

export default LogoutTemp;
