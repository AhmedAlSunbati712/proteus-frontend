import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/screens/HomePage';
import AuthPage from '@/screens/AuthPage';
import NotFoundPage from '@/screens/NotFoundPage';
import { ROUTES } from '@/utils/constants';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.AUTH} element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
