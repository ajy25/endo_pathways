import { Routes, Route, Navigate } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { HomePage } from '@/pages/HomePage';
import { AxisPage } from '@/pages/AxisPage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function App() {
  useKeyboardShortcuts();
  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="grow overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/axis/:axisId" element={<AxisPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
