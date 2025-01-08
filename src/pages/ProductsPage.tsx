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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMethod, setSortMethod] = useState("none");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(lowercasedQuery) ||
      product.description.toLowerCase().includes(lowercasedQuery)
    );
  });

  const displayedProducts =
    filter === "favorites"
      ? filteredProducts.filter((product) => favorites.includes(product.id))
      : filteredProducts;

  const sortedProducts = [...displayedProducts].sort((a, b) => {
    if (sortMethod === "alphabetical") {
      return a.title.localeCompare(b.title);
    } else if (sortMethod === "priceAsc") {
      return a.price - b.price;
    } else if (sortMethod === "priceDesc") {
      return b.price - a.price;
    }
    return 0;
  });

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

  if (status === "loading") {
    return <div className="products-page">Загрузка...</div>;
  }

  if (status === "failed") {
    return <div className="products-page">Ошибка при загрузке продуктов</div>;
  }

  return (
    <div className="products-page">
      <h1>Продукты</h1>

      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск по названию или описанию"
        />
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

      <div className="sort-buttons">
        <button
          onClick={() => setSortMethod("none")}
          className={sortMethod === "none" ? "active" : ""}
        >
          Без сортировки
        </button>
        <button
          onClick={() => setSortMethod("alphabetical")}
          className={sortMethod === "alphabetical" ? "active" : ""}
        >
          По алфавиту
        </button>
        <button
          onClick={() => setSortMethod("priceAsc")}
          className={sortMethod === "priceAsc" ? "active" : ""}
        >
          Цена: по возрастанию
        </button>
        <button
          onClick={() => setSortMethod("priceDesc")}
          className={sortMethod === "priceDesc" ? "active" : ""}
        >
          Цена: по убыванию
        </button>
      </div>

      <div className="products-list">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages ? (
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
            disabled={!totalPages || currentPage === totalPages}
          >
            Вперед
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductsPage;
