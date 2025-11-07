import { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { useProfileContext } from '../operations/Customer/ProfileContext';
import { useNavigate } from "react-router-dom";
import { useToken } from "../../TokenContext";

function Login() {
  const { setStatus, setProfileId } = useProfileContext();
  const{setToken}=useToken();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoginValid = email && password;
const handleLogin = async () => {
  setLoading(true);
  try {
    const res = await axios.post(" https://furniture-management-system-1.onrender.com/api/user/login", {
      email,
      password,
    });

    const value = res.data;
    console.log(value);

    localStorage.setItem("role", value.role); // Save role locally
    setToken(value.token);
    setProfileId(value.id);
    setStatus(true);
    setSuccess(value.message);
    setErr("");
    setEmail("");
    setPassword("");

    // ✅ Redirect based on role
    if (value.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (e) {
    setErr(e.response?.data?.message || "An error occurred during login.");
    setSuccess("");
    setStatus(false);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className={styles.body}>
      <div className={styles.loginContainer}>
        <h1 className={styles.heading}>Login</h1>
        {err && <div className={styles.errorMessage}>{err}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        <div className={styles.inputs}>
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

          <div className={styles.forgot}>
            <p>
              Forgot Password? <span>Click here</span>
            </p>
          </div>
        </div>

        <div className={styles.formBtns}>
          <button
            className={`${styles.btn} ${styles.active}`}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          <button
            className={`${styles.btn} ${styles.active}`}
            onClick={handleLogin}
            disabled={!isLoginValid}
          >
            Login
          </button>
        </div>

        {loading && <div className={styles.loadingAnimation}>Loading...</div>}
      </div>
    </div>
  );
}

export default Login;
