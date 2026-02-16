import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState("request"); // "request" or "reset"
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/users/forgot-password", { email });
      setSuccess("Reset token generated! Check the response below:");
      setResetToken(response.data.reset_token);
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post("/users/reset-password", {
        email,
        reset_token: resetToken,
        new_password: newPassword,
      });
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-4xl">F</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Reset Password</h2>
          <p className="text-gray-500">Get back to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm font-medium">✓ {success}</p>
            </div>
          )}

          {step === "request" ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Step 1: Request Reset</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
                  placeholder="you@example.com"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleForgotPassword}
                disabled={loading || !email}
              >
                {loading ? "Requesting..." : "Request Reset"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Step 2: Reset Password</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reset Token
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition font-mono text-xs"
                  placeholder="Token (from above response)"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
                  type="password"
                  placeholder="New password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>

              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResetPassword}
                disabled={loading || !resetToken || !newPassword}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                onClick={() => {
                  setStep("request");
                  setResetToken("");
                  setNewPassword("");
                  setError("");
                  setSuccess("");
                }}
                className="w-full text-indigo-600 hover:text-indigo-700 font-semibold py-2"
              >
                ← Back
              </button>
            </div>
          )}

          <p className="text-center text-gray-600 mt-6 text-sm">
            Remember your password?
            <a href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold transition">
              {" "}
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
