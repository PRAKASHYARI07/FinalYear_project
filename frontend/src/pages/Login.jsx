import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // Send as form data (application/x-www-form-urlencoded)
      const formData = new URLSearchParams();
      formData.append("username", email);  // OAuth2 standard expects "username"
      formData.append("password", password);

      const res = await API.post("/users/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      localStorage.setItem("token", res.data.access_token);
      navigate("/reports");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-4xl">F</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">FixIt</h2>
          <p className="text-gray-500">Fix community issues together</p>
        </div>
        
        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h3>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
                placeholder="you@example.com" 
                type="email"
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
                type="password" 
                placeholder="••••••••" 
                onChange={e => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-center text-gray-600 mt-6 text-sm">
            New here? 
            <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition"> Create account</a>
          </p>
          <p className="text-center text-gray-600 mt-2 text-sm">
            Forgot your password?
            <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-semibold transition"> Reset it here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
