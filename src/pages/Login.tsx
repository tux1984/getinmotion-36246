
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { useToast } from '@/components/ui/use-toast';
import { MotionLogo } from '@/components/MotionLogo';
import { AuthDebugPanel } from '@/components/auth/AuthDebugPanel';
import { LoginFeatureSlider } from '@/components/auth/LoginFeatureSlider';
import { getUserProgressStatus, getUserProgressStatusSync } from '@/utils/userProgress';
import { LanguageSwitcherButton } from '@/components/language/LanguageSwitcherButton';
import { LanguageSwitcherModal } from '@/components/language/LanguageSwitcherModal';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { signIn, user, isAuthorized, loading, authorizationLoading } = useRobustAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: isLanguageModalOpen, openModal: openLanguageModal, closeModal: closeLanguageModal } = useLanguageSwitcher();
  
  
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
  
  // Get comprehensive user progress status with async Supabase verification
  const getUserRedirectPath = async () => {
    try {
      console.log('🔍 Login: Determining redirect path for user:', user?.id);
      
      // First try synchronous check for immediate response
      const syncStatus = getUserProgressStatusSync();
      console.log('📊 Login: Sync progress check result:', syncStatus);
      
      // If sync check shows progress, use it immediately
      if (syncStatus.shouldGoToDashboard) {
        console.log('✅ Login: Sync check shows progress, redirecting to dashboard');
        return '/dashboard';
      }
      
      // If no clear progress from sync check and we have a user, verify with Supabase
      if (user?.id) {
        console.log('🔄 Login: Performing async Supabase verification...');
        const asyncStatus = await getUserProgressStatus(user.id);
        console.log('📊 Login: Async progress check result:', asyncStatus);
        
        if (asyncStatus.shouldGoToDashboard) {
          console.log('✅ Login: Supabase verification shows progress, redirecting to dashboard');
          return '/dashboard';
        }
      }
      
      // No progress found - new user
      console.log('❌ Login: No progress found, redirecting to maturity calculator');
      return '/maturity-calculator';
      
    } catch (error) {
      console.error('💥 Login: Error determining redirect path:', error);
      // Fallback to maturity calculator on error
      return '/maturity-calculator';
    }
  };
  
  // Redirect if already authenticated and authorized
  useEffect(() => {
    // Only redirect if we're not loading and have a clear auth state
    // Wait for both auth loading and authorization loading to complete
    if (!loading && !authorizationLoading && user && isAuthorized === true) {
      console.log('Login: User authenticated and authorized, preparing redirect');
      
      // Add a small delay to ensure auth state is stable, then determine redirect
      const redirectTimer = setTimeout(async () => {
        try {
          console.log('🚀 Login: Starting redirect determination process...');
          
          // Get the appropriate redirect path based on user progress (async)
          let redirectTo = await getUserRedirectPath();
          
          // Override with original intended destination if user has progress and was going somewhere specific
          const from = location.state?.from?.pathname;
          if (from && from !== '/login' && redirectTo === '/dashboard') {
            console.log('📍 Login: Overriding redirect with original destination:', from);
            redirectTo = from;
          }
          
          console.log('🎯 Login: Final redirect destination:', redirectTo);
          navigate(redirectTo, { replace: true });
          
        } catch (error) {
          console.error('💥 Login: Error during redirect determination:', error);
          // Fallback redirect
          navigate('/maturity-calculator', { replace: true });
        }
      }, 300); // Slightly increased delay for async operations

      return () => clearTimeout(redirectTimer);
    }
  }, [user, isAuthorized, loading, authorizationLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    console.log('🔑 Login: Starting login process for:', email);
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('❌ Login: Sign in failed:', error);
        
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
        return;
      }

      console.log('✅ Login: Sign in successful');
      toast({
        title: t.welcomeBack,
        description: t.loginSuccessful,
      });
      
      // Immediate redirect - AuthProvider will handle session validation
      const redirectPath = await getUserRedirectPath();
      const targetPath = redirectPath || (location.state as any)?.from?.pathname || '/dashboard';
      
      console.log('📍 Login: Redirecting to:', targetPath);
      navigate(targetPath, { replace: true });
      
    } catch (error) {
      console.error('❌ Login: Unexpected error:', error);
      toast({
        title: t.errorOccurred,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth or authorization
  if (loading || (user && authorizationLoading)) {
    console.log('Login: Showing loading state', { loading, authorizationLoading });
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-white flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div>
            {loading ? 'Checking session...' : 'Verifying authorization...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950">
      {/* Header with logo and language switcher */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <MotionLogo variant="light" size="lg" />
          <LanguageSwitcherButton 
            variant="login" 
            onClick={openLanguageModal}
          />
        </div>
      </header>
      
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Login Form */}
        <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-2">
                {t.title}
              </h1>
              <p className="text-indigo-200 text-sm lg:text-base">
                {t.subtitle}
              </p>
            </div>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-indigo-200">{t.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 placeholder:text-indigo-400 text-white focus:border-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-indigo-200">{t.password}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 placeholder:text-indigo-400 text-white focus:border-pink-400"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pb-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? t.signingIn : t.signIn}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-indigo-300 hover:text-white hover:bg-white/10"
                  >
                    {showDebug ? t.hideDebug : t.showDebug}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {showDebug && <AuthDebugPanel />}
          </div>
        </div>
        
        {/* Right side - Feature Slider */}
        <div className="flex-1 relative overflow-hidden">
          <LoginFeatureSlider />
        </div>
      </div>
      
      <LanguageSwitcherModal 
        isOpen={isLanguageModalOpen} 
        onClose={closeLanguageModal} 
      />
    </div>
  );
};

export default Login;
