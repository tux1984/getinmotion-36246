
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new dashboard home route
    navigate('/dashboard/home', { replace: true });
  }, [navigate]);

  return null;
};

export default Dashboard;
