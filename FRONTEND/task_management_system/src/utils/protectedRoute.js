import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { role } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        allowedRoles.includes(role) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/unauthorized" />
        )
      }
    />
  );
};

export default ProtectedRoute;
