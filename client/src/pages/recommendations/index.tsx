import { useEffect } from "react";
import axios from "axios";
import { Product } from "@/app/types/productTypes";
import { useProducts } from "@/app/store/contexts";
import { MainLayoutContainer } from "../components/main-layout";
import { FilterForm } from "./filter-form";
import { ProductList } from "./product-list";
import "@/app/css/recommendations-styles.css";


const RecommendationPage = () => {
  const { dispatch } = useProducts();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://makeup-api.herokuapp.com/api/v1/products.json");
      const products_list: Product[] = response.data.map((product: any) => ({
        id: product.id,
        brand: product.brand,
        name: product.name,
        price: product.price,
        price_sign: product.price_sign,
        image: product.api_featured_image,
        description: product.description,
        product_type: product.product_type,
        tag_list: product.tag_list,
        created_at: product.created_at
      }));
      
      dispatch({ type: "ADD_PRODUCTS", payload: products_list });
    }

    fetchProducts();
  }, []);

  return (
    <MainLayoutContainer>
        <h2>Product recommendations</h2>
        <div>
          Here is the list of make-up products I highly recommend! Click on the product's image to see 
          the details.
        </div>
        <div className="products-body">
          <FilterForm />
          <ProductList />
        </div>
    </MainLayoutContainer>
  );
}

export default RecommendationPage;