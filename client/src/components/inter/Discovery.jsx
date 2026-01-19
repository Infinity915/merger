import { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import DiscoveryMesh from '../ui/DiscoveryMesh.jsx';

export default function Discovery({ user }) {
  const [radarData, setRadarData] = useState([]);

  // MOCK DATA: For local testing if DB is empty
  const MOCK_RADAR = [
    { user: { id: '1', fullName: 'Deepak Sharma', collegeName: 'COEP Pune' }, score: 92 },
    { user: { id: '2', fullName: 'Ananya Gupta', collegeName: 'IIT Delhi' }, score: 85 }
  ];

  useEffect(() => {
    if (user?.id && !user.id.startsWith('temp-')) {
      api.get(`/api/discovery/radar/${user.id}`)
        .then(res => setRadarData(res.data))
        .catch(() => {
          setRadarData(MOCK_RADAR);
        });
    }
  }, [user?.id]);

  return (
    <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-1000">
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-4xl font-light tracking-tighter text-white">Global Discovery</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest opacity-60">
          Scanning synapses for {user?.skills?.[0] || 'collaborators'}
        </p>
      </div>

      <DiscoveryMesh suggestions={radarData} />
    </div>
  );
}