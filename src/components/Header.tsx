
import { NavBar } from 'react-vant';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export function Header({
  title = "八字排盘",
  subtitle = "中华传统命理",
  showBack = false,
}: HeaderProps) {
  return (
    <NavBar
      title={
        <div className="text-center">
          <div className="text-lg font-bold">{title}</div>
          {subtitle && <div className="text-xs opacity-80">{subtitle}</div>}
        </div>
      }
      fixed={false}
      leftArrow={showBack}
      style={{ 
        background: '#8B4513',
        color: 'white'
      }}
    />
  );
}
