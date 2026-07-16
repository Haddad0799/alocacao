import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { developersApi } from '../../api/developers.api';
import { AdminDashboardPage } from './AdminDashboardPage';
import { DeveloperDashboardPage } from './DeveloperDashboardPage';
import type { DeveloperProfile } from '../../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (user?.role !== 'DEVELOPER') return;

    setLoadingProfile(true);
    developersApi.getProfile()
      .then((p) => setProfile(p))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false));
  }, [user]);

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (user?.role === 'DEVELOPER') {
    return <DeveloperDashboardPage profile={profile} onProfileSaved={setProfile} />;
  }

  return <AdminDashboardPage />;
}