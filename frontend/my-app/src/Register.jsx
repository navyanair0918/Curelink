import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "./services/api";
import styles from "./AuthLayoutStyles";
import "./Auth.css";
import "./AuthResponsive.css";
import "./AuthFullPage.css";

function Register({ onSuccess }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("patient");
  const [degree, setDegree] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleRegister = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!name.trim()) {
      setMessage("Name is required");
      setType("error");
      return;
    }

    if (!role || (role !== "patient" && role !== "doctor")) {
      setMessage("Please select a role (Patient or Doctor)");
      setType("error");
      return;
    }

    // Validate doctor-specific fields
    if (role === "doctor") {
      if (!degree.trim()) {
        setMessage("Please enter your qualification/degree");
        setType("error");
        return;
      }
      if (!specialization.trim()) {
        setMessage("Please select your specialization");
        setType("error");
        return;
      }
    }

    if (!emailRegex.test(email)) {
      setMessage("Enter valid Gmail address");
      setType("error");
      return;
    }

    if (!passwordRegex.test(password)) {
      setMessage("Password must be at least 8 characters and contain uppercase, lowercase, number, and special character");
      setType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Normalize role to lowercase before sending
      const normalizedRole = role.toLowerCase();
      const registerData = { 
        name, 
        email, 
        password, 
        role: normalizedRole 
      };
      
      // Add doctor-specific fields if registering as doctor
      if (normalizedRole === "doctor") {
        registerData.degree = degree.trim();
        registerData.specialization = specialization.trim();
      }
      
      const response = await authAPI.register(registerData);
      
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
          navigate("/dashboard");
        }, 800);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setMessage(errorMessage);
      setType("error");
    }
  };

  return (
    <div className="auth-page-wrapper" style={styles.page}>
      {/* Navigation */}
      <div style={styles.navBar}>
        <Link to="/" style={styles.navLink} className="auth-nav-link">← Back to Home</Link>
        <Link to="/login" style={styles.navLink} className="auth-nav-link">Already have an account? Login</Link>
      </div>

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

          {/* ROLE SELECTION */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "12px", fontSize: "14px", color: "#64748b", fontWeight: 500 }}>
              Register as:
            </p>
            <div style={styles.roleToggle}>
              {["patient", "doctor"].map((r) => (
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

          {/* Doctor-specific fields */}
          {role === "doctor" && (
            <>
              <input
                style={styles.input}
                type="text"
                placeholder="Qualification (e.g., MBBS, MD)"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
              <select
                style={styles.select}
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">Select Specialization</option>
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="ENT Specialist">ENT Specialist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Ophthalmologist">Ophthalmologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Pulmonologist">Pulmonologist</option>
                <option value="Endocrinologist">Endocrinologist</option>
                <option value="Urologist">Urologist</option>
                <option value="Oncologist">Oncologist</option>
              </select>
            </>
          )}

          <motion.button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
            whileHover={loading ? {} : { scale: 1.05 }}
            whileTap={loading ? {} : { scale: 0.95 }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "REGISTERING..." : "REGISTER"}
          </motion.button>
        </div>

        {/* RIGHT */}
        <motion.div
          style={styles.right}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {role === "patient" ? (
            <>
              <h3 style={styles.rightH3}>Register as Patient</h3>
              <p style={styles.rightP}>✔ Easy appointment booking</p>
              <p style={styles.rightP}>✔ Digital health records</p>
              <p style={styles.rightP}>✔ Access to qualified doctors</p>
              <p style={styles.rightP}>✔ Secure platform</p>
            </>
          ) : (
            <>
              <h3 style={styles.rightH3}>Register as Doctor</h3>
              <p style={styles.rightP}>✔ Manage your appointments</p>
              <p style={styles.rightP}>✔ Connect with patients</p>
              <p style={styles.rightP}>✔ Digital patient records</p>
              <p style={styles.rightP}>✔ Professional platform</p>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;
