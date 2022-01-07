import React, { Suspense } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { fetchIsAuth } from './GetAuthenticated';




//TODO: Find a way to create a protected route
export const ProtectedRoute = ({ component: Component, ...rest }) => {

  const reasource = fetchIsAuth();
  let history = useHistory();

  return (
    <Suspense fallback={<Component />}>
      <Route {...rest} render={
        (props) => {
          let isAuth = reasource.isAuth.read();

          //  If the sessionStorage is clear
          if (sessionStorage.length === 0 && history.location.pathname !== "/") {

            sessionStorage.clear();
            return <Redirect to="/" />
          }

          //  If the user is authenticated
          if (isAuth) {
            return <Component {...props} />
          }
          else {
            sessionStorage.clear();
            return <Redirect to="/" />
          }
        }
      } />
    </Suspense >
  )
};