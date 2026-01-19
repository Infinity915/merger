import { useState, useEffect } from 'react';
import api from '@/lib/api.js';

const usePods = () => {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await api.get('/api/pods');
        setPods(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPods();
  }, []);

  return { pods, loading, error };
};

export default usePods;
