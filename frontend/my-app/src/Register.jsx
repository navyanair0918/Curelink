import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./AuthLayoutStyles";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleRegister = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!name.trim()) {
      setMessage("Name is required");
      setType("error");
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage("Enter valid Gmail address");
      setType("error");
      return;
    }

    if (!passwordRegex.test(password)) {
      setMessage("Password must be strong");
      setType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setType("error");
      return;
    }

    setMessage("Account created successfully ");
    setType("success");
  };

  return (
    <div style={styles.page}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.35 }}
      >
        {/* LEFT */}
        <div style={styles.left}>
          <h2 style={styles.title}>Create Account</h2>

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
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={styles.input}
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

<div style={styles.passwordWrapper}>
  <input
    style={styles.input}
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    onChange={(e) => setConfirmPassword(e.target.value)}
  />

  <span
    style={styles.eye}
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
  </span>
</div>



          <motion.button
            style={styles.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRegister}
          >
            REGISTER
          </motion.button>
        </div>

        {/* RIGHT */}
        <motion.div
          style={styles.right}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Why Register?</h3>
          <p>✔ Easy appointment booking</p>
          <p>✔ Digital health records</p>
          <p>✔ Trusted platform</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;
