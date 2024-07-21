import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { checkTokenExpiration, logout } from '../newFunction/newFunction';
import Header from '../Header/Header';
import OrdersPage from '../OrdersPage/OrdersPage';
import ClientsPage from '../ClientsPage/ClientsPage';
import ProgramsPage from '../ProgramsPage/ProgramsPage';
import EmployeesPage from '../EmployeesPage/EmployeesPage';
// import AnalyticsPage from '../AnalyticsPage/AnalyticsPage';
// import OrdersStats from '../AnalyticsPage/stats/OrdersStats/OrdersStats';
// import ClientsStats from '../AnalyticsPage/stats/ClientsStats';
// import ProgramsStats from '../AnalyticsPage/stats/ProgramsStats';
import RegistrationPage from '../RegistrationPage/RegistrationPage';
import AnimatorsPage from '../AnimatorsPage/AnimatorsPage';
import CharactersPage from '../CharactersPage/CharactersPage';
import Auth from '../Auth/Auth';
import ErrorPage from '../ErrorPage/ErrorPage';

import './App.css';

const PrivateRoute = ({ children, roles, ...rest }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  checkTokenExpiration(token, logout);

  if (roles && !roles.includes(decodedToken.role)) {
    return <ErrorPage message="У вас нет доступа к этой странице." />;
  }

  return children;
};

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="App">
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/orders" element={<PrivateRoute roles={['admin', 'director']}><OrdersPage /></PrivateRoute>} />
        <Route path="/clients" element={<PrivateRoute roles={['admin', 'director']}><ClientsPage /></PrivateRoute>} />
        <Route path="/programs" element={<PrivateRoute roles={['admin']}><ProgramsPage /></PrivateRoute>} />
        <Route path="/characters" element={<PrivateRoute roles={['admin', 'director']}><CharactersPage /></PrivateRoute>} />
        <Route path="/employees" element={<PrivateRoute roles={['admin', 'director']}><EmployeesPage /></PrivateRoute>} />
        <Route path="/employees/:name" element={<PrivateRoute roles={['admin', 'director', 'animator']}><AnimatorsPage /></PrivateRoute>} />
        {/* <Route path="/analytics" element={<PrivateRoute roles={['admin', 'director']}><AnalyticsPage /></PrivateRoute>}>
          <Route path="orders" element={<OrdersStats />} />
          <Route path="clients" element={<ClientsStats />} />
          <Route path="programs" element={<ProgramsStats />} />
        </Route> */}
        <Route path="/registration" element={<PrivateRoute roles={['admin']}><RegistrationPage /></PrivateRoute>} />
        <Route path="*" element={<ErrorPage message="Страница не найдена." />} />
      </Routes>
    </div>
  );
};

export default App;
