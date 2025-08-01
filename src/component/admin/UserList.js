import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBaby,
  FaLock,
  FaUnlock,
  FaSearch,
  FaSmile,
  FaUser,
} from "react-icons/fa";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { getRegexEmail } from "../lib/utils";
import api from "../../api/axiosConfig";
export default function UserList() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [openModalCreateUser, setOpenModalCreateUser] = useState(false);
  const [form] = Form.useForm();
  const [roleTab, setRoleTab] = useState("user");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, search, roleTab]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://momsbest-be.onrender.com/api/admin/users",
        {
          params: { page, limit, search, role: roleTab },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      setError("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (id) => {
    try {
      await axios.patch(
        `https://momsbest-be.onrender.com/api/admin/users/${id}/toggle-active`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchUsers();
    } catch (error) {
      message.error(error.toString());
    }
  };

  const handleChangeRole = async (id, role) => {
    try {
      await axios.patch(
        `https://momsbest-be.onrender.com/api/admin/users/${id}/change-role`,
        { role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchUsers();
    } catch (error) {
      message.error(error.toString());
    }
  };

  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      await axios.post(
        `https://momsbest-be.onrender.com/api/admin/users`,
        {
          ...values,
          role: "user",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchUsers();
      setOpenModalCreateUser(false);
    } catch (error) {
      message.error(error.toString());
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center  justify-center h-80">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-300 mb-4"></div>
        <span className="text-pink-400 font-semibold text-lg">
          Đang tải danh sách tài khoản...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center font-semibold mt-8">{error}</div>
    );

  return (
    <div className="p-6 text-blue-600 min-h-screen bg-[url('https://images.pexels.com/photos/46160/field-clouds-sky-earth-46160.jpeg')] bg-cover bg-center">
      <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-pink-400">
        <FaBaby className="text-pink-300 text-3xl" /> Quản lý tài khoản
      </h1>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-full font-bold shadow-sm transition-all duration-200 text-lg ${
            roleTab === "user"
              ? "bg-pink-400 text-white scale-110"
              : "bg-white/80 text-pink-400 hover:bg-pink-100"
          }`}
          onClick={() => {
            setRoleTab("user");
            setPage(1);
          }}
        >
          Tài khoản User
        </button>
        <button
          className={`px-4 py-2 rounded-full font-bold shadow-sm transition-all duration-200 text-lg ${
            roleTab === "admin"
              ? "bg-pink-400 text-white scale-110"
              : "bg-white/80 text-pink-400 hover:bg-pink-100"
          }`}
          onClick={() => {
            setRoleTab("admin");
            setPage(1);
          }}
        >
          Tài khoản Admin
        </button>
      </div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm tên, email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-2 border-pink-200 rounded-2xl px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 text-gray-700 shadow-sm"
              />
              <FaSearch className="absolute right-3 top-3 text-pink-300" />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-pink-400 text-white rounded-2xl font-bold shadow-sm transition-all duration-200 hover:bg-pink-500 hover:scale-105"
            >
              Tìm kiếm
            </button>
          </div>
          <div className="text-pink-600 font-semibold bg-white/80 px-4 py-2 rounded-2xl shadow-sm">
            Tổng: {total} tài khoản
          </div>
        </div>
        <Button
          color="pink"
          variant="outlined"
          onClick={() => setOpenModalCreateUser(true)}
        >
          Thêm tài khoản
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/80 rounded-2xl shadow-xl">
          <thead className="items-center">
            <tr className="bg-pink-100 text-pink-600">
              <th className="px-4 py-3 rounded-tl-2xl font-bold text-left">
                Tên
              </th>
              <th className="px-4 py-3 font-bold text-left">Email</th>
              <th className="px-4 py-3 font-bold text-left">Vai trò</th>
              <th className="px-4 py-3 font-bold text-left">Trạng thái</th>
              <th className="px-4 py-3 rounded-tr-2xl font-bold text-left">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-pink-300">
                  <div className="flex flex-col items-center gap-2">
                    <FaSmile className="text-5xl mb-2 animate-bounce" />
                    <span className="font-semibold">
                      Không có tài khoản nào!
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-pink-50 items-center justify-start transition-colors duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FaUser className="text-pink-200" />
                    <span className="font-medium">{user.name}</span>
                  </td>
                  <td className="px-4 py-3 text-start">{user.email}</td>
                  <td className="px-4 py-3 text-start">
                    {roleTab === "user" ? (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleChangeRole(user._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 bg-pink-50 text-pink-600 font-semibold"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="font-semibold text-pink-600">Admin</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        user.is_active ? "text-green-500" : "text-gray-400"
                      }`}
                    >
                      {user.is_active ? (
                        <>
                          <FaUnlock className="inline text-green-400" /> Hoạt
                          động
                        </>
                      ) : (
                        <>
                          <FaLock className="inline text-gray-400" /> Đã khóa
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {roleTab === "user" ? (
                      <button
                        onClick={() => handleToggleActive(user._id)}
                        className={`px-4 py-2 rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center gap-2 text-white ${
                          user.is_active
                            ? "bg-pink-400 hover:bg-pink-500"
                            : "bg-blue-300 hover:bg-blue-400"
                        }`}
                      >
                        {user.is_active ? <FaLock /> : <FaUnlock />}
                        {user.is_active ? "Khóa" : "Mở khóa"}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-pink-600 font-semibold">
          Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)}{" "}
          trong tổng số {total} tài khoản
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`px-3 py-2 rounded-full font-bold shadow-sm transition-all duration-200 text-sm ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white/80 text-pink-400 hover:bg-pink-100 hover:scale-105"
            }`}
          >
            ← Trước
          </button>

          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => {
            const pageNumber = i + 1;
            // Hiển thị tối đa 5 trang, với logic để hiển thị trang hiện tại ở giữa
            if (
              pageNumber === 1 ||
              pageNumber === Math.ceil(total / limit) ||
              (pageNumber >= page - 1 && pageNumber <= page + 1)
            ) {
              return (
                <button
                  key={i}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-2 rounded-full font-bold shadow-sm transition-all duration-200 text-sm ${
                    page === pageNumber
                      ? "bg-pink-400 text-white scale-110"
                      : "bg-white/80 text-pink-400 hover:bg-pink-100 hover:scale-105"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (pageNumber === page - 2 || pageNumber === page + 2) {
              return (
                <span key={i} className="px-2 text-pink-400">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() =>
              setPage(Math.min(Math.ceil(total / limit), page + 1))
            }
            disabled={page === Math.ceil(total / limit)}
            className={`px-3 py-2 rounded-full font-bold shadow-sm transition-all duration-200 text-sm ${
              page === Math.ceil(total / limit)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white/80 text-pink-400 hover:bg-pink-100 hover:scale-105"
            }`}
          >
            Sau →
          </button>
        </div>
      </div>

      {!!openModalCreateUser && (
        <Modal
          open={openModalCreateUser}
          title="Tạo tài khoản"
          width="50vw"
          onCancel={() => setOpenModalCreateUser(false)}
          onOk={handleCreateUser}
        >
          <Form form={form} layout="vertical">
            <Row>
              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                    {
                      pattern: getRegexEmail(),
                      message: "Email sai định dạng",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Tên tài khoản"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </div>
  );
}
