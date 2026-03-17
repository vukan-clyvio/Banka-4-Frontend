import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore }    from './store/authStore';
import Login               from './pages/Login';
import ResetPassword       from './pages/ResetPassword';
import AccountActivation   from './pages/AccountActivation';
import Dashboard           from './pages/Dashboard';
import EmployeeList        from './pages/EmployeeList';
import NewEmployee         from './pages/NewEmployee';
import EmployeeDetails     from './pages/EmployeeDetails';

import NewAccount          from './pages/NewAccount';

import CardsPortal         from './pages/CardsPortal';
import ClientsPortal       from './pages/ClientsPortal';
import LoansPortal         from './pages/LoansPortal';

import NotFound            from './pages/NotFound';

function ProtectedRoute({ children }) {
  const token = useAuthStore(s => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function PermissionRoute({ permission, children }) {
  const permissions = useAuthStore(s => s.user?.permissions ?? []);
  if (!permissions.includes(permission)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login"          element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/activate"       element={<AccountActivation />} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/employees" element={
          <ProtectedRoute>
            <PermissionRoute permission="employee.view">
              <EmployeeList />
            </PermissionRoute>
          </ProtectedRoute>
        } />
        <Route path="/employees/new" element={
          <ProtectedRoute>
            <PermissionRoute permission="employee.create">
              <NewEmployee />
            </PermissionRoute>
          </ProtectedRoute>
        } />
        <Route path="/employees/:id" element={
          <ProtectedRoute>
            <PermissionRoute permission="employee.view">
              <EmployeeDetails />
            </PermissionRoute>
          </ProtectedRoute>
        } />

        {/* Accounts module */}
        <Route path="/accounts/new" element={
          <ProtectedRoute>
            <PermissionRoute permission="account.create">
              <NewAccount />
            </PermissionRoute>
          </ProtectedRoute>
        } />

        <Route path="/admin/cards" element={
          <ProtectedRoute><PermissionRoute permission="admin.cards"><CardsPortal /></PermissionRoute></ProtectedRoute>
        } />
        <Route path="/admin/clients" element={
          <ProtectedRoute><PermissionRoute permission="admin.clients"><ClientsPortal /></PermissionRoute></ProtectedRoute>
        } />
        <Route path="/admin/loans" element={
          <ProtectedRoute><PermissionRoute permission="admin.loans"><LoansPortal /></PermissionRoute></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
