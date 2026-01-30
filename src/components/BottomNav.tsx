import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabbar } from "react-vant";
import { HomeO, CalendarO, SettingO, WapHomeO } from "@react-vant/icons";
import { Sun, Sparkles } from "lucide-react";

const navItems = [
  { path: "/", label: "首页", icon: <HomeO />, activeIcon: <WapHomeO />, isPrimary: true },
  { path: "/paipan", label: "排盘", icon: <Sparkles size={22} />, isPrimary: false },
  { path: "/calendar", label: "万年历", icon: <CalendarO />, isPrimary: false },
  { path: "/solar-terms", label: "节气", icon: <Sun size={22} />, isPrimary: false },
  { path: "/settings", label: "设置", icon: <SettingO />, isPrimary: false },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const index = navItems.findIndex((item) => 
      item.path === location.pathname || 
      (item.path !== "/" && location.pathname.startsWith(item.path))
    );
    if (index !== -1) {
      setActive(index);
    }
  }, [location.pathname]);

  return (
    <Tabbar
      value={active}
      onChange={(name: string | number) => {
        const index = Number(name);
        setActive(index);
        navigate(navItems[index].path);
      }}
      activeColor="#C41E3A"
      inactiveColor="#999999"
      fixed={true}
      safeAreaInsetBottom={true}
      style={{ 
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        borderTop: "1px solid #f0f0f0",
        zIndex: 100
      }}
    >
      {navItems.map((item, index) => (
        <Tabbar.Item 
          key={item.path} 
          icon={item.icon}
          style={item.isPrimary && active === index ? {
            color: "#C41E3A",
            fontWeight: 600
          } : undefined}
        >
          {item.label}
        </Tabbar.Item>
      ))}
    </Tabbar>
  );
}
