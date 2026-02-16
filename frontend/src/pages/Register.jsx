import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await API.post("/users/register", { 
        email: email, 
        password: password 
      });
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      setError("Registration failed. Email might already exist.");
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
          <p className="text-gray-500">Join the community</p>
        </div>
        
        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h3>
          
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
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
                type="password" 
                placeholder="••••••••" 
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              <p className="text-xs text-gray-500 mt-1">Min 6 characters</p>
            </div>
            
            <button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Already a member? 
            <a href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold transition"> Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
