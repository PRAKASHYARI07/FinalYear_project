import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../Components/Navbar";

export default function CreateReport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setPhotoUrl(reader.result); // Store as base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) {
      setError("Please enter a report title");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }
    
    setLoading(true);
    try {
      const reportData = {
        title,
        description,
        photo_url: photoUrl || null
      };
      const response = await API.post("/reports/", reportData);
      setAiAnalysis(response.data);
      setSuccess(true);
      setTimeout(() => navigate("/reports"), 2000);
    } catch (err) {
      console.error("Report submission error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Report an Issue</h2>
          <p className="text-gray-500">Help your community by reporting problems</p>
        </div>

        {/* Success State */}
        {success && (
          <div className="mb-6 p-5 bg-green-50 border border-green-300 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl text-green-600">✓</div>
              <div>
                <p className="text-green-700 font-bold">Report submitted!</p>
                <p className="text-green-600 text-sm">AI analysis completed</p>
              </div>
            </div>
            {aiAnalysis && (
              <div className="space-y-3 bg-white p-4 rounded-lg mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Category:</span>
                  <span className="text-indigo-600 font-semibold">{aiAnalysis.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Priority:</span>
                  <span className={`font-semibold px-3 py-1 rounded ${
                    aiAnalysis.priority === 'High' ? 'bg-red-100 text-red-700' :
                    aiAnalysis.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {aiAnalysis.priority}
                  </span>
                </div>
                {aiAnalysis.suspicious_flag && (
                  <div className="flex items-center gap-2 bg-red-100 p-2 rounded text-red-700 text-sm font-medium">
                    <span>⚠️</span>
                    <span>Flagged as suspicious - will be reviewed</span>
                  </div>
                )}
                <p className="text-gray-600 text-sm border-t pt-3"><strong>Summary:</strong> {aiAnalysis.ai_summary}</p>
              </div>
            )}
            <p className="text-green-600 text-sm mt-4">Redirecting to reports...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
          </div>
        )}
        
        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
                placeholder="e.g., Broken streetlight on Main St"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition resize-none"
                placeholder="Describe the issue, location, and any relevant details..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows="7"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">{description.length} characters</p>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📸 Upload Photo (Optional)</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP - up to 5MB</p>
                </div>
              </div>
              
              {/* Photo Preview */}
              {photoPreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img src={photoPreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg border border-gray-200" />
                  <button
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoUrl("");
                    }}
                    className="text-sm text-red-600 hover:text-red-700 mt-2 font-medium"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit} 
              disabled={loading || !title.trim() || !description.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg shadow-sm transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Submitting...
                </span>
              ) : (
                "Submit Report"
              )}
            </button>

            {/* Help Text */}
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-indigo-700 text-sm">
                <span className="font-semibold">💡 Tip:</span> More details = faster resolution
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

