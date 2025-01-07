// // src/store/productsSlice.ts
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import Product from "../types.ts";

// interface ProductsState {
//   products: Product[];
//   favorites: number[];
//   filter: "all" | "favorites";
//   status: "idle" | "loading" | "failed";
//   deletedProducts: number[]; // Массив удаленных продуктов
//   addedProducts: number[];
// }

// const initialState: ProductsState = {
//   products: [],
//   favorites: [],
//   filter: "all",
//   status: "idle",
//   deletedProducts: [], // Изначально пустой список удаленных продуктов
//   addedProducts: [], // Изначально пустой список добавленных продуктов
// };

// // Асинхронный запрос для загрузки продуктов
// export const fetchProducts = createAsyncThunk(
//   "products/fetchProducts",
//   async () => {
//     const response = await axios.get(
//       "https://dummyjson.com/products?limit=50&skip=10"
//     );

//     return response.data.products;
//   }
// );

// const productsSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {
//     toggleFavorite: (state, action: PayloadAction<number>) => {
//       const id = action.payload;
//       if (state.favorites.includes(id)) {
//         state.favorites = state.favorites.filter((favId) => favId !== id);
//       } else {
//         state.favorites.push(id);
//       }
//     },
//     removeProduct: (state, action: PayloadAction<number>) => {
//       // Добавляем продукт в массив удаленных продуктов
//       state.deletedProducts.push(action.payload);

//       // Удаляем продукт из списка продуктов
//       state.products = state.products.filter(
//         (product) => product.id !== action.payload
//       );

//       // Убираем удаленный продукт из избранных, если он был там
//       state.favorites = state.favorites.filter(
//         (favId) => favId !== action.payload
//       );
//     },
//     setFilter: (state, action: PayloadAction<"all" | "favorites">) => {
//       state.filter = action.payload;
//     },
//     addProduct: (state, action: PayloadAction<Product>) => {
//       state.products.push(action.payload); // Добавляем новый продукт
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.status = "idle";
//         // Фильтруем удаленные продукты, чтобы они не появлялись в списке
//         state.products = action.payload.filter(
//           (product: { id: number }) =>
//             !state.deletedProducts.includes(product.id)
//         );
//       })
//       .addCase(fetchProducts.rejected, (state) => {
//         state.status = "failed";
//       });
//   },
// });

// export const { toggleFavorite, removeProduct, setFilter, addProduct } =
//   productsSlice.actions;

// export default productsSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Product from "../types.ts";

interface ProductsState {
  products: Product[]; // Общий массив продуктов
  addedProducts: Product[]; // Локальные добавленные продукты
  favorites: number[]; // Избранные продукты
  filter: "all" | "favorites"; // Фильтр
  status: "idle" | "loading" | "failed"; // Статус загрузки
  deletedProducts: number[]; // Массив удаленных продуктов
}

const initialState: ProductsState = {
  products: [],
  addedProducts: [], // Локальные добавленные продукты
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

      // Удаляем продукт из массива `products`
      state.products = state.products.filter(
        (product) => product.id !== productId
      );

      // Удаляем продукт из массива `addedProducts`
      state.addedProducts = state.addedProducts.filter(
        (product) => product.id !== productId
      );

      // Убираем удаленный продукт из избранных, если он был там
      state.favorites = state.favorites.filter((favId) => favId !== productId);

      // Добавляем продукт в массив удаленных продуктов
      state.deletedProducts.push(productId);
    },
    setFilter: (state, action: PayloadAction<"all" | "favorites">) => {
      state.filter = action.payload;
    },
    addProductLocally: (state, action: PayloadAction<Product>) => {
      state.addedProducts.push(action.payload); // Добавляем продукт в локальный массив
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "idle";
        // Фильтруем удаленные продукты, чтобы они не появлялись в списке
        // и добавляем как локальные добавленные продукты, так и данные с сервера
        state.products = [
          ...action.payload.filter(
            (product: { id: number }) =>
              !state.deletedProducts.includes(product.id)
          ),
          ...state.addedProducts, // Добавляем локальные добавленные продукты
        ];
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { toggleFavorite, removeProduct, setFilter, addProductLocally } =
  productsSlice.actions;

export default productsSlice.reducer;
