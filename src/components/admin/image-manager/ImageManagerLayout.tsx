
import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

interface ImageManagerLayoutProps {
  contexts: string[];
  selectedContext: string | null;
  onSelectContext: (context: string) => void;
  children: React.ReactNode;
}

export const ImageManagerLayout: React.FC<ImageManagerLayoutProps> = ({
  contexts,
  selectedContext,
  onSelectContext,
  children
}) => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full rounded-lg border border-indigo-800/30 bg-indigo-900/40"
      style={{ minHeight: 'calc(100vh - 250px)' }}
    >
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <div className="flex h-full flex-col p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Categorías</h2>
          <div className="flex flex-col gap-2">
            {contexts.map(context => (
              <Button
                key={context}
                variant={selectedContext === context ? 'default' : 'ghost'}
                onClick={() => onSelectContext(context)}
                className={cn(
                  "justify-start capitalize",
                  selectedContext === context
                    ? "bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white"
                    : "text-indigo-200 hover:bg-indigo-800/50 hover:text-white"
                )}
              >
                {context.replace(/-/g, ' ')}
              </Button>
            ))}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <div className="h-full overflow-y-auto p-6">
          {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
