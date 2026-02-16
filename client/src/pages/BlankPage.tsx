import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const BlankPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-6xl">🚀</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Page Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};