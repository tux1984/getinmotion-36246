import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { UserTypeSelector, UserType } from './UserTypeSelector';
import { ExistingUserHandler } from './ExistingUserHandler';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { PasswordRequirements } from './PasswordRequirements';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Mail, Eye, EyeOff, Copy, Shuffle, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserCreationWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface ShopData {
  shopName: string;
  description: string;
  craftType: string;
  region: string;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  userType: UserType;
  shopData: ShopData;
}

type WizardStep = 'email-check' | 'user-exists' | 'user-type' | 'details' | 'review';

export const UserCreationWizard: React.FC<UserCreationWizardProps> = ({
  onSuccess,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('email-check');
  const [loading, setLoading] = useState(false);
  const [existingUserData, setExistingUserData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: 'regular',
    shopData: {
      shopName: '',
      description: '',
      craftType: 'general',
      region: ''
    }
  });

  const getStepProgress = () => {
    const steps = ['email-check', 'user-type', 'details', 'review'];
    if (currentStep === 'user-exists') return 25;
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const generateSecurePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < 16; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copiado al portapapeles`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Error al copiar al portapapeles');
    }
  };

  const checkExistingUser = async () => {
    if (!formData.email.trim()) {
      toast.error('Por favor ingresa un email');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-existing-user', {
        body: { email: formData.email.trim().toLowerCase() }
      });

      if (error) throw error;

      if (data.exists) {
        setExistingUserData(data);
        setCurrentStep('user-exists');
      } else {
        setCurrentStep('user-type');
      }
    } catch (error: any) {
      console.error('Error checking user:', error);
      toast.error(error.message || 'Error al verificar usuario');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-user-by-type', {
        body: {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          fullName: formData.fullName,
          userType: formData.userType,
          additionalData: {
            shopData: formData.userType === 'shop_owner' ? formData.shopData : null
          }
        }
      });

      if (error) throw error;

      toast.success(data.message);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 'email-check':
        return formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 'user-type':
        return true; // Always valid, has default
      case 'details':
        const passwordValid = formData.password.length >= 8 && 
                             /[A-Z]/.test(formData.password) && 
                             /[a-z]/.test(formData.password) && 
                             /\d/.test(formData.password);
        const passwordsMatch = formData.password === formData.confirmPassword;
        const nameValid = formData.fullName.trim().length > 0;
        const shopValid = formData.userType !== 'shop_owner' || formData.shopData.shopName.trim().length > 0;
        return passwordValid && passwordsMatch && nameValid && shopValid;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'email-check':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Mail className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold">Verificar Email</h3>
              <p className="text-sm text-muted-foreground">
                Ingresa el email del usuario que deseas crear
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="usuario@ejemplo.com"
                className="text-center"
              />
            </div>
          </div>
        );

      case 'user-exists':
        return (
          <ExistingUserHandler
            userData={existingUserData}
            onCreateNew={() => setCurrentStep('user-type')}
            onCancel={onCancel}
          />
        );

      case 'user-type':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Seleccionar Tipo de Usuario</h3>
              <p className="text-sm text-muted-foreground">
                Define qué tipo de acceso tendrá el usuario
              </p>
            </div>
            
            <UserTypeSelector
              value={formData.userType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}
            />
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Datos del Usuario</h3>
              <p className="text-sm text-muted-foreground">
                Completa la información necesaria
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Nombre completo del usuario"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newPassword = generateSecurePassword();
                      setFormData(prev => ({ 
                        ...prev, 
                        password: newPassword,
                        confirmPassword: newPassword 
                      }));
                    }}
                    className="h-auto p-1 text-xs"
                  >
                    <Shuffle className="h-3 w-3 mr-1" />
                    Generar
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Contraseña segura"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(formData.password, 'Contraseña')}
                      className="h-auto p-1"
                    >
                      {copiedField === 'Contraseña' ? 
                        <Check className="h-3 w-3 text-green-500" /> : 
                        <Copy className="h-3 w-3" />
                      }
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-auto p-1"
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <PasswordStrengthIndicator password={formData.password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirma la contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-destructive">Las contraseñas no coinciden</p>
                )}
              </div>

              <PasswordRequirements password={formData.password} />

              {formData.userType === 'shop_owner' && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium">Información de la Tienda</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Nombre de la Tienda</Label>
                    <Input
                      id="shopName"
                      value={formData.shopData.shopName}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        shopData: { ...prev.shopData, shopName: e.target.value }
                      }))}
                      placeholder="Nombre de la tienda artesanal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.shopData.description}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        shopData: { ...prev.shopData, description: e.target.value }
                      }))}
                      placeholder="Descripción de la tienda y productos"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="craftType">Tipo de Artesanía</Label>
                      <Input
                        id="craftType"
                        value={formData.shopData.craftType}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          shopData: { ...prev.shopData, craftType: e.target.value }
                        }))}
                        placeholder="ej. Cerámica, Textil"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Región</Label>
                      <Input
                        id="region"
                        value={formData.shopData.region}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          shopData: { ...prev.shopData, region: e.target.value }
                        }))}
                        placeholder="ej. Bogotá, Medellín"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Revisar Información</h3>
              <p className="text-sm text-muted-foreground">
                Verifica que todos los datos sean correctos antes de crear el usuario
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-sm font-medium">Email:</span>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Nombre:</span>
                  <p className="text-sm text-muted-foreground">{formData.fullName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Tipo de Usuario:</span>
                  <p className="text-sm text-muted-foreground">
                    {formData.userType === 'admin' && 'Administrador'}
                    {formData.userType === 'shop_owner' && 'Propietario de Tienda'}
                    {formData.userType === 'regular' && 'Usuario Regular'}
                  </p>
                </div>

                {formData.userType === 'shop_owner' && (
                  <div className="pt-3 border-t">
                    <span className="text-sm font-medium">Tienda:</span>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      <p><strong>Nombre:</strong> {formData.shopData.shopName}</p>
                      {formData.shopData.description && (
                        <p><strong>Descripción:</strong> {formData.shopData.description}</p>
                      )}
                      <p><strong>Tipo:</strong> {formData.shopData.craftType}</p>
                      {formData.shopData.region && (
                        <p><strong>Región:</strong> {formData.shopData.region}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-primary font-medium mb-2">
                  ⚠️ Importante:
                </p>
                <ul className="text-xs text-primary space-y-1">
                  <li>• Guarda la contraseña generada en un lugar seguro</li>
                  <li>• Proporciona las credenciales al usuario de forma segura</li>
                  <li>• El usuario puede cambiar su contraseña una vez que acceda</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepActions = () => {
    switch (currentStep) {
      case 'email-check':
        return (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              onClick={checkExistingUser}
              disabled={!validateStep() || loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Verificar Email
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        );

      case 'user-exists':
        return null; // Handled by ExistingUserHandler

      case 'user-type':
        return (
          <>
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('email-check')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button 
              onClick={() => setCurrentStep('details')}
              disabled={!validateStep()}
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        );

      case 'details':
        return (
          <>
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('user-type')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button 
              onClick={() => setCurrentStep('review')}
              disabled={!validateStep()}
            >
              Revisar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        );

      case 'review':
        return (
          <>
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('details')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              onClick={createUser}
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Crear Usuario
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  if (currentStep === 'user-exists') {
    return renderStepContent();
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Crear Nuevo Usuario</CardTitle>
        <div className="space-y-2">
          <Progress value={getStepProgress()} className="w-full" />
          <p className="text-xs text-muted-foreground text-center">
            Paso {currentStep === 'email-check' ? '1' : currentStep === 'user-type' ? '2' : currentStep === 'details' ? '3' : '4'} de 4
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderStepContent()}
        
        <div className="flex justify-between pt-6 border-t">
          {renderStepActions()}
        </div>
      </CardContent>
    </Card>
  );
};