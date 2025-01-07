import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../store/store";
import Product from "../types";

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();

  // Получаем все продукты из Redux
  const { products } = useSelector((state: RootState) => state.products);

  const navigate = useNavigate();

  if (!productId) {
    return <h2>Product not found</h2>;
  }

  const product = products.find((p: Product) => p.id === parseInt(productId));

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <img
        src={product.images[0]}
        alt={product.title}
        width={300}
        height={300}
      />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ProductPage;
