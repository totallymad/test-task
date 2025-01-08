import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProductLocally } from "../store/productSlice";
import "./CreateProductPage.css";

const CreateProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [image, setImage] = useState<string[]>([]); // Делаем image массивом строк
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !image) {
      setError("Все поля обязательны!");
      return;
    }

    const newProduct = {
      id: Date.now(),
      title: name,
      name,
      description,
      price: Number(price),
      images: image,
    };

    dispatch(addProductLocally(newProduct));

    navigate("/");
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    if (imageUrl && !image.includes(imageUrl)) {
      setImage([...image, imageUrl]);
    }
  };

  return (
    <div className="create-product">
      <h1>Создание нового продукта</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
          />
        </div>
        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
          />
        </div>
        <div className="form-group">
          <label>Цена</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={1}
          />
        </div>
        <div className="form-group">
          <label>Изображение</label>
          <input
            type="text"
            placeholder="Введите URL изображения"
            onChange={handleAddImage}
            required
          />
        </div>
        <button type="submit">Создать продукт</button>
      </form>
    </div>
  );
};

export default CreateProductPage;
