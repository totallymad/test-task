import { Provider } from "react-redux";
import { store } from "./store/store";

import ProductsPage from "./pages/ProductsPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import CreateProductPage from "./pages/CreateProductPage";
import Layout from "./ui/Layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route element={<Layout />}>
            {/* <Route path="/" element={<Navigate to="/products" replace />} /> */}
            <Route path="/" element={<ProductsPage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/create-product" element={<CreateProductPage />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
