import React from "react";
import Parent from "./Componenets/Parent/Parent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Componenets/Login/Login";
import Cart from "./Componenets/operations/cart/Cart";
import Fav from "./Componenets/operations/Favourites/Fav";
import Customer from "./Componenets/operations/Customer/Customer";
import { ProductProvider } from "./Componenets/operations/ProductContext";
import { ProfileProvider } from "./Componenets/operations/Customer/ProfileContext";
import { TokenProvider } from "./TokenContext";
import Register from "./Componenets/Register/Register";
import Admin from "./Componenets/Admin/Admin";
import ProtectedRoute from "./Componenets/ProtectedRoute"; // ✅ import it
import AdminDashboard from "./Componenets/Admin/AdminDashboard";

function App() {
  return (
    <TokenProvider>
      <ProfileProvider>
        <ProductProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Parent />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/fav" element={<Fav />} />
              <Route path="/customer" element={<Customer />} />

              {/* ✅ Protected Admin Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ProductProvider>
      </ProfileProvider>
    </TokenProvider>
  );
}

export default App;
