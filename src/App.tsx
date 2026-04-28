import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import MobilePage from './pages/mobile';
import DesktopPage from './pages/desktop';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mobile" element={<MobilePage />} />
        <Route path="/desktop" element={<DesktopPage />} />
      </Routes>
    </BrowserRouter>
  );
}
