import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { HomePage } from "./pages/HomePage";
import { PaipanPage } from "./pages/PaipanPage";
import { BaziResultPage } from "./pages/BaziResultPage";
import { CalendarPage } from "./pages/CalendarPage";
import { SolarTermsPage } from "./pages/SolarTermsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { HistoryPage } from "./pages/HistoryPage";

function Layout() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      <Outlet />
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 带底部导航的主路由 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="paipan" element={<PaipanPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="solar-terms" element={<SolarTermsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        {/* 二级页面（不带底部导航） */}
        <Route path="result" element={<BaziResultPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
