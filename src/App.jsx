import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Show wrapper only for login/signup pages
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  if (!isAuthPage) {
    // For home or other pages, just render routes directly
    return (
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    );
  }

  // Wrapper for login/signup
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#FFF3E0", // light orange
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFCC80",
          padding: "50px 40px",
          borderRadius: "20px",
          boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
          width: "420px",
          minHeight: "600px",
          textAlign: "center",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Back button */}
        {isAuthPage && (
          <div
            onClick={() => navigate("/")}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              cursor: "pointer",
              color: "#E65100",
              fontWeight: "bold",
              fontSize: "18px",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#FF6F00")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#E65100")}
          >
            ← Back
          </div>
        )}

        {/* Title */}
        <h1 style={{ color: "#E65100", marginBottom: "20px", marginTop: 0, fontSize: "34px" }}>
          Taskify 📝
        </h1>

        {/* Subtitle */}
        <p style={{ marginBottom: "30px", color: "#4E342E", fontSize: "16px" }}>
          🚀 Stay productive & crush your tasks! 💪  
          <br />
          ✨ Small steps today = Big wins tomorrow!
        </p>

        {/* Nav links only on "/" */}
        {location.pathname === "/" && (
          <nav style={{ marginBottom: 30 }}>
            <Link
              to="/login"
              style={{
                marginRight: 15,
                color: "#FF6F00",
                fontWeight: "bold",
                padding: "10px 18px",
                borderRadius: "8px",
                textDecoration: "none",
                backgroundColor: "#FFE0B2",
                transition: "0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#FFD54F")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FFE0B2")}
            >
              Login 🔑
            </Link>
            <Link
              to="/signup"
              style={{
                color: "#FF6F00",
                fontWeight: "bold",
                padding: "10px 18px",
                borderRadius: "8px",
                textDecoration: "none",
                backgroundColor: "#FFE0B2",
                transition: "0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#FFD54F")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FFE0B2")}
            >
              Signup 📝
            </Link>
          </nav>
        )}

        {/* Login/Signup Forms */}
        <div style={{ width: "100%", marginTop: isAuthPage ? "20px" : "0" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>

        {/* Footer */}
        {location.pathname === "/" && (
          <p style={{ marginTop: 40, fontSize: "14px", color: "#4E342E" }}>
            💡 Pro Tip: “Focus on one task at a time and celebrate every small win!” 🌟
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
