import { NavBar } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({
  title = "八字排盘",
  subtitle = "中华传统命理",
  showBack = false,
  onBack,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <NavBar
      title={
        <div className="text-center">
          <div className="text-lg font-bold">{title}</div>
          {subtitle && <div className="text-xs opacity-80">{subtitle}</div>}
        </div>
      }
      fixed={false}
      leftArrow={showBack ? <ChevronLeft /> : null}
      onClickLeft={showBack ? handleBack : undefined}
      style={{ 
        background: '#8B4513',
        color: 'white'
      }}
    />
  );
}
