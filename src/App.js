import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
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

function App() {

  const { cart, setCart } = useCart()

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      setCart(JSON.parse(localStorage.getItem("cart")))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forumthreads/:threadId" element={<ThreadDetail />} />
        <Route
          path="/forum/library/article/:articleId"
          element={<ArticleDetail />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ChatbotButton />
      <ScrollToTopButton />
    </BrowserRouter>
  );
}

export default App;
