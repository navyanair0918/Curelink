import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "./services/api";
import styles from "./AuthLayoutStyles";
import "./Auth.css";
import "./AuthResponsive.css";
import "./AuthFullPage.css";

function Login({ onSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!email || !password) {
      setMessage("All fields are required");
      setType("error");
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage("Enter a valid Gmail address");
      setType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Normalize role to lowercase before sending
      const normalizedRole = role.toLowerCase();
      const response = await authAPI.login({ email, password, role: normalizedRole });
      
      if (response.data.success) {
        // Store token and user info
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isLoggedIn", "true");
        
        setMessage(response.data.message);
        setType("success");

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          // Redirect based on role
          if (response.data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 800);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setMessage(errorMessage);
      setType("error");
    }
  };

  return (
    <div className="auth-page-wrapper" style={styles.page}>
      {/* Navigation */}
      <div style={styles.navBar}>
        <Link to="/" style={styles.navLink} className="auth-nav-link">← Back to Home</Link>
        <Link to="/register" style={styles.navLink} className="auth-nav-link">Don't have an account? Register</Link>
      </div>

      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* LEFT */}
        <div style={styles.left}>
          <h2 style={styles.title}>Login to CureLink</h2>

          {/* ROLE TOGGLE */}
          <div style={styles.roleToggle}>
            {["patient", "doctor", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  ...styles.roleButton,
                  background: role === r ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                  color: role === r ? "#fff" : "#334155"
                }}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* MESSAGE */}
          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: type === "error" ? "#d32f2f" : "#2e7d32"
                }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={styles.passwordWrapper}>
            <input
              style={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <motion.button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
            whileHover={loading ? {} : { scale: 1.05 }}
            whileTap={loading ? {} : { scale: 0.95 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </motion.button>
        </div>

        {/* RIGHT */}
        <motion.div
          style={styles.right}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3 style={styles.rightH3}>Why Login?</h3>
          <p style={styles.rightP}>✔ Consult doctors anytime</p>
          <p style={styles.rightP}>✔ Secure health records</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
