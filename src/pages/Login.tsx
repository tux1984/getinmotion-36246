
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, isAuthorized, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  
  console.log('Login: Component rendering, user:', user?.email, 'authorized:', isAuthorized, 'loading:', loading);
  
  const translations = {
    en: {
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
      loginSuccessful: "Login successful"
    },
    es: {
      title: "Acceder a GET IN MOTION",
      subtitle: "Ingresa tus credenciales para acceder a la plataforma",
      email: "Email",
      password: "Contraseña",
      signIn: "Iniciar Sesión",
      signingIn: "Iniciando sesión...",
      emailPlaceholder: "Ingresa tu email",
      passwordPlaceholder: "Ingresa tu contraseña",
      unauthorized: "Usuario no autorizado",
      unauthorizedMessage: "Tu cuenta no está autorizada para acceder a este sistema",
      invalidCredentials: "Credenciales inválidas",
      invalidCredentialsMessage: "Por favor verifica tu email y contraseña",
      errorOccurred: "Ocurrió un error",
      welcomeBack: "¡Bienvenido de vuelta!",
      loginSuccessful: "Inicio de sesión exitoso"
    }
  };
  
  const t = translations[language];
  
  // Check if user has completed onboarding
  const checkOnboardingStatus = () => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    return onboardingCompleted === 'true';
  };
  
  // Redirect if already authenticated and authorized
  useEffect(() => {
    if (!loading && user && isAuthorized) {
      console.log('Login: User authenticated and authorized, redirecting');
      
      // Check if user has completed onboarding
      const hasCompletedOnboarding = checkOnboardingStatus();
      
      // Determine redirect destination
      let redirectTo = '/maturity-calculator'; // Default for new users
      if (hasCompletedOnboarding) {
        redirectTo = '/dashboard'; // For returning users who completed onboarding
      }
      
      // Override with original intended destination if exists
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        redirectTo = from;
      }
      
      console.log('Login: Redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
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
        toast({
          title: error.message.includes('no autorizado') ? t.unauthorized : t.invalidCredentials,
          description: error.message.includes('no autorizado') ? t.unauthorizedMessage : t.invalidCredentialsMessage,
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

  if (loading) {
    console.log('Login: Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <MotionLogo variant="light" />
        <LanguageSwitcher />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
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
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? t.signingIn : t.signIn}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
