import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/create"
          className="p-6 rounded-2xl shadow bg-white hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">➕ Create Question</h2>
          <p className="text-gray-600">Add a new prediction market question.</p>
        </Link>

        <Link
          to="/admin/manage"
          className="p-6 rounded-2xl shadow bg-white hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">📊 Manage Questions</h2>
          <p className="text-gray-600">Close questions and set winners.</p>
        </Link>
      </div>
    </div>
  );
}
