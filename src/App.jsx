import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore }    from './store/authStore';
import Login               from './pages/Login';
import ResetPassword       from './pages/ResetPassword';
import AccountActivation   from './pages/AccountActivation';
import Dashboard           from './pages/Dashboard';
import EmployeeList        from './pages/EmployeeList';
import NewEmployee         from './pages/NewEmployee';
import EmployeeDetails     from './pages/EmployeeDetails';
import NotFound            from './pages/NotFound';
import CardsPage           from './pages/CardsPage';

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
  const user = useAuthStore(s => s.user);
  console.log(user)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"            element={<Login />} />
        <Route path="/reset-password"   element={<ResetPassword />} />
        <Route path="/activate"          element={<AccountActivation />} />

        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/employees" element={
          <ProtectedRoute><PermissionRoute permission="employee.view"><EmployeeList /></PermissionRoute></ProtectedRoute>
        } />
        <Route path="/employees/new" element={
          <ProtectedRoute><PermissionRoute permission="employee.create"><NewEmployee /></PermissionRoute></ProtectedRoute>
        } />
        <Route path="/employees/:id" element={
          <ProtectedRoute><PermissionRoute permission="employee.view"><EmployeeDetails /></PermissionRoute></ProtectedRoute>
        } />
        <Route path="/cards" element={
          <ProtectedRoute><CardsPage/></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
