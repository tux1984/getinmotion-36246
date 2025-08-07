
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { MotionLogo } from '@/components/MotionLogo';
import { AuthDebugPanel } from '@/components/auth/AuthDebugPanel';
import { getUserProgressStatus } from '@/utils/userProgress';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { signIn, user, isAuthorized, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  
  
  
  const t = {
    title: "Access GET IN MOTION",
    subtitle: "Enter your credentials to access the platform",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    unauthorized: "Unauthorized user",
    unauthorizedMessage: "Your account is not authorized to access this system",
    invalidCredentials: "Invalid credentials",
    invalidCredentialsMessage: "Please check your email and password",
    errorOccurred: "An error occurred",
    welcomeBack: "Welcome back!",
    loginSuccessful: "Login successful",
    showDebug: "Show Debug Info",
    hideDebug: "Hide Debug Info"
  };
  
  // Get comprehensive user progress status
  const getUserRedirectPath = () => {
    const progressStatus = getUserProgressStatus();
    console.log('Login: User progress status:', progressStatus);
    
    // Users with any progress should go to dashboard
    if (progressStatus.shouldGoToDashboard) {
      return '/dashboard';
    }
    
    // New users go to maturity calculator
    return '/maturity-calculator';
  };
  
  // Redirect if already authenticated and authorized
  useEffect(() => {
    // Only redirect if we're not loading and have a clear auth state
    if (!loading && user && isAuthorized) {
      console.log('Login: User authenticated and authorized, preparing redirect');
      
      // Add a small delay to ensure auth state is stable
      const redirectTimer = setTimeout(() => {
        // Get the appropriate redirect path based on user progress
        let redirectTo = getUserRedirectPath();
        
        // Override with original intended destination if user has progress and was going somewhere specific
        const from = location.state?.from?.pathname;
        if (from && from !== '/login' && redirectTo === '/dashboard') {
          redirectTo = from;
        }
        
        console.log('Login: Redirecting to:', redirectTo);
        navigate(redirectTo, { replace: true });
      }, 200); // Increased delay for better stability

      return () => clearTimeout(redirectTimer);
    }
  }, [user, isAuthorized, loading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Login: Attempting login for:', email);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login: Error during sign in:', error);
        
        // Better error handling based on error type
        let errorTitle = t.errorOccurred;
        let errorDescription = error.message || t.unauthorizedMessage;
        
        if (error.message?.includes('Invalid') || error.message?.includes('credentials')) {
          errorTitle = t.invalidCredentials;
          errorDescription = t.invalidCredentialsMessage;
        } else if (error.message?.includes('Email not confirmed')) {
          errorTitle = "Email not confirmed";
          errorDescription = "Please check your email and click the confirmation link";
        } else if (error.message?.includes('Too many requests')) {
          errorTitle = "Too many attempts";
          errorDescription = "Please wait a moment before trying again";
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        });
      } else {
        console.log('Login: Sign in successful');
        toast({
          title: t.welcomeBack,
          description: t.loginSuccessful,
        });
        
        // The redirect will be handled by the useEffect above
      }
    } catch (error) {
      console.error('Login: Exception during sign in:', error);
      toast({
        title: t.errorOccurred,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state with timeout
  if (loading) {
    console.log('Login: Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-white flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div>Checking session...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <MotionLogo variant="light" />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4">
          <Card className="bg-indigo-900/40 border-indigo-800/30 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                {t.title}
              </CardTitle>
              <CardDescription className="text-indigo-200">
                {t.subtitle}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-indigo-900/50 border-indigo-700 placeholder:text-indigo-400 text-indigo-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-indigo-900/50 border-indigo-700 placeholder:text-indigo-400 text-indigo-100"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? t.signingIn : t.signIn}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDebug(!showDebug)}
                  className="text-indigo-300 hover:text-white"
                >
                  {showDebug ? t.hideDebug : t.showDebug}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {showDebug && <AuthDebugPanel />}
        </div>
      </div>
    </div>
  );
};

export default Login;
