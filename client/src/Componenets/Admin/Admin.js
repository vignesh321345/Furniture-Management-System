import { useEffect, useState } from "react";
import { useToken } from "../../TokenContext";

export default function Admin() {
  const { token } = useToken();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(" https://furniture-management-system-3.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4500/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(`http://localhost:4500/api/admin/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`http://localhost:4500/api/admin/product/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await fetch(`http://localhost:4500/api/admin/user/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers();
    } catch (err) {
      console.error("Update role error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <h3>Users</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => deleteUser(u._id)}>Delete</button>
                <button onClick={() => updateRole(u._id, "buyer")}>Make Buyer</button>
                <button onClick={() => updateRole(u._id, "seller")}>Make Seller</button>
                <button onClick={() => updateRole(u._id, "admin")}>Make Admin</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Products</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Uploaded By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>{p.price}</td>
              <td>{p.uploadedBy?.email || "N/A"}</td>
              <td>
                <button onClick={() => deleteProduct(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
