// src/pages/CreateProductPage.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProductLocally } from "../store/productSlice";

const CreateProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [image, setImage] = useState<string[]>([]); // Делаем image массивом строк
  const [error, setError] = useState("");

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Простая валидация
    if (!name || !description || !price || !image) {
      setError("Все поля обязательны!");
      return;
    }

    // Создаем новый продукт
    const newProduct = {
      id: Date.now(), // Генерируем уникальный id для нового продукта
      title: name,
      name,
      description,
      price: Number(price),
      images: image, // Сохраняем массив изображений
    };

    // Добавляем продукт в store
    dispatch(addProductLocally(newProduct)); // Добавляем новый продукт в Redux

    // После успешной отправки перенаправляем на главную страницу
    navigate("/");
  };

  // Обработчик для добавления нового изображения в массив
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    if (imageUrl && !image.includes(imageUrl)) {
      // Добавляем изображение в массив только если его там нет
      setImage([...image, imageUrl]);
    }
  };

  return (
    <div className="create-product-page">
      <h1>Создание нового продукта</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
          />
        </div>
        <div>
          <label>Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
          />
        </div>
        <div>
          <label>Цена</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={1}
          />
        </div>
        <div>
          <label>Изображение</label>
          <input
            type="text"
            placeholder="Введите URL изображения"
            onChange={handleAddImage} // Добавляем новое изображение в массив
            required
          />
        </div>
        <button type="submit">Создать продукт</button>
      </form>
    </div>
  );
};

export default CreateProductPage;
