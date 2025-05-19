
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { checkSupabaseConnection } from '@/lib/supabase-client';

interface ConnectionStatus {
  connected: boolean;
  message: string;
  error?: any;
  missing?: {
    url: boolean;
    key: boolean;
  };
}

export const SupabaseStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const result = await checkSupabaseConnection();
      setStatus(result);
    } catch (error) {
      setStatus({
        connected: false,
        message: `Error checking connection: ${error.message}`,
        error
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (!status) {
    return (
      <Alert className="bg-indigo-900/40 border-indigo-700/50">
        <AlertCircle className="h-4 w-4 text-indigo-300" />
        <AlertDescription className="text-indigo-300">
          Checking Supabase connection...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={status.connected ? 
      "bg-green-900/20 border-green-700/30" : 
      "bg-orange-900/20 border-orange-700/30"
    }>
      {status.connected ? (
        <CheckCircle className="h-4 w-4 text-green-400" />
      ) : (
        <AlertCircle className="h-4 w-4 text-orange-400" />
      )}
      <div className="flex flex-col space-y-2 w-full">
        <AlertDescription className={status.connected ? "text-green-300" : "text-orange-300"}>
          {status.message}
        </AlertDescription>
        
        {!status.connected && status.missing && (
          <div className="text-sm text-orange-300/80">
            <p>Missing environment variables:</p>
            <ul className="list-disc pl-5 mt-1">
              {status.missing.url && <li>VITE_SUPABASE_URL</li>}
              {status.missing.key && <li>VITE_SUPABASE_ANON_KEY</li>}
            </ul>
            <p className="mt-2">
              Set these in Project Settings &gt; Environment Variables
            </p>
          </div>
        )}
        
        <div className="text-right">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnection}
            disabled={checking}
            className="text-xs border-current text-inherit hover:bg-current hover:text-black"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${checking ? 'animate-spin' : ''}`} />
            {checking ? 'Checking...' : 'Check Again'}
          </Button>
        </div>
      </div>
    </Alert>
  );
};
