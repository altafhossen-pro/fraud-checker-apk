/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import LicenseActivation from './components/LicenseActivation/LicenseActivation';
import Loader from './components/Loader/Loader';
import MobileBottomHeader from './components/MobileBottomHeader/MobileBottomHeader';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [user, setUser] = useState(null); // Added state for user data
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  // Local storage utility functions
  const getFromStorage = (key) => {
    return new Promise((resolve) => {
      resolve(localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null);
    });
  };

  const setInStorage = (key, value) => {
    return new Promise((resolve) => {
      localStorage.setItem(key, JSON.stringify(value));
      resolve();
    });
  };

  const removeFromStorage = (keys) => {
    return new Promise((resolve) => {
      keys.forEach((key) => localStorage.removeItem(key));
      resolve();
    });
  };

  const authenticateUser = async (email, licenseKey) => {
    try {
      const url = `${import.meta.env.VITE_APP_BACKEND_SITE_LINK}/api/v1/user/extension-login`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, licenseKey }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        return data;
      } else {
        setError(data?.message);
        throw new Error(data.message || 'User not found');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      const storedLicenseKey = await getFromStorage('licenseKey');
      const storedEmail = await getFromStorage('email');
      const savedUser = await getFromStorage('user'); // Retrieve user data from storage
      const savedTab = await getFromStorage('activeTab');

      if (storedLicenseKey && storedEmail && savedUser) {
        setIsLoggedIn(true);
        setUser(savedUser);
        setEmail(storedEmail);
        setLicenseKey(storedLicenseKey);
        setActiveTab(savedTab || 'dashboard');
      } else {
        setActiveTab('license'); // Set to license if user is not logged in
      }

      setLoading(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (activeTab) {
      setInStorage('activeTab', activeTab);
    }
  }, [activeTab]);

  const handleLogin = async (email, licenseKey) => {
    const { user, token } = await authenticateUser(email, licenseKey);

    if (user) {
      setIsLoggedIn(true);
      setUser(user); // Store user data in state
      await setInStorage('licenseKey', licenseKey);
      await setInStorage('email', email);
      await setInStorage('user', user); // Store user data in storage
      await setInStorage('token', token); // Store user data in storage
      setEmail(email);
      setLicenseKey(licenseKey);
      setActiveTab('dashboard');
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUser(null); // Clear user data from state
    await removeFromStorage(['licenseKey', 'email', 'activeTab', 'user']); // Clear user data from storage
    setActiveTab('license');
  };

  return (
    <div className="main-container">
      <div className="flex justify-center gap-5 flex-wrap min-w-full min-h-[100vh]">
        <div className="w-full">
          <div className="min-h-[100vh] relative shadow-lg w-full max-w-4xl rounded-md p-2 mx-auto bg-slate-100 dark:bg-slate-900">
            {/* <Header onLogout={handleLogout} isLoggedIn={isLoggedIn} activeTab={activeTab} setActiveTab={setActiveTab} /> */}
            {loading ? (
              <Loader />
            ) : isLoggedIn ? (
              <>
                <Dashboard licenseKey={licenseKey} email={email} user={user} />

              </>
            ) : (
              <LicenseActivation error={error} setError={setError} onLogin={handleLogin} />
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <></>
      ) : isLoggedIn ? (
        <>
          <MobileBottomHeader onLogout={handleLogout}></MobileBottomHeader>

        </>
      ) : (
        <></>
      )}

    </div>
  );
}

export default App;
