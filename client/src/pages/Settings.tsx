import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { EnvVarManager } from '@/components/EnvVarManager';
import { LLMConfigManager } from '@/components/LLMConfigManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Key, Bell, Palette, Lock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [notifications, setNotifications] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(false);
  const [theme, setTheme] = useState('auto');
  const [codeStyle, setCodeStyle] = useState('prettier');
  const [indentation, setIndentation] = useState('2');

  const handleSaveSettings = () => {
    toast({
      title: 'Success',
      description: 'Settings saved successfully',
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Configure your SourceCodeNuller preferences
              </p>
            </div>

            <Tabs defaultValue="api" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="api" className="gap-2">
                  <Key className="h-4 w-4" />
                  API
                </TabsTrigger>
                <TabsTrigger value="llm" className="gap-2">
                  <Zap className="h-4 w-4" />
                  LLM Config
                </TabsTrigger>
                <TabsTrigger value="env-vars" className="gap-2">
                  <Lock className="h-4 w-4" />
                  Environment
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="gap-2">
                  <Palette className="h-4 w-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="code">Code Style</TabsTrigger>
              </TabsList>

              <TabsContent value="api" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic API Configuration</CardTitle>
                    <CardDescription>
                      Configure your AI model settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your OpenAI API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-xs text-slate-500">
                        Your API key is stored securely and never shared
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger id="model">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleSaveSettings}
                      className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <Save className="h-4 w-4" />
                      Save API Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="llm" className="space-y-6">
                <LLMConfigManager />
              </TabsContent>

              <TabsContent value="env-vars" className="space-y-6">
                <EnvVarManager projectId="mock-project-id" />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Control how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Notifications</Label>
                        <p className="text-sm text-slate-500">
                          Receive notifications for important events
                        </p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sound Notifications</Label>
                        <p className="text-sm text-slate-500">
                          Play sound for notifications
                        </p>
                      </div>
                      <Switch
                        checked={soundNotifications}
                        onCheckedChange={setSoundNotifications}
                        disabled={!notifications}
                      />
                    </div>

                    <Button
                      onClick={handleSaveSettings}
                      className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <Save className="h-4 w-4" />
                      Save Notification Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize the look and feel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleSaveSettings}
                      className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <Save className="h-4 w-4" />
                      Save Appearance Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Code Style</CardTitle>
                    <CardDescription>
                      Configure code generation preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code-style">Code Formatter</Label>
                      <Select value={codeStyle} onValueChange={setCodeStyle}>
                        <SelectTrigger id="code-style">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prettier">Prettier</SelectItem>
                          <SelectItem value="eslint">ESLint</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="indentation">Indentation</Label>
                      <Select value={indentation} onValueChange={setIndentation}>
                        <SelectTrigger id="indentation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 Spaces</SelectItem>
                          <SelectItem value="4">4 Spaces</SelectItem>
                          <SelectItem value="tab">Tab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleSaveSettings}
                      className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <Save className="h-4 w-4" />
                      Save Code Style Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};