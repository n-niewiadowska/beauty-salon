import { createContext, useContext } from "react";
import { UserContextValue, ProductContextValue } from "../types/contextTypes";


export const UserContext = createContext<UserContextValue | null>(null);
export const useUsers = () => useContext(UserContext);

export const ProductContext = createContext<ProductContextValue | null>(null);
export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within a provider");
  }

  const { products, dispatch } = context;

  return { products, dispatch };
}