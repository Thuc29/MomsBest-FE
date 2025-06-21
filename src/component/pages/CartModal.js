import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, X, ArrowLeft } from "lucide-react";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import { useCart } from "../context/CartContext";


const initialCart = [
  {
    id: 1,
    name: "Sữa bột Dielac Mama",
    price: 299000,
    image: "/assets/banner1.jpg",
    quantity: 2,
  },
  {
    id: 2,
    name: "Tã dán Huggies size NB",
    price: 145000,
    image: "/assets/banner1.jpg",
    quantity: 1,
  },
];

export default function CartModal({ open, onClose, cart = initialCart }) {

  const navigate = useNavigate();
  const { removeFromCart, updateQuantity } = useCart()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex text-black items-center justify-center">
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 animate-fadeIn overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-pink-500 p-2 rounded-full bg-gray-100"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
          <ShoppingCart /> Giỏ hàng của bạn
          <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
            {totalItems}
          </span>
        </h2>
        {cart.length === 0 ? (
          <div className="bg-white/80 p-8 rounded-xl shadow text-center">
            Giỏ hàng trống.{" "}
            <Link
              to="/products"
              className="text-pink-500 underline"
              onClick={onClose}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full mb-4 text-sm md:text-base">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th></th>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="py-2">
                        <Link to={`/products/${item.id}`} onClick={onClose}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded shadow"
                          />
                        </Link>
                      </td>
                      <td className="py-2">
                        <Link
                          to={`/products/${item.id}`}
                          className="text-pink-600 font-semibold hover:underline"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-2">{item.price.toLocaleString()}đ</td>
                      <td className="py-2 font-bold">
                        <div className="flex items-center gap-x-4">
                          <MinusOutlined
                            className="cursor-pointer"
                            onClick={() => updateQuantity(item?._id, -1)}
                          />
                          <div>{item.quantity}</div>
                          <PlusOutlined
                            className="cursor-pointer"
                            onClick={() => updateQuantity(item?._id, 1)}
                          />
                        </div>
                      </td>
                      <td className="py-2 font-bold">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </td>
                      <td>
                        <DeleteOutlined
                          className="cursor-pointer"
                          onClick={() => removeFromCart(item?._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-end gap-2 mb-4">
              <div className="text-lg">
                Tạm tính:{" "}
                <span className="font-bold">{subtotal.toLocaleString()}đ</span>
              </div>
              <div className="text-2xl font-bold text-pink-600">
                Tổng cộng: {subtotal.toLocaleString()}đ
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition"
              >
                <ArrowLeft size={18} /> Tiếp tục mua sắm
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
                className="flex-1 bg-pink-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-pink-600 transition"
              >
                Tiến hành Thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
