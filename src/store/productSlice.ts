import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Product from "../types.ts";

interface ProductsState {
  products: Product[]; // Общий массив продуктов
  addedProducts: Product[]; // Локальные добавленные продукты
  updatedProducts: Product[]; // Локально измененные продукты
  favorites: number[]; // Избранные продукты
  filter: "all" | "favorites"; // Фильтр
  status: "idle" | "loading" | "failed"; // Статус загрузки
  deletedProducts: number[]; // Массив удаленных продуктов
}

const initialState: ProductsState = {
  products: [],
  addedProducts: [],
  updatedProducts: [], // Инициализация массива измененных продуктов
  favorites: [],
  filter: "all",
  status: "idle",
  deletedProducts: [],
};

// Асинхронный запрос для загрузки продуктов с сервера
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(
      "https://dummyjson.com/products?limit=50&skip=10"
    );
    return response.data.products;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((favId) => favId !== id);
      } else {
        state.favorites.push(id);
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      const productId = action.payload;

      state.products = state.products.filter(
        (product) => product.id !== productId
      );
      state.addedProducts = state.addedProducts.filter(
        (product) => product.id !== productId
      );
      state.updatedProducts = state.updatedProducts.filter(
        (product) => product.id !== productId
      );
      state.favorites = state.favorites.filter((favId) => favId !== productId);
      state.deletedProducts.push(productId);
    },
    setFilter: (state, action: PayloadAction<"all" | "favorites">) => {
      state.filter = action.payload;
    },
    addProductLocally: (state, action: PayloadAction<Product>) => {
      state.addedProducts.push(action.payload);
    },
    editProductLocally: (state, action: PayloadAction<Product>) => {
      const updatedProduct = action.payload;

      const indexInProducts = state.products.findIndex(
        (product) => product.id === updatedProduct.id
      );

      if (indexInProducts !== -1) {
        state.products[indexInProducts] = updatedProduct;
      }

      // Добавляем продукт в массив `updatedProducts`
      const indexInUpdated = state.updatedProducts.findIndex(
        (product) => product.id === updatedProduct.id
      );
      if (indexInUpdated !== -1) {
        state.updatedProducts[indexInUpdated] = updatedProduct;
      } else {
        state.updatedProducts.push(updatedProduct);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "idle";

        // Объединяем данные с сервера и локально измененные данные
        const fetchedProducts = action.payload.filter(
          (product: { id: number }) =>
            !state.deletedProducts.includes(product.id)
        );

        // Применяем локальные изменения, если они существуют
        const mergedProducts = fetchedProducts.map((product: { id: number; }) => {
          const updatedProduct = state.updatedProducts.find(
            (updated) => updated.id === product.id
          );
          return updatedProduct || product;
        });

        state.products = [...mergedProducts, ...state.addedProducts];
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  toggleFavorite,
  removeProduct,
  setFilter,
  addProductLocally,
  editProductLocally,
} = productsSlice.actions;

export default productsSlice.reducer;
