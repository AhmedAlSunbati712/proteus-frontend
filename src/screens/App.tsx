import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/screens/HomePage';
import AuthPage from '@/screens/AuthPage';
import NotFoundPage from '@/screens/NotFoundPage';
import HistoryPage from "@/screens/HistoryPage";
import { ROUTES } from '@/utils/constants';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.AUTH} element={<AuthPage />} />
          <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
