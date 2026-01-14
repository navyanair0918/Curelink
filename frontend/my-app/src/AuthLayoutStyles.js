const authLayoutStyles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    margin: 0,
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    background: "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(243,247,252,0.95))",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
    flexDirection: "row",
    backdropFilter: "blur(10px)",
  },

  left: {
    width: "55%",
    padding: "clamp(24px, 4vw, 40px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  right: {
    width: "45%",
    background: "linear-gradient(135deg, #e9f1fb, #f7faff)",
    color: "#1f2937",
    padding: "clamp(32px, 5vw, 48px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  
  rightH3: {
    fontSize: "clamp(18px, 3vw, 22px)",
    fontWeight: 600,
    marginBottom: "16px",
    color: "#1f2937",
  },
  
  rightP: {
    fontSize: "clamp(14px, 2vw, 16px)",
    marginBottom: "12px",
    color: "#4b5563",
    lineHeight: "1.6",
  },

  title: {
    fontSize: "clamp(22px, 4vw, 26px)",
    fontWeight: 700,
    marginBottom: "14px",
    color: "#0f172a",
  },

  input: {
    width: "100%",
    padding: "clamp(12px, 2vw, 14px) clamp(14px, 2vw, 16px)",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #dbe3f0",
    fontSize: "clamp(14px, 2vw, 15px)",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },

  button: {
    width: "100%",
    padding: "clamp(12px, 2vw, 14px)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    fontSize: "clamp(14px, 2vw, 16px)",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "14px",
    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.35)",
    transition: "all 0.3s ease",
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
  padding: "clamp(8px, 1.5vw, 10px)",
  borderRadius: "20px",
  fontSize: "clamp(12px, 2vw, 14px)",
  cursor: "pointer",
  transition: "0.3s",
  fontWeight: 500,
},
  
  select: {
    width: "100%",
    padding: "clamp(12px, 2vw, 14px) clamp(14px, 2vw, 16px)",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #dbe3f0",
    fontSize: "clamp(14px, 2vw, 15px)",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#1f2937",
    cursor: "pointer",
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
