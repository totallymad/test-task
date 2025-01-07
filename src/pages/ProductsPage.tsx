import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchProducts, setFilter } from "../store/productSlice";
import ProductCard from "../components/ProductCard";
import "./ProductsPage.css";

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, filter, favorites, status } = useSelector(
    (state: RootState) => state.products
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Состояние для порядка сортировки

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Фильтруем продукты по поисковому запросу
  const filteredProducts = products.filter((product) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(lowercasedQuery) ||
      product.description.toLowerCase().includes(lowercasedQuery)
    );
  });

  // Дополнительный фильтр по избранным
  const displayedProducts =
    filter === "favorites"
      ? filteredProducts.filter((product) => favorites.includes(product.id))
      : filteredProducts;

  // Сортировка по цене
  const sortedProducts = displayedProducts.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price; // от меньшего к большему
    } else {
      return b.price - a.price; // от большего к меньшему
    }
  });

  // Рассчитываем индексы для текущей страницы
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "asc" | "desc");
  };

  if (status === "loading") {
    return <div className="products-page">Загрузка...</div>;
  }

  if (status === "failed") {
    return <div className="products-page">Ошибка при загрузке продуктов</div>;
  }

  return (
    <div className="products-page">
      <h1>Продукты</h1>

      {/* Поле поиска */}
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск по названию или описанию"
        />
      </div>

      {/* Сортировка по цене */}
      <div className="sort-container">
        <label>Сортировка по цене:</label>
        <select onChange={handleSortOrderChange} value={sortOrder}>
          <option value="asc">От меньшего к большему</option>
          <option value="desc">От большего к меньшему</option>
        </select>
      </div>

      <div className="filter-buttons">
        <button
          onClick={() => dispatch(setFilter("all"))}
          className={filter === "all" ? "active" : ""}
        >
          Все
        </button>
        <button
          onClick={() => {
            setCurrentPage(1);
            dispatch(setFilter("favorites"));
          }}
          className={filter === "favorites" ? "active" : ""}
        >
          Избранное
        </button>
      </div>

      <div className="products-list">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Назад
        </button>
        <span>
          {totalPages ? `Страница ${currentPage} из ${totalPages}` : null}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!totalPages}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
