import { Dispatch } from "react";
import { User, UserAction } from "../types/userTypes";
import { State, ProductAction } from "../types/productTypes";


export type UserContextValue = {
  user: User | null;
  dispatch: Dispatch<UserAction>;
}

export type ProductContextValue = {
  products: State;
  dispatch: Dispatch<ProductAction>;
}