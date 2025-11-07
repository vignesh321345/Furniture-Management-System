import { useEffect, useState } from "react";
import axios from "axios";
import { useToken } from "../../TokenContext";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { token } = useToken();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [sales, setSales] = useState([]);


  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchPendingAdmins();
    fetchSales(); 
  }, []);

  const fetchSales = async () => {
  try {
    const res = await axios.get("http://localhost:4500/api/admin/sale", { headers });
    setSales(res.data);
  } catch (err) {
    console.error("Failed to fetch sales:", err);
  }
};

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/admin/users", { headers });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/admin/products", { headers });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchPendingAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/admin/admin-requests", { headers });
      setPendingAdmins(res.data.users);
    } catch (err) {
      console.error("Failed to fetch pending admins:", err);
    }
  };

  const updateRole = async (id, role) => {
    console.log(role);
    try {
      await axios.put(`http://localhost:4500/api/admin/user/${id}/role`, { role }, { headers });
      fetchUsers();
      fetchPendingAdmins();
    } catch (err) {
      console.error("Role update failed:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:4500/api/admin/user/${id}`, { headers });
      fetchUsers();
    } catch (err) {
      console.error("User delete failed:", err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:4500/api/admin/product/${id}`, { headers });
      fetchProducts();
    } catch (err) {
      console.error("Product delete failed:", err);
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>
        <ul className="admin-tabs">
          <li><button onClick={() => setTab("users")} className="admin-tab-btn">Manage Users</button></li>
          <li><button onClick={() => setTab("products")} className="admin-tab-btn">Manage Products</button></li>
          <li><button onClick={() => setTab("approvals")} className="admin-tab-btn">Admin Approvals</button></li>
          <li><button onClick={() => setTab("sales")} className="admin-tab-btn">View Sales</button></li>

        </ul>
      </aside>

      <main className="admin-main">
        {tab === "users" && (
          <div>
            <h3 className="admin-section-title">All Users</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="admin-actions">
                      <button onClick={() => updateRole(user._id, "buyer")}>Buyer</button>
                      <button onClick={() => updateRole(user._id, "seller")}>Seller</button>
                      <button onClick={() => updateRole(user._id, "admin")}>Admin</button>
                      <button onClick={() => deleteUser(user._id)} className="danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "products" && (
          <div>
            <h3 className="admin-section-title">All Products</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>{product.title}</td>
                    <td>₹{product.price}</td>
                    <td>
                      <button onClick={() => deleteProduct(product._id)} className="danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "approvals" && (
          <div>
            <h3 className="admin-section-title">Pending Admin Requests</h3>
            {pendingAdmins.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <ul className="admin-approval-list">
                {pendingAdmins.map(user => (
                  <li key={user._id} className="admin-approval-item">
                    {user.name} - {user.email}
                    <button onClick={() => updateRole(user._id, "admin")}>Approve as Admin</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "sales" && (
  <div>
    <h3 className="admin-section-title">All Sales</h3>
    {sales.length === 0 ? (
      <p>No sales found.</p>
    ) : (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Product</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id}>
              <td>{sale.id?.name}</td>
              <td>{sale.id?.email}</td>
              <td>{sale.productTitle}</td>
              <td>₹{sale.amount}</td>
              <td>{new Date(sale.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

      </main>
    </div>
  );
}
