
import React from 'react';
import { ModernChatInterface } from './ModernChatInterface';

interface MobileChatLayoutProps {
  agentId?: string;
  agentName?: string;
  agentColor?: string;
  agentIcon?: React.ReactNode;
  onClose?: () => void;
}

export const MobileChatLayout = (props: MobileChatLayoutProps) => {
  return (
    <div className="h-screen w-full overflow-hidden">
      <ModernChatInterface {...props} />
    </div>
  );
};
