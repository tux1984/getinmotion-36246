
import React from 'react';
import { SupabaseStatus } from './SupabaseStatus';

interface WaitlistFormHeaderProps {
  title: string;
  showConnectionStatus: boolean;
}

export const WaitlistFormHeader: React.FC<WaitlistFormHeaderProps> = ({
  title,
  showConnectionStatus
}) => {
  return (
    <>
      <h3 className="text-xl font-semibold text-center mb-6">{title}</h3>
      
      {showConnectionStatus && (
        <div className="mb-4">
          <SupabaseStatus />
        </div>
      )}
    </>
  );
};
