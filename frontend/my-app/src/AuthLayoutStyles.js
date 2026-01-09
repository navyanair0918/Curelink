const authLayoutStyles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #8fb6e8, #eaf2fb)",
    display: "flex",
    flexDirection: "column",
  alignItems: "center",
  paddingTop: "80px" 
  },

  card: {
    width: "900px",
    display: "flex",
    background: "linear-gradient(to bottom, #ffffff, #f3f7fc)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
  },

  left: {
    width: "55%",
     padding: "32px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  right: {
    width: "45%",
    background: "linear-gradient(135deg, #e9f1fb, #f7faff)",
    color: "#1f2937",
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  title: {
    fontSize: "26px",
    fontWeight: 700,
    marginBottom: "14px",
    color: "#0f172a",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #dbe3f0",
    fontSize: "15px",
    outline: "none",
  },

  button: {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #3b82f6, #7c3aed)", // blue → purple
  color: "#ffffff",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
  marginTop: "14px",
  boxShadow: "0 10px 25px rgba(59,130,246,0.35)",
  transition: "all 0.3s ease"
},


  error: {
    color: "#dc2626",
    fontSize: "13px",
    marginBottom: "10px",
  },

  infoTitle: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "14px",
  },

  infoItem: {
    marginBottom: "10px",
    fontSize: "14px",
    opacity: 0.9,
  },
  passwordWrapper: {
  position: "relative",
  width: "100%",
  marginBottom: "14px"
},

eye: {
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  color: "#64748b",
  fontSize: "18px"
},
roleToggle: {
  display: "flex",
  justifyContent: "space-between",
  background: "#e5e7eb",
  borderRadius: "25px",
  padding: "5px",
  marginBottom: "20px"
},

roleButton: {
  flex: 1,
  border: "none",
  padding: "10px",
  borderRadius: "20px",
  fontSize: "14px",
  cursor: "pointer",
  transition: "0.3s"
},

navBar: {
  position: "absolute",
  top: "20px",
  left: "20px",
  right: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 10
},

navLink: {
  color: "#1f2937",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 500,
  padding: "8px 16px",
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.9)",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  display: "inline-block"
},

};

export default authLayoutStyles;
