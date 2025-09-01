import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminDashboard from './AdminDashboard';
import ColaboradorDashboard from './ColaboradorDashboard';
import ResponsavelDashboard from './ResponsavelDashboard';
import Home from './Home';

export default function Dashboard() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('auth_token'); 
        if (token) {
          const response = await api.get('/user/role');
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'colaborador':
      return <ColaboradorDashboard />;
    case 'responsavel':
      return <ResponsavelDashboard />;
    default:
      return <Home />;
  }
}
