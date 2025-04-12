import { NavLink } from "react-router-dom";

export default function Header() {
  const activeClasses = "text-green-400 underline";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100";

  return (
    <header className="bg-gray-100 text-black p-4 flex gap-4">
      <NavLink
        to="/tech"
        className={({ isActive }) =>
          `${isActive ? activeClasses : inactiveClasses}`
        }
      >
        Tech
      </NavLink>

      <NavLink
        to="/clothes"
        className={({ isActive }) =>
          `${isActive ? activeClasses : inactiveClasses}`
        }
      >
        Clothes
      </NavLink>
    </header>
  );
}
