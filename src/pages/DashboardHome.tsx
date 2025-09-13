
import React, { useState, useEffect } from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { OptimizedMaturityWizard } from '@/components/cultural/OptimizedMaturityWizard';
import { OptimizedMasterCoordinator } from '@/components/dashboard/OptimizedMasterCoordinator';
import { SecureUserManagement } from '@/components/admin/SecureUserManagement';
import { CategoryScore } from '@/types/dashboard';
import { safeSupabase } from '@/utils/supabase-safe';
import { clearSystemCache } from '@/utils/localStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Brain, Users } from 'lucide-react';
import { toast } from 'sonner';

const DashboardHome = () => {
  const { user, loading } = useRobustAuth();
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Limpiar caché del sistema al cargar
  useEffect(() => {
    clearSystemCache();
  }, []);

  // Cargar puntuaciones de madurez existentes
  useEffect(() => {
    const loadMaturityScores = async () => {
      if (!user) return;

      try {
        setIsLoadingData(true);
        const { data, error } = await safeSupabase
          .rpc('get_latest_maturity_scores', { user_uuid: user.id });

        if (error) throw error;

        if (data && data.length > 0) {
          const latest = data[0];
          setMaturityScores({
            ideaValidation: latest.idea_validation,
            userExperience: latest.user_experience,
            marketFit: latest.market_fit,
            monetization: latest.monetization
          });
          setHasCompletedTest(true);
        }
      } catch (error) {
        console.error('Error loading maturity scores:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadMaturityScores();
  }, [user]);

  // Completar test de madurez
  const handleMaturityComplete = async (scores: CategoryScore) => {
    if (!user) return;

    try {
      const { error } = await safeSupabase
        .from('user_maturity_scores')
        .insert({
          user_id: user.id,
          idea_validation: scores.ideaValidation,
          user_experience: scores.userExperience,
          market_fit: scores.marketFit,
          monetization: scores.monetization,
          profile_data: {}
        });

      if (error) throw error;

      setMaturityScores(scores);
      setHasCompletedTest(true);
      toast.success('Puntuaciones de madurez guardadas exitosamente');
    } catch (error) {
      console.error('Error saving maturity scores:', error);
      toast.error('Error al guardar las puntuaciones');
    }
  };

  // Reiniciar test
  const handleResetTest = () => {
    setMaturityScores(null);
    setHasCompletedTest(false);
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Master Coordinator</h1>
          <p className="text-muted-foreground">
            Sistema optimizado de gestión empresarial
          </p>
        </div>

        {!hasCompletedTest ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Bienvenido al Sistema
                </h2>
                <p className="text-muted-foreground mb-4">
                  Para comenzar, necesitas completar una evaluación rápida de madurez empresarial
                </p>
              </CardContent>
            </Card>

            <OptimizedMaturityWizard onComplete={handleMaturityComplete} />
          </div>
        ) : (
          <Tabs defaultValue="coordinator" className="space-y-6">
            <TabsList>
              <TabsTrigger value="coordinator" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Coordinador Maestro</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Administración</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="coordinator" className="space-y-6">
              <OptimizedMasterCoordinator maturityScores={maturityScores} />
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <SecureUserManagement />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Configuración del Sistema</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Test de Madurez</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Puntuaciones actuales de madurez empresarial
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-muted rounded">
                          <p className="text-sm text-muted-foreground">Validación</p>
                          <p className="text-lg font-bold">{maturityScores?.ideaValidation}%</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded">
                          <p className="text-sm text-muted-foreground">UX</p>
                          <p className="text-lg font-bold">{maturityScores?.userExperience}%</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded">
                          <p className="text-sm text-muted-foreground">Mercado</p>
                          <p className="text-lg font-bold">{maturityScores?.marketFit}%</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded">
                          <p className="text-sm text-muted-foreground">Monetización</p>
                          <p className="text-lg font-bold">{maturityScores?.monetization}%</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={handleResetTest}>
                        Reiniciar Test de Madurez
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Sistema</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Acciones de mantenimiento del sistema
                      </p>
                      <Button variant="outline" onClick={clearSystemCache}>
                        Limpiar Caché del Sistema
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
