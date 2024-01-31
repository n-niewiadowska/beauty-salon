import { useRouter } from "next/router";
import Link from "next/link";
import stripHtmlTags from "@/app/utils/stripHtmlTags";
import { useProducts } from "@/app/store/contexts";
import { MainLayoutContainer } from "../components/main-layout";


const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { products } = useProducts();
  const product = products.products.find(p => p.id === Number(id));

  return (
    <MainLayoutContainer>
      <Link href="/recommendations" className="normal-link">Go back</Link>
      {product ? (
        <div className="product-details">
          <img className="main-product-img" src={product.image} alt={product.name} />
          <div className="product-info">
            <h1>{product.name}</h1>
            <h3>by {product.brand}</h3>
            <p>Type: {product.product_type}</p>
            <p>Tags: {product.tag_list.join(", ")}</p>
            <p>Price: {product.price}{product.price_sign}</p>
            <p>{stripHtmlTags(product.description)}</p>
          </div>
        </div>
        ) : (
          <div>Product not found.</div>
      )}
    </MainLayoutContainer>
  );
}

export default ProductDetails;