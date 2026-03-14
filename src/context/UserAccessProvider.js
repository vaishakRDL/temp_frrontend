import {
  createContext, useContext, useState,
} from 'react';
import ApplicationStore from '../utils/localStorageUtil';
import { crudConfig } from '../config/roleConfig';

const UserAccessContext = createContext();
const LatestAlertContext = createContext();

export function useUserAccess() {
  return useContext(UserAccessContext);
}

export function LatestAlertAccess() {
  return useContext(LatestAlertContext);
}

export function UserAccessProvider({ children }) {
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const requestAccess = (moduleToAccess) => {
    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const moduleConfig = crudConfig[moduleToAccess.toLowerCase()];
    if (!moduleConfig) {
      return { view: false, add: false, edit: false, delete: false };
    }
    const userRole = userDetails?.userRole?.toLowerCase();
    const userAccess = moduleConfig[userRole];

    if (!userAccess) {
      // If role is superadmin, fallback to allowing everything
      if (userRole === 'superadmin') {
        return { view: true, add: true, edit: true, delete: true };
      }
      return { view: false, add: false, edit: false, delete: false };
    }
    return userAccess;
  };

  return (
    <UserAccessContext.Provider value={requestAccess}>
      {children}
    </UserAccessContext.Provider>
  );
}

export function LatestAlertProvider({ children }) {
  const [alertStatus, setAlertStatus] = useState(false);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <LatestAlertContext.Provider value={{ alertStatus, setAlertStatus }}>
      {children}
    </LatestAlertContext.Provider>
  );
}
