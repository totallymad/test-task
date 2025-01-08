import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../store/store";
import { editProductLocally } from "../store/productSlice";
import Product from "../types";
import { useState } from "react";
import "./ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);
  const navigate = useNavigate();

  const product = products.find((p: Product) => p.id === parseInt(productId));

  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(
    product || null
  );
  if (!productId) {
    return <h2>Product not found</h2>;
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editedProduct) {
      setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
    }
  };

  const handleSave = () => {
    if (editedProduct) {
      dispatch(editProductLocally(editedProduct));
      setIsEditing(false);
    }
  };

  return (
    <div className="product-page">
      {isEditing ? (
        <div className="edit-form">
          <h1>Редактировать продукт</h1>
          <input
            type="text"
            name="title"
            value={editedProduct?.title || ""}
            onChange={handleInputChange}
            placeholder="Название"
          />
          <textarea
            name="description"
            value={editedProduct?.description || ""}
            onChange={handleInputChange}
            placeholder="Описание"
          />
          <input
            type="number"
            name="price"
            value={editedProduct?.price || 0}
            onChange={handleInputChange}
            placeholder="Цена"
          />
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </div>
      ) : (
        <>
          <h1>{product.title}</h1>
          <img src={product.images[0]} alt={product.title} />
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
          <button onClick={() => navigate(-1)}>Назад</button>
        </>
      )}
    </div>
  );
};

export default ProductPage;