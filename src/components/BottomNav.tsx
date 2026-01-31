import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Settings, Sparkles, Sun } from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  {
    path: "/",
    label: "首页",
    icon: <Home size={22} strokeWidth={1.5} />,
    activeIcon: <Home size={22} strokeWidth={2.5} />,
  },
  {
    path: "/calendar",
    label: "万年历",
    icon: <Calendar size={22} strokeWidth={1.5} />,
    activeIcon: <Calendar size={22} strokeWidth={2.5} />,
  },
  {
    path: "/paipan",
    label: "排盘",
    icon: <Sparkles size={28} strokeWidth={1.5} />,
    activeIcon: <Sparkles size={28} strokeWidth={2} />,
    isCenter: true,
  },
  {
    path: "/solar-terms",
    label: "节气",
    icon: <Sun size={22} strokeWidth={1.5} />,
    activeIcon: <Sun size={22} strokeWidth={2.5} />,
  },
  {
    path: "/settings",
    label: "设置",
    icon: <Settings size={22} strokeWidth={1.5} />,
    activeIcon: <Settings size={22} strokeWidth={2.5} />,
  },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const index = navItems.findIndex(
      (item) =>
        item.path === location.pathname ||
        (item.path !== "/" && location.pathname.startsWith(item.path))
    );
    if (index !== -1) {
      setActive(index);
    }
  }, [location.pathname]);

  const handleNavClick = (index: number) => {
    if (index === active) return;

    setIsAnimating(true);
    setActive(index);
    navigate(navItems[index].path);

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="modern-tabbar">
      <div className="modern-tabbar-bg" />
      <div className="modern-tabbar-content">
        {navItems.map((item, index) => (
          <button
            key={item.path}
            className={`modern-tabbar-item ${active === index ? "active" : ""} ${
              item.isCenter ? "center-item" : ""
            }`}
            onClick={() => handleNavClick(index)}
            style={{
              transform: isAnimating && active === index ? "scale(0.92)" : undefined,
            }}
          >
            {item.isCenter ? (
              <div className="center-button">
                <div className="center-button-inner">
                  <div
                    className={`center-icon ${active === index ? "active" : ""}`}
                  >
                    {active === index ? item.activeIcon : item.icon}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={`tabbar-icon ${active === index ? "active" : ""}`}>
                  {active === index ? item.activeIcon : item.icon}
                </div>
                <span className={`tabbar-label ${active === index ? "active" : ""}`}>
                  {item.label}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="safe-area-spacer" />
    </div>
  );
}
