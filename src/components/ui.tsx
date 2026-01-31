import React from 'react';

export const cardStyles = {
  container: `bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-lg overflow-hidden transition-all duration-300`,
};

export function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-lg overflow-hidden transition-all duration-300 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function SectionCard({ title, subtitle, icon, children, gradient = false }: { title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode; gradient?: boolean }) {
  return (
    <Card className="mb-4 animate-slide-up">
      <div className={`px-4 py-3 border-b border-[var(--color-border)] ${gradient ? 'bg-gradient-to-r from-[var(--color-accent)] to-[#8B0000] text-white' : 'bg-[var(--color-bg)]'}`}>
        <h3 className="flex items-center gap-2 font-semibold">
          {icon}
          {title}
        </h3>
        {subtitle && <p className={`text-xs mt-0.5 ${gradient ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>{subtitle}</p>}
      </div>
      <div className="p-4">{children}</div>
    </Card>
  );
}

export function WuxingBadge({ element }: { element: string }) {
  const colors: Record<string, string> = {
    木: '#4CAF50', 火: '#F44336', 土: '#8B4513', 金: '#D4AF37', 水: '#2196F3',
  };
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm shadow-md" style={{ backgroundColor: colors[element] || 'var(--color-text-muted)' }}>
      {element}
    </span>
  );
}
