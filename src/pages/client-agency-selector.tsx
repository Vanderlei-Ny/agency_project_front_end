import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ClientAgencySelector() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a tela de escolha de agência
    navigate("/agencies-list", { replace: true });
  }, [navigate]);

  return null;
}
