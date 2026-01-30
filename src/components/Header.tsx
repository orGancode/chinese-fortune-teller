interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = "八字排盘",
  subtitle = "中华传统命理",
}: HeaderProps) {
  return (
    <header className="bg-[#e74c3c] text-white py-6 px-4 shadow-lg">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold mb-1">{title}</h1>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>
    </header>
  );
}
