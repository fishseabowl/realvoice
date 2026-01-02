import { useNavigate, useLocation } from "react-router-dom";

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  function link(path: string, label: string) {
    const active = location.pathname === path;

    return (
      <button
        onClick={() => navigate(path)}
        className={`block px-2 py-1 w-full text-left rounded ${
          active
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-700"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="w-32 h-full bg-gray-900 text-white p-4 fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-4">RealVoice</h2>

      <div className="space-y-2">
        {link("/", "Home")}
        {link("/question/1", "Question")}
        {link("/admin", "Admin")}
      </div>
    </div>
  );
}
