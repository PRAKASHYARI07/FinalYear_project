import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../Components/Navbar";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }

    setLoading(true);
    API.get("/reports/", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReports(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      })
      .finally(() => setLoading(false));

    API.get("/reports/admin/all", { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setRole("admin"))
      .catch(() => setRole("user"));
  }, [navigate]);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    await API.put(`/reports/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const getStatusStyles = (status) => {
    switch(status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "resolved":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getPriorityStyles = (priority) => {
    switch(priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 mt-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Community Reports</h2>
            <p className="text-gray-500">Help fix what matters</p>
          </div>
          {role === "admin" && (
            <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium text-sm">Admin</span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 mt-4 font-medium">Loading reports...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && (
          <div className="text-center py-20 rounded-2xl border border-gray-100 bg-white">
            <div className="inline-block mb-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 text-2xl">✓</span>
              </div>
            </div>
            <p className="text-gray-800 text-lg font-semibold">No reports yet</p>
            <p className="text-gray-500 text-sm mt-1">Everything looks great!</p>
          </div>
        )}

        {/* Reports Grid */}
        {!loading && reports.length > 0 && (
          <div className="grid gap-4">
            {reports.map((r, idx) => (
              <div 
                key={r.id} 
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-indigo-100 transition duration-200 group"
                style={{animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both`}}
              >
                <style>{`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">{r.title}</h4>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">{r.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase whitespace-nowrap ${getStatusStyles(r.status)}`}>
                      {r.status.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${getPriorityStyles(r.priority)}`}>
                      {r.priority} Priority
                    </span>
                  </div>
                </div>

                {/* AI Analysis & Suspicious Flag */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-gray-600"><strong>Category:</strong> {r.category}</p>
                      <p className="text-gray-600 mt-1"><strong>AI Summary:</strong> {r.ai_summary}</p>
                    </div>
                    {r.suspicious_flag && (
                      <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1">
                        <span>⚠️</span> Suspicious
                      </div>
                    )}
                  </div>
                </div>

                {role === "admin" && (
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-600">Update:</label>
                    <select
                      className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none p-2 cursor-pointer transition"
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
