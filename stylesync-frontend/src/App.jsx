import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ShopPage } from './pages/ShopPage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { EditProductPage } from './pages/EditProductPage';
import { RegisterPage } from './pages/RegisterPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} /> 
        <Route path="product/:productId" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} /> 

      </Route>
      {/* Rotas de Admin Protegidas */}
      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/edit-product/:productId" element={<EditProductPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;