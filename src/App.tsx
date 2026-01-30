import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { PaipanPage } from "./pages/PaipanPage";
import { BaziResultPage } from "./pages/BaziResultPage";
import { CalendarPage } from "./pages/CalendarPage";
import { SolarTermsPage } from "./pages/SolarTermsPage";
import { SettingsPage } from "./pages/SettingsPage";

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
        <Route path="/" element={<Layout />}>
          <Route index element={<PaipanPage />} />
          <Route path="result" element={<BaziResultPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="solar-terms" element={<SolarTermsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
