import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Plus,
  GitBranch,
  Settings,
  Home,
  LayoutGrid,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/', id: 'dashboard' },
    { icon: LayoutGrid, label: 'Projects', path: '/', id: 'projects' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          SourceCodeNuller
        </h1>
        <p className="text-xs text-slate-400 mt-1">AI-Powered Development</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <Button
          onClick={() => navigate('/create')}
          className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4" />
          Create New App
        </Button>

        <Button
          onClick={() => navigate('/import')}
          variant="outline"
          className="w-full gap-2 border-slate-600 text-white hover:bg-slate-700"
        >
          <GitBranch className="h-4 w-4" />
          Import Git Project
        </Button>

        <div className="pt-4 border-t border-slate-700">
          <p className="text-xs font-semibold text-slate-400 px-2 py-2">NAVIGATION</p>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};