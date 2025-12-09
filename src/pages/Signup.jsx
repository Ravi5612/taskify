import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // new state
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) return alert("Please fill all fields!");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Signup failed: " + error.message);
    } else {
      alert("Signup successful! Check your email to confirm.");
      navigate("/login");
    }
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
          type={showPassword ? "text" : "password"} // toggle type
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
            paddingRight: "40px", // space for eye icon
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
        onClick={handleSignup}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#FF6F00",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Create Account
      </button>

      <p style={{ fontSize: "14px", color: "#4E342E" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#E65100", fontWeight: "bold" }}>
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
