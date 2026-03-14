import ApplicationStore from './localStorageUtil';
import { sidebarConfig } from '../config/roleConfig';

const allowedSidebarItems = () => {
  const { userDetails } = ApplicationStore().getStorage('userDetails');
  const userRole = userDetails?.userRole?.toLowerCase().replace(/\s/g, '') || '';
  const storedProfiles = ApplicationStore().getStorage('accessProfiles');
  const accessProfiles = storedProfiles?.accessProfiles;

  // If no access profile or user is superadmin/systemspecialist, fallback to existing config
  if (!accessProfiles || userRole === 'superadmin' || userRole === 'systemspecialist') {
    return sidebarConfig[userRole] || [];
  }

  let allowed = [];

  // Map backend permissions to frontend routes
  if (accessProfiles.dashboard === 1) allowed.push('Dashboard', 'ScadaView');

  // User Management
  if (accessProfiles.user === 1) allowed.push('UserManagement');

  // SCADA View and related
  if (accessProfiles.scada === 1) allowed.push('ScadaView', 'Vendor', 'GasCylinder');

  // Location
  if (accessProfiles.location === 1) allowed.push('Location');

  // Device / Masters
  if (accessProfiles.device === 1) allowed.push('DeviceConfiguration', 'AddDevice');
  if (accessProfiles.masters === 1) allowed.push('Device'); // Maps to "Masters" in SidebarItems

  // Settings
  if (accessProfiles.settings === 1) allowed.push('EmailConfigList', 'MeterGeneralAlert');

  // Reports / Sensor Log
  if (accessProfiles.sensorLog === 1) allowed.push('ReportUserList');

  // Change Password
  if (accessProfiles.changePassword === 1) allowed.push('ChangePassword');

  // Customer Management
  if (accessProfiles.customer === 1) allowed.push('CustomerManagement', 'DeviceStatusListResults');

  // Access Profile Management
  if (accessProfiles.profileMaster === 1) allowed.push('AccessProfileList');

  // Explicitly allow Access Profile and Customer Management for System Specialist if not covered by profile
  // Or if we decide these are "Admin" features always available to certain roles
  // if (['systemspecialist', 'admin'].includes(userDetails.userRole.toLowerCase())) {
  //     // Check if these should be guarded or always allowed for these roles
  //     allowed.push('AccessProfileList');
  //     allowed.push('CustomerManagement');
  // }

  return allowed;
};

export default allowedSidebarItems;
