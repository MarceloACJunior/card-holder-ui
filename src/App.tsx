import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ClientsPage from './pages/clients/ClientsPage';
import NewClientPage from './pages/clients/NewClientPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import AnalysisPage from './pages/analysis/AnalysisPage';
import NewAnalysisPage from './pages/analysis/NewAnalysisPage';
import CardHoldersPage from './pages/cardholders/CardHoldersPage';
import NewCardHolderPage from './pages/cardholders/NewCardHolderPage';
import CardHolderDetailPage from './pages/cardholders/CardHolderDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/clients" replace />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/new" element={<NewClientPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="analysis/new" element={<NewAnalysisPage />} />
          <Route path="card-holders" element={<CardHoldersPage />} />
          <Route path="card-holders/new" element={<NewCardHolderPage />} />
          <Route path="card-holders/:id" element={<CardHolderDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
