import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DriveMode from './pages/DriveMode';
import ReportSighting from './pages/ReportSighting';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Success from './pages/Success';
import Saved from './pages/Saved';
import Alerts from './pages/Alerts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Start at Splash Screen */}
        <Route path="/" element={<Splash />} />

        {/* Onboarding Flow */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Auth Flow */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Main App */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/drive" element={<DriveMode />} />
        <Route path="/report" element={<ReportSighting />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/success" element={<Success />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;