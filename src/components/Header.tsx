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
    <header className="modern-header">
      <div className="modern-header-bg" />
      <div className="modern-header-content">
        {showBack ? (
          <button 
            className="header-back-btn"
            onClick={handleBack}
            aria-label="返回"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
        ) : (
          <div className="header-spacer" />
        )}
        <div className="header-title-wrapper">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        <div className="header-spacer" />
      </div>
      <div className="header-safe-area" />
    </header>
  );
}
