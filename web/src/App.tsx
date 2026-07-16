import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;