import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./AuthLayoutStyles";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("patient");

  const handleLogin = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

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

    if (!passwordRegex.test(password)) {
      setMessage("Password must be strong");
      setType("error");
      return;
    }

    setMessage(`${role.toUpperCase()} login successful`);
    setType("success");

    setTimeout(() => {
      navigate(`/${role}/dashboard`);
    }, 800);
  };

  return (
    <div style={styles.page}>
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
                  background: role === r ? "#4f46e5" : "transparent",
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
            style={styles.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
          >
            LOGIN
          </motion.button>
        </div>

        {/* RIGHT */}
        <motion.div
          style={styles.right}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3>Why Login?</h3>
          <p>✔ Consult doctors anytime</p>
          <p>✔ Secure health records</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
