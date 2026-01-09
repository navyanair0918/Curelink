import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle login/register success
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    // Show dashboard after login/register
    return <DashboardPage />;
  }

  return (
    <div>
      {/* Toggle */}
      <div style={styles.toggleWrapper}>
        <div style={styles.toggle}>
          <motion.div
            style={{
              ...styles.activeIndicator,
              left: activeTab === "login" ? "0%" : "50%"
            }}
            transition={{ duration: 0.2 }}
          />

          <span
            style={{
              ...styles.tab,
              color: activeTab === "login" ? "#1976d2" : "#555"
            }}
            onClick={() => setActiveTab("login")}
          >
            Login
          </span>

          <span
            style={{
              ...styles.tab,
              color: activeTab === "register" ? "#1976d2" : "#555"
            }}
            onClick={() => setActiveTab("register")}
          >
            Register
          </span>
        </div>
      </div>

      {/* Login/Register Forms */}
      <AnimatePresence>
        {activeTab === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0.8, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.8, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Login onSuccess={handleAuthSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0.8, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.8, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Register onSuccess={handleAuthSuccess} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  toggleWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "25px"
  },
  toggle: {
    position: "relative",
    display: "flex",
    width: "300px",
    background: "#f1f5f9",
    borderRadius: "30px",
    padding: "5px"
  },
  tab: {
    flex: 1,
    textAlign: "center",
    padding: "10px 0",
    cursor: "pointer",
    fontWeight: "600",
    zIndex: 1
  },
  activeIndicator: {
    position: "absolute",
    top: "5px",
    width: "50%",
    height: "40px",
    background: "#fff",
    borderRadius: "30px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
  }
};

export default App;
