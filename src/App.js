import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Outlet,
} from "react-router-dom";

import Header from "./component/layouts/Header";
import Footer from "./component/layouts/Footer";
import HomePage from "./component/pages/HomePage";
import NotFound from "./component/pages/NotFound";
import Products from "./component/pages/Products";
import About from "./component/pages/About";
import ScrollToTop from "./component/ScrollTop";
import Forum from "./component/pages/Forum";
import ThreadDetail from "./component/pages/ThreadDetail";
import ArticleDetail from "./component/pages/ArticleDetail";
import ProductDetail from "./component/pages/ProductDetail";
import Checkout from "./component/pages/Checkout";
import { useCart } from "./component/context/CartContext";
import LoginPage from "./component/pages/LoginPage";
import ProfilePage from "./component/pages/ProfilePage";
import ChatbotButton from "./component/ui/ChatbotButton";
import ScrollToTopButton from "./component/ui/ScrollToTopButton";
import { useEffect } from "react";
import AdminSidebar from "./component/admin/AdminSidebar";
import AdminDashboard from "./component/admin/AdminDashboard";
import UserList from "./component/admin/UserList";
import ProductList from "./component/admin/ProductList";
import CategoryList from "./component/admin/CategoryList";
import OrderList from "./component/admin/OrderList";
import ForumThreadList from "./component/admin/ForumThreadList";
import ForumCommentList from "./component/admin/ForumCommentList";
import AdminRoute from "./component/admin/AdminRoute";
import CategoryProductList from "./component/admin/CategoryProductList";
function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const { cart, setCart } = useCart();

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      setCart(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="categoryproducts" element={<CategoryProductList />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="forumthreads" element={<ForumThreadList />} />
          <Route path="forumcomments" element={<ForumCommentList />} />
        </Route>
        <Route
          path="/"
          element={
            <>
              <Header />
              <HomePage />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <LoginPage />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="/forum"
          element={
            <>
              <Header />
              <Forum />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="/forumthreads/:threadId"
          element={
            <>
              <Header />
              <ThreadDetail />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="/forum/library/article/:articleId"
          element={
            <>
              <Header />
              <ArticleDetail />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Header />
              <ProfilePage />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <Header />
              <Products />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <>
              <Header />
              <ProductDetail />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header />
              <About />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <Header />
              <Checkout />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Header />
              <NotFound />
              <Footer />
              <ChatbotButton />
              <ScrollToTopButton />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
