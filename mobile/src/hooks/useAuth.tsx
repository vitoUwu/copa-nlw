import { useContext } from "react";
import { AuthContext, IAuthContext } from "../contexts/AuthContext";

export function useAuth(): IAuthContext {
  return useContext(AuthContext)
}