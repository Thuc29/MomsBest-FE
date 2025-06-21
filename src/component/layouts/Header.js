import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import {
  Home,
  EventAvailable,
  AccountCircle,
  Menu as MenuIcon,
  Close,
  Category,
  PregnantWoman,
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import CartModal from "../pages/CartModal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [language, setLanguage] = useState("vi");
  const [showCartModal, setShowCartModal] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLanguage = () => setLanguage(language === "vi" ? "en" : "vi");

  const menuItems = [
    {
      title: language === "vi" ? "Trang chủ" : "Home",
      path: "/",
      icon: <Home className="text-pink-200" />,
    },
    {
      title: language === "vi" ? "Diễn đàn" : "Forum",
      path: "/forum",
      icon: <PregnantWoman className="w-5 h-5 text-pink-500" />,
    },
    {
      title: language === "vi" ? "Sản phẩm" : "Products",
      path: "/products",
      icon: <Category className="text-blue-400" />,
    },

    {
      title: language === "vi" ? "Giới thiệu" : "About",
      path: "/about",
      icon: <EventAvailable className="text-purple-400" />,
    },
  ];

  const location = useLocation();

  const { cart } = useCart();
  console.log("cart", cart);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate()

  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent shadow-sm font-space-grotesk">
      <Container className="px-4 py-4 ">
        <Navbar expand="md" className="p-0 flex items-center justify-between">
          <Navbar.Brand
            as={Link}
            to="/"
            className="flex p-2 bg-white/90 shadow-xl rounded-full items-center gap-2"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
              Mẹ & Bé
            </span>
          </Navbar.Brand>
          <div className="hidden p-2 bg-white/90 shadow-xl rounded-full md:flex items-center space-x-2">
            {menuItems.map((item, index) => {
              const isActive =
                (item.path && location.pathname === item.path) ||
                (item.subMenu &&
                  item.subMenu.some((sub) => location.pathname === sub.path));
              return (
                <div key={index} className="relative group">
                  {/* Menu item as Button */}
                  <Button
                    component={Link}
                    to={item.path || "#"}
                    onMouseDown={(e) =>
                      e.currentTarget.classList.add(
                        "!bg-pink-400",
                        "!text-white"
                      )
                    }
                    onMouseUp={(e) =>
                      e.currentTarget.classList.remove(
                        "!bg-pink-400",
                        "!text-white"
                      )
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.classList.remove(
                        "!bg-pink-400",
                        "!text-white"
                      )
                    }
                    onClick={() =>
                      item.subMenu && setIsServicesOpen(!isServicesOpen)
                    }
                    className={`!text-sm !font-medium !font-space-grotesk !flex !items-center !gap-2 !px-4 border !py-2 !rounded-full !transition-all !duration-300 !ease-in-out ${isActive
                      ? "!bg-pink-300 !text-white"
                      : "!text-gray-700 hover:!bg-pink-100 hover:!text-pink-400"
                      }`}
                    style={{ minWidth: "unset", color: "white" }}
                  >
                    {item.icon}
                    {item.title}
                    {item.subMenu && (
                      <span>
                        <ArrowDropDown />
                      </span>
                    )}
                  </Button>

                  {/* Dropdown submenu */}
                  {item.subMenu && (
                    <div className="absolute left-0 w-40 bg-white shadow-md rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-20">
                      {item.subMenu.map((subItem, subIndex) => {
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <Button
                            key={subIndex}
                            component={Link}
                            to={subItem.path}
                            onMouseDown={(e) =>
                              e.currentTarget.classList.add(
                                "!bg-pink-400",
                                "!text-white"
                              )
                            }
                            onMouseUp={(e) =>
                              e.currentTarget.classList.remove(
                                "!bg-pink-400",
                                "!text-white"
                              )
                            }
                            onMouseLeave={(e) =>
                              e.currentTarget.classList.remove(
                                "!bg-pink-400",
                                "!text-white"
                              )
                            }
                            className={`!w-full !flex !outline-none !items-center !gap-2 !px-4 !py-2 !rounded-lg !transition-colors !duration-300 !ease-in-out !justify-start !text-sm !font-medium !font-space-grotesk ${isSubActive
                              ? "!bg-pink-400 !text-white"
                              : "!text-gray-700 hover:!bg-pink-100 hover:!text-pink-400"
                              }`}
                            style={{ justifyContent: "flex-start" }}
                          >
                            {subItem.icon}
                            {subItem.title}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="hidden md:flex items-center p-2 bg-white/90 shadow-xl rounded-full gap-2">
            {user ? (
              <>
                <Link to="/profile">
                  <Button
                    variant="outlined"
                    className="!rounded-full !font-space-grotesk !border  !border-pink-600/70 !bg-pink-100 !text-pink-600 px-3 py-1 text-sm font-medium hover:!bg-pink-200 transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    <AccountCircle className="w-5 h-5" />
                    {user.name || user.email}
                  </Button>
                </Link>
                <Button
                  variant="outlined"
                  onClick={() => logout(navigate)}
                  className="!rounded-full !font-space-grotesk !border !border-pink-400 !text-pink-400 !px-4 !py-1 !text-sm !font-medium hover:!bg-pink-400 hover:!text-white !transition-all !duration-300 flex items-center gap-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="outlined"
                  className="!rounded-full !font-space-grotesk !border  !border-pink-600/70 !bg-pink-100 !text-pink-600 px-3 py-1 text-sm font-medium hover:!bg-pink-200 transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <AccountCircle className="w-5 h-5" />
                  {language === "vi" ? "Đăng nhập" : "SignIn"}
                </Button>
              </Link>
            )}

            <Button
              variant="text"
              onClick={toggleLanguage}
              className="!text-sm !font-medium !font-space-grotesk  !text-gray-600 hover:!text-pink-400 !p-1"
            >
              {language === "vi" ? "EN" : "VI"}
            </Button>
            <Button
              className="!rounded-full !p-2 !bg-pink-100 !text-pink-600 hover:!bg-pink-200 relative"
              style={{ minWidth: 0 }}
              onClick={() => setShowCartModal(true)}
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {totalItems}
              </span>
            </Button>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="text"
              onClick={toggleLanguage}
              className="text-sm font-medium text-gray-600 hover:text-pink-400 p-1"
            >
              {language === "vi" ? "EN" : "VI"}
            </Button>
            <button
              onClick={toggleMenu}
              className="border-0 p-2 text-gray-600 hover:text-pink-400"
            >
              {isOpen ? (
                <Close className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </Navbar>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md z-40 p-4 flex flex-col items-center gap-4 transition-all duration-300 ease-in-out">
            {menuItems.map((item, index) => (
              <div key={index} className="w-full items-center">
                {item.subMenu ? (
                  // Nếu có submenu (Dịch vụ)
                  <div>
                    <button
                      className="w-full text-sm font-medium text-gray-700 hover:text-pink-400 transition-colors py-2 flex items-center justify-center"
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.title}
                      </span>
                      <span>
                        {isServicesOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                      </span>
                    </button>
                    {/* Hiển thị submenu nếu mở */}
                    <div
                      className={`flex flex-col font-space-grotesk gap-2 items-center justify-center transition-all duration-300 ease-in-out ${isServicesOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                    >
                      {item.subMenu.map((subItem, subIndex) => (
                        <Nav.Link
                          key={subIndex}
                          as={Link}
                          to={subItem.path}
                          className={`text-sm font-medium flex items-center gap-2 py-1 transition-colors duration-300 ease-in-out ${location.pathname === subItem.path
                            ? "text-pink-400"
                            : "text-gray-600 hover:text-pink-400"
                            }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.icon}
                          {subItem.title}
                        </Nav.Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Nếu không có submenu
                  <Nav.Link
                    as={Link}
                    to={item.path}
                    className={`text-sm font-medium flex items-center justify-center gap-2 w-full py-2 transition-colors duration-300 ease-in-out ${location.pathname === item.path
                      ? "text-pink-400"
                      : "text-gray-700 hover:text-pink-400"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.title}
                  </Nav.Link>
                )}
              </div>
            ))}

            {/* Nút đăng nhập / đăng ký */}
            <Link to="/login">
              <Button
                variant="outlined"
                className="!rounded-full !font-space-grotesk  !border-pink-400 !text-pink-400 !px-4 !py-1 !text-sm !font-medium hover:!bg-pink-400 hover:!text-white !transition-all !duration-300 flex items-center justify-center gap-2 w-full"
              >
                <AccountCircle className="w-5 h-5" />
                {language === "vi" ? "Đăng nhập" : "SignIn"}
              </Button>
            </Link>

            <Button
              className="!rounded-full !p-2 !bg-pink-100 !text-pink-600 hover:!bg-pink-200 relative"
              style={{ minWidth: 0 }}
              onClick={() => setShowCartModal(true)}
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {totalItems}
              </span>
            </Button>
          </div>
        )}
      </Container>
      <CartModal
        open={showCartModal}
        onClose={() => setShowCartModal(false)}
        cart={cart}
      />
    </header>
  );
};

export default Header;
