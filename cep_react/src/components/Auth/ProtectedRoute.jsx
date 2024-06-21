import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
    const location = useLocation();
  
    useEffect(() => {
      if (!isLoggedIn) {
        localStorage.setItem('lastPath', location.pathname);
      }
    }, [isLoggedIn, location.pathname]);

  
    return children;
  };
  
export default ProtectedRoute;