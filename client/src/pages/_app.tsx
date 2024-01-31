import { useReducer, useEffect } from "react";
import { AppProps } from "next/app";
import { ProductContext, UserContext } from "@/app/store/contexts";
import { userReducer } from "@/app/store/userReducer";
import "@/app/css/styles.css";
import { productReducer } from "@/app/store/productReducer";


const App = ({ Component, pageProps }: AppProps) => {
  const [ user, userDispatch ] = useReducer(userReducer, null);
  const [ products, productsDispatch ] = useReducer(productReducer, { products: [], filteredProducts: []});

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    const initialUserState = userFromStorage ? JSON.parse(userFromStorage) : null;
    userDispatch({ type: "REHYDRATE", payload: initialUserState });
  }, []);

  return (
    <UserContext.Provider value={{ user, dispatch: userDispatch }}>
      <ProductContext.Provider value={{ products, dispatch: productsDispatch }}>
        <Component {...pageProps} />
      </ProductContext.Provider>
    </UserContext.Provider>
  );
}

export default App; 