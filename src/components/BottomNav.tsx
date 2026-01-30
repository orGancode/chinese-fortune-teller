import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabbar } from "react-vant";
import { HomeO, CalendarO, SettingO } from "@react-vant/icons";
import { Sun } from "lucide-react";

const navItems = [
  { path: "/", label: "排盘", icon: <HomeO /> },
  { path: "/calendar", label: "万年历", icon: <CalendarO /> },
  { path: "/solar-terms", label: "节气", icon: <Sun size={24} /> },
  { path: "/settings", label: "设置", icon: <SettingO /> },
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
      activeColor="#e74c3c"
      fixed={true}
      safeAreaInsetBottom={true}
    >
      {navItems.map((item) => (
        <Tabbar.Item key={item.path} icon={item.icon}>{item.label}</Tabbar.Item>
      ))}
    </Tabbar>
  );
}
