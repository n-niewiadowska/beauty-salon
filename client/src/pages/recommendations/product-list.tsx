import Link from "next/link";
import { useProducts } from "@/app/store/contexts";
import { Product } from "@/app/types/productTypes";


export const ProductList = () => {
  const { products } = useProducts();
  const recommendations = products.filteredProducts;

  return (
    <div className="product-grid">
      {recommendations.map((product: Product) => (
        <div key={product.id}>
          <Link href={`/recommendations/${product.id}`}>
              <img className="product-img" src={product.image} alt={product.name} />
          </Link>
          <p className="product-name">{product.name}</p>
          <p>{product.brand}</p>
          <p>{product.price}{product.price_sign}</p>
        </div>
      ))}
    </div>
  );
}