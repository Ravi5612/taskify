import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(""); // Toast message
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return showToastMsg("Please fill all fields!");

    setLoading(true); // Start loader
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false); // Stop loader

    if (error) {
      showToastMsg("Login failed: " + error.message);
    } else {
      showToastMsg("🎉 Login successful!", true);
    }
  };

  const showToastMsg = (message, redirect = false) => {
    setToast(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      if (redirect) navigate("/Home");
    }, 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", position: "relative" }}>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #FFB74D",
          backgroundColor: "#FFE0B2",
          color: "#4E342E",
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #FFB74D",
            backgroundColor: "#FFE0B2",
            color: "#4E342E",
            width: "100%",
            boxSizing: "border-box",
            paddingRight: "40px",
          }}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#E65100",
            fontSize: "18px",
            userSelect: "none",
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading} // Disable button while loading
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#FF6F00",
          color: "#fff",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {loading && (
          <div
            style={{
              border: "3px solid #fff",
              borderTop: "3px solid #FFB74D",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        )}
        {loading ? "Logging in..." : "Login"}
      </button>

      <p style={{ fontSize: "14px", color: "#4E342E" }}>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "#E65100", fontWeight: "bold" }}>
          Signup
        </Link>
      </p>

      {/* Toast Message */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#FF6F00",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            zIndex: 9999,
            animation: "fadein 0.3s, fadeout 0.3s 1.7s",
          }}
        >
          {toast}
        </div>
      )}

      {/* Loader animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Login;
