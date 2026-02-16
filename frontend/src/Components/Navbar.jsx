import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-center border-b border-gray-200 relative">
      {/* left controls */}
      <div className="absolute left-4 flex items-center gap-2">
        <button onClick={() => navigate("/reports")} className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm">Reports</button>
      </div>

      {/* centered logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white font-semibold text-2xl">F</span>
        </div>
        <h1 className="text-lg font-medium text-gray-800">FixIt</h1>
      </div>

      {/* right controls */}
      <div className="absolute right-4 flex items-center gap-2">
        <button onClick={() => navigate("/create")} className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700">Create</button>
        <button onClick={logout} className="text-gray-600 px-3 py-2 rounded-md text-sm hover:text-red-600">Logout</button>
      </div>
    </nav>
  );
}