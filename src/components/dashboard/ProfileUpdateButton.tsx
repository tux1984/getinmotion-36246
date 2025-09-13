import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useProfileUpdater } from '@/hooks/useProfileUpdater';

interface ProfileUpdateButtonProps {
  onSuccess?: () => void;
}

export const ProfileUpdateButton: React.FC<ProfileUpdateButtonProps> = ({ onSuccess }) => {
  const { updateProfileToTriMedias, updating } = useProfileUpdater();

  const handleUpdate = async () => {
    const success = await updateProfileToTriMedias();
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Button
      onClick={handleUpdate}
      disabled={updating}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
      {updating ? 'Actualizando...' : 'Actualizar a TriMedias'}
    </Button>
  );
};