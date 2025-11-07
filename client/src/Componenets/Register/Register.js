// Modified Register.js with role selection
import { useState } from "react";
import styles from "../Login/Login.module.css";
import axios from "axios";
import { useProfileContext } from '../operations/Customer/ProfileContext';
import { useNavigate } from "react-router-dom";

function Register() {
  const { setStatus } = useProfileContext();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhone] = useState("");
  const [role, setRole] = useState("buyer");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignupValid = name && email && password && phonenumber && role;

  const handleSignup = async () => {
    setLoading(true);
    try {
      await axios.post(" https://furniture-management-system-3.onrender.com/api/user/register", {
        name,
        email,
        password,
        phonenumber,
        role,
      });

      setSuccess("Successfully registered!");
      localStorage.setItem("role", "admin");

      setErr("");
      setStatus(true);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("buyer");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (e) {
      setErr(e.response?.data?.message || "An error occurred during signup.");
      setSuccess("");
      setStatus(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.loginContainer}>
        <h1 className={styles.heading}>Sign Up</h1>
        {err && <div className={styles.errorMessage}>{err}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        <div className={styles.inputs}>
          <div className={styles.input}>
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.input}>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.input}>
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.input}>
            <label>Phone Number:</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phonenumber}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className={styles.input}>
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className={styles.formBtns}>
          <button
            className={`${styles.btn} ${styles.active}`}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className={`${styles.btn} ${styles.active}`}
            onClick={handleSignup}
            disabled={!isSignupValid}
          >
            Register
          </button>
        </div>

        {loading && <div className={styles.loadingAnimation}>Loading...</div>}
      </div>
    </div>
  );
}

export default Register;