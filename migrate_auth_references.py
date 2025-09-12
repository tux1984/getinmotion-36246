#!/usr/bin/env python3
"""
Script para migrar todas las referencias de useAuth a useRobustAuth
"""

import os
import re

def migrate_file(filepath):
    """Migra un archivo de useAuth a useRobustAuth"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Reemplazar el import
        content = re.sub(
            r"import { (.+) } from '@/context/AuthContext';",
            r"import { \1 } from '@/hooks/useRobustAuth';",
            content
        )
        
        # Reemplazar las llamadas a useAuth()
        content = re.sub(r'useAuth\(\)', 'useRobustAuth()', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
    except Exception as e:
        print(f"Error migrando {filepath}: {e}")
        return False

# Lista de archivos a migrar
files_to_migrate = [
    # Componentes
    "src/components/cultural/MaturityCalculatorSimplified.tsx",
    "src/components/cultural/SimpleCulturalMaturityCalculator.tsx",
    "src/components/dashboard/AgentTasksPanel.tsx",
    "src/components/dashboard/MasterCoordinatorPanel.tsx",
    "src/components/dashboard/ModernFloatingAgentChat.tsx",
    "src/components/dashboard/MyMissionsDashboard.tsx",
    "src/components/dashboard/RobustPremiumDashboard.tsx",
    "src/components/dashboard/TaskManager.tsx",
    "src/components/master-coordinator/BusinessProfileDialog.tsx",
    "src/components/master-coordinator/MasterCoordinatorCommandCenter.tsx",
    "src/components/profile/DeliverablesCenter.tsx",
    "src/components/shop/IntelligentShopCreationWizard.tsx",
    "src/components/tasks/IntelligentTaskInterface.tsx",
    "src/components/tasks/QuestionCollector.tsx",
    
    # Hooks
    "src/hooks/use-ai-agent-with-tasks.ts",
    "src/hooks/use-ai-agent.ts",
    "src/hooks/useAIAssistant.ts",
    "src/hooks/useAIRecommendations.ts",
    "src/hooks/useAgentConversations.ts",
    "src/hooks/useAgentDeliverables.ts",
    "src/hooks/useAgentStats.ts",
    "src/hooks/useArtisanTaskGeneration.ts",
    "src/hooks/useDataAudit.ts",
    "src/hooks/useDataRecovery.ts",
    "src/hooks/useOnboardingValidation.ts",
    "src/hooks/useOptimizedUserData.ts",
    "src/hooks/useProfileSync.ts",
    "src/hooks/useProgressRecovery.ts",
    "src/hooks/useProgressiveTaskGeneration.ts",
    "src/hooks/useRealtimeAgents.ts",
    "src/hooks/useRecommendedTasks.ts",
    "src/hooks/useSecureDataAccess.ts",
    "src/hooks/useSessionMonitor.ts",
    "src/hooks/useSessionSync.ts",
    "src/hooks/useStepAI.ts",
    "src/hooks/useTaskEvolution.ts",
    "src/hooks/useTaskTitleCleanup.ts",
    "src/hooks/useUserActivity.ts",
]

print("Iniciando migración masiva de useAuth a useRobustAuth...")
migrated_count = 0

for file_path in files_to_migrate:
    if os.path.exists(file_path):
        if migrate_file(file_path):
            print(f"✓ Migrado: {file_path}")
            migrated_count += 1
        else:
            print(f"✗ Error: {file_path}")
    else:
        print(f"! No encontrado: {file_path}")

print(f"\nMigración completa: {migrated_count}/{len(files_to_migrate)} archivos migrados")