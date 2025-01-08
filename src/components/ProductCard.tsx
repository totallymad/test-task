// src/components/ProductCard.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite, removeProduct } from "../store/productSlice";
import { RootState } from "../store/store";
import Product from "../types.ts";
import { Link } from "react-router-dom";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.products.favorites);

  const isFavorite = favorites.includes(product.id);

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-content">
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-image"
        />
        <div className="product-details">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">Price: ${product.price}</p>
          <p className="product-description">
            {product.description.slice(0, 100)}...
          </p>
        </div>
      </Link>
      <div className="product-actions">
        <button
          className={`like-button ${isFavorite ? "liked" : ""}`}
          onClick={() => dispatch(toggleFavorite(product.id))}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
        <button
          className="delete-button"
          onClick={() => dispatch(removeProduct(product.id))}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
