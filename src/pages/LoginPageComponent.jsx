import { useState, useEffect } from 'react';
import { TextField, IconButton, InputAdornment, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import logo from '../images/LoginTwin.jpg';
import { useAuth } from '../context/AuthProvider';
import { LoginService } from '../services/LoginPageService';
import ApplicationStore from '../utils/localStorageUtil';
import { LoginFormValidate } from '../validation/formValidation';
import NotificationBar from '../components/notification/ServiceNotificationBar';
import allowedSidebarItems from '../utils/accessRoleUtil';
import './LoginPage.css';

function LoginPage() {
  const successCaseCode = [200, 201];
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setUserEmail] = useState('');
  const [password, setUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorObject, setErrorObject] = useState({});
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'success',
    message: 'Login Successful',
  });
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (provider) => {
    // These would typically come from a config file or .env
    // REPLACE THESE WITH YOUR ACTUAL KEYS FROM GOOGLE CLOUD CONSOLE / GITHUB SETTINGS
    const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"; // CHANGE THIS
    const GITHUB_CLIENT_ID = "YOUR_GITHUB_CLIENT_ID";
    const FACEBOOK_APP_ID = "YOUR_FACEBOOK_APP_ID";

    if (GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com" && provider === 'Google') {
      setNotification({
        status: true,
        type: 'error',
        message: 'Google Client ID not configured. Please add your key in LoginPageComponent.jsx',
      });
      return;
    }

    // The URL where your app is running
    const REDIRECT_URI = window.location.origin + "/login";

    let authUrl = "";

    switch (provider) {
      case 'Google':
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=email%20profile`;
        break;
      case 'GitHub':
        authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user:email`;
        break;
      case 'Facebook':
        authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=email`;
        break;
      default:
        return;
    }

    setNotification({
      status: true,
      type: 'info',
      message: `Connecting to ${provider}...`,
    });

    // !!! IMPORTANT: UNCOMMENT THE LINE BELOW TO ENABLE REDIRECT !!!
    window.location.href = authUrl;

    console.log(`Redirecting to ${provider}: ${authUrl}`);
  };

  // Standard OAuth Callback Handler
  useEffect(() => {
    // 1. Check if we just returned from Google (they use fragments like #access_token=...)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');

      if (accessToken) {
        setLoading(true);
        setNotification({
          status: true,
          type: 'info',
          message: 'Verifying Google Account...',
        });

        // 2. Here is where you would call your BACKEND to verify this token
        // Example: VerificationService({ token: accessToken, provider: 'google' })

        console.log('Received Access Token:', accessToken);

        // FOR DEMO: We simulate a successful login after 2 seconds
        setTimeout(() => {
          setNotification({
            status: true,
            type: 'success',
            message: 'Google Login Successful!',
          });
          // In reality, your backend would return the user object here
          // For now, we'll stay on the page so you can see it worked
          setLoading(false);

          // Clear the hash from URL so it looks clean
          window.history.replaceState(null, null, window.location.pathname);
        }, 2000);
      }
    }
  }, []);

  useEffect(() => {
    const { token, userDetails } = ApplicationStore().getStorage('userDetails');

    if (token && userDetails) {
      if (userDetails.userRole === 'superAdmin') {
        navigate('/UserManagement');
      } else if (userDetails.secondLevelAuthorization === 'true') {
        navigate('/otp');
      } else if (userDetails.forcePasswordReset === 1) {
        navigate('/passwordReset');
      } else {
        const allowed = allowedSidebarItems();
        if (allowed.length > 0) {
          const target = allowed[0].startsWith('/') ? allowed[0] : `/${allowed[0]}`;
          navigate(target);
        } else {
          navigate('/Dashboard');
        }
      }
    }
  }, []);

  const validateForNullValue = (value, type) => {
    LoginFormValidate(value, type, setErrorObject);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    await LoginService({ email, password })
      .then((response) => {
        if (successCaseCode.indexOf(response.status) >= 0) {
          setNotification({
            status: true,
            type: 'success',
            message: 'Login Success',
          });
          return response.json();
        }
        throw {
          errorStatus: response.status,
          errorObject: response.json(),
        };
      }).then((data) => {
        const authData = data.data;
        login(authData);

        const initialAlertDetails = {
          locationIdList: [],
          branchIdList: [],
          facilityIdList: [],
          buildingIdList: [],
          floorIdList: [],
          labIdList: [],
          deviceIdList: [],
          sensorIdList: [],
        };

        const initialNotificationDetails = {
          notificationList: [],
          newNotification: false
        };

        ApplicationStore().setStorage('navigateDashboard', { navigateDashboard: true });
        ApplicationStore().setStorage('alertDetails', initialAlertDetails);
        ApplicationStore().setStorage('notificationDetails', initialNotificationDetails);

        if (authData?.accessProfiles) {
          ApplicationStore().setStorage('accessProfiles', { accessProfiles: authData.accessProfiles });
        }

        if (authData?.locationDetails) {
          const details = authData.locationDetails;
          let labelCount = 0;
          const keysToCheck = ['locationId', 'branchId', 'facilityId'];

          keysToCheck.forEach(key => {
            if (details[key] !== null) labelCount++;
          });

          const dashboardRefresh = keysToCheck.some(key => details[key] !== null);
          ApplicationStore().setStorage('dashboardRefresh', { dashboardRefresh, labelCount });
        }

        setTimeout(() => {
          setLoading(false);
          const { userDetails } = authData;

          if (userDetails.secondLevelAuthorization === 'true') {
            navigate('/otp');
          } else if (userDetails.forcePasswordReset === 0) {
            if (userDetails.userRole === 'superAdmin') {
              navigate('/AccessProfileList');
            } else {
              const allowed = allowedSidebarItems();
              const target = (allowed && allowed.length > 0)
                ? (allowed[0].startsWith('/') ? allowed[0] : `/${allowed[0]}`)
                : '/Dashboard';
              navigate(target);
            }
          } else {
            navigate('/passwordReset');
          }
        }, 1000);
      }).catch((error) => {
        setLoading(false);
        if (error?.errorObject && typeof error.errorObject.then === 'function') {
          error.errorObject.then((errorResponse) => {
            setNotification({
              status: true,
              type: 'error',
              message: errorResponse.error ? errorResponse.error : errorResponse.message,
            });
          });
        } else {
          setNotification({
            status: true,
            type: 'error',
            message: "Login failed",
          });
        }
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Box sx={{ mb: 0 }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="#00979C" />
              <path d="M20 10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#00979C" />
            </svg>
            <h5>Welcome to IOT</h5>

          </Box>
        </div>

        <div className="login-social-buttons">
          <IconButton className="social-btn" onClick={() => handleSocialLogin('Google')}>
            <svg width="64" height="24" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </IconButton>
          <IconButton className="social-btn" onClick={() => handleSocialLogin('GitHub')}>
            <svg width="64" height="24" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#24292e" />
            </svg>
          </IconButton>
          <IconButton className="social-btn" onClick={() => handleSocialLogin('Facebook')}>
            <svg width="64" height="24" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.661 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </IconButton>
        </div>

        <div className="divider-text">or Sign in with</div>

        <form onSubmit={onFormSubmit}>
          <TextField
            fullWidth
            placeholder="Username or Email"
            type="email"
            value={email}
            variant="outlined"
            className="login-input"
            required
            onBlur={() => validateForNullValue(email, 'email')}
            onChange={(e) => {
              setUserEmail(e.target.value);
              validateForNullValue(e.target.value, 'email');
            }}
            autoComplete="off"
            error={errorObject?.email?.errorStatus}
            helperText={errorObject?.email?.helperText}
          />

          <TextField
            fullWidth
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            variant="outlined"
            className="login-input"
            required
            error={errorObject?.password?.errorStatus}
            helperText={errorObject?.password?.helperText}
            onBlur={() => validateForNullValue(password, 'password')}
            onChange={(e) => {
              setUserPassword(e.target.value);
              validateForNullValue(e.target.value, 'password');
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    sx={{ color: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <a 
            href="#" 
            className="forgot-link" 
            onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}
          >
            Forgot your password?
          </a>

          <LoadingButton
            type="submit"
            loading={loading}
            variant="contained"
            fullWidth
            className="login-button"
          >
            SIGN IN
          </LoadingButton>
        </form>

        <div className="signup-text">
          New here? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Create your account.</a>
        </div>

        <div className="login-footer">
          &copy; {new Date().getFullYear()} Infinite Uptime. All rights reserved.
        </div>
      </div>

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
}

export default LoginPage;
