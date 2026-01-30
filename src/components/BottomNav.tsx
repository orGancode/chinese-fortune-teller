import { Home, CalendarDays, Sun, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", label: "排盘", icon: Home },
  { path: "/calendar", label: "万年历", icon: CalendarDays },
  { path: "/solar-terms", label: "节气", icon: Sun },
  { path: "/settings", label: "设置", icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive
                  ? "text-[#e74c3c]"
                  : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
