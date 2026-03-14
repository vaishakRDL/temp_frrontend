/* eslint-disable max-len */
import React from 'react';
import {
  HashRouter as Router, Routes, Route, Outlet, Navigate, useNavigate,
} from 'react-router-dom';
import './App.css';
import { LoadScript } from '@react-google-maps/api';
import LoginPage from './pages/LoginPageComponent';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OneTimePassword from './pages/OneTimePasswordComponent';
import HomePage from './pages/HomePageComponent';
import VendorManagement from './pages/VendorComponent';
import ForcePasswordReset from './pages/ForcePasswordResetComponent';
import CustomerManagement from './pages/CustomerComponent';
import UserManagement from './pages/UserComponent';
import SiteDetails from './pages/SiteDetailsComponent';
import Dashboard from './components/DashboardComponent';
import Branch from './components/BranchComponent';
import Facility from './components/FacilityComponent';
import UserResetPassword from './components/UserResetPassword';
import ApplicationStore from './utils/localStorageUtil';
import { AuthProvider, useAuth } from './context/AuthProvider'; // Import AuthProvider and useAuth
import ManagementReportTab from './components/reportSectionComponents/ManagementReportTab';
import GasCylinder from './pages/GasCylinderComponent';
import AddDevice from './components/AddDeviceManagement';
import CategoryManagement from './pages/CategoryManagementComponent';
import MeterGeneralAlertSettings from './pages/MeterGeneralAlertSettings';
import EnergySave from './components/navbarComponent/EnergySaved/EnergySave';
import FooterComponent from './components/FooterComponent';
import ProjectModule from './components/Master/ProjectModule';
import ManageDeviceresult from './components/dashboard/components/ManageDevice/ManageDeviceresult';
import ManageMovableResult from './components/dashboard/components/ManageMovable/ManageMovableResult';
import MasterManageCom from './components/Master/MasterManageCom';
import ManageSensorDeviceresult from './components/dashboard/components/ManageSensor/ManageSensorDeviceresult';
import ProtocolJSONResult from './components/dashboard/components/ProtocolJSON/ProtocolJSONResult';
import CronJobData from './components/dashboard/components/CronJobDataSave/CronJobData';
import EmailConfigList from './components/EmailRecipients/EmailConfigList';
import DragGraph from './components/dashboard/subComponent/deviceCard/DragGraph';
import AlertHistoryLog from './components/dashboard/components/AlertHistoryLog';
import ReportUserList from './components/Reports/ReportUserList';
import ScadaView from './components/ScadaDashBoard/ScadaView';
import AccessProfileList from './components/AccessProfilesDetails/AccessProfileList';
import { DeviceStatusListResults } from './components/DeviceStatusLists/deviceStatus-list-results';
import NotificationStatus from './pages/NotificationStatusComponent';
import LandingPage from './pages/LandingPage';
import FeatureComparison from './components/FreeePlans/FeatureComparison';
import DurationMasterResult from './components/DurationMaster/DurationMasterResult';

function ProtectedRoutes() {
  const navigate = useNavigate();
  const { token, user } = useAuth(); // Use useAuth hook
  // const { token, userDetails } = ApplicationStore().getStorage('userDetails'); // Old way

  if (token) {
    // Check for second level auth or reset password requirements from the 'user' object if needed
    // The original code checked userDetails.secondLevelAuthorization
    const userDetails = user;

    if (userDetails?.secondLevelAuthorization === 'true') {
      return <Navigate replace to="/otp" />;
    }
    return <Outlet />;
  }
  return <Navigate replace to="/login" />;
}

function App() {
  return (
    <div className="App">
      {/* <LoadScript googleMapsApiKey="AIzaSyBBv6shA-pBM0e9KydvwubSY55chq0gqS8"> */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeatureComparison />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/otp" element={<OneTimePassword />} />
              <Route path="/passwordReset" element={<ForcePasswordReset />} />
              <Route path="/" element={<HomePage />}>
                <Route path="CustomerManagement/*" element={<CustomerManagement />} />
                <Route path="UserManagement/*" element={<UserManagement />} />
                <Route path="Vendor/*" element={<VendorManagement />} />
                <Route path="GasCylinder" element={<GasCylinder />} />
                <Route path="Report/*" element={<ManagementReportTab />} />
                <Route path="EnergySaved/*" element={<EnergySave />} />
                <Route path="ChangePassword/*" element={<UserResetPassword />} />
                <Route path="Dashboard/*" element={<Dashboard />} />
                <Route path="Location/*" element={<SiteDetails />} />
                <Route path="Location/:locationId" element={<Branch />} />
                <Route path="Location/:locationId/:locationId" element={<Facility />} />
                <Route path="DeviceConfiguration/*" element={<AddDevice />} />
                <Route path="MeterGeneralAlert/*" element={<MeterGeneralAlertSettings />} />
                <Route path="Device/*" element={<CategoryManagement />} />
                <Route path="MasterManageCom/*" element={<MasterManageCom />} />
                <Route path="ManageDeviceresult/*" element={<ManageDeviceresult />} />
                <Route path="ManageMovableResult/*" element={<ManageMovableResult />} />
                <Route path="ProtocolJSONResult/*" element={<ProtocolJSONResult />} />
                <Route path="EmailConfigList/*" element={<EmailConfigList />} />
                <Route path="CronJobData/*" element={<CronJobData />} />
                <Route path="DragGraph/*" element={<DragGraph />} />
                <Route path="ReportUserList/*" element={<ReportUserList />} />
                <Route path="AlertHistoryLog/*" element={<AlertHistoryLog />} />
                <Route path="ScadaView/*" element={<ScadaView />} />
                <Route path="AccessProfileList/*" element={<AccessProfileList />} />
                <Route path="DeviceStatusListResults/*" element={<DeviceStatusListResults />} />
                <Route path="NotificationStatus/*" element={<NotificationStatus />} />
                <Route path="DurationMasterList/*" element={<DurationMasterResult />} />


              </Route>
            </Route>
          </Routes>

        </Router>
      </AuthProvider>
      {/* </LoadScript> */}
    </div>
  );
}

export default App;
