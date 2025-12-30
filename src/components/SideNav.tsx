import { NavLink } from "react-router-dom";

const base =
  "block px-2 py-1 rounded transition text-left";
const active =
  "bg-gray-700 text-white";
const inactive =
  "text-gray-300 hover:bg-gray-800";

export default function SideNav() {
  return (
    <div className="w-32 h-full bg-gray-900 text-white p-4 fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-4">
        PolyIChain
      </h2>

      <ul className="space-y-2">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/prediction"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            Prediction
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/questions"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            Questions
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
