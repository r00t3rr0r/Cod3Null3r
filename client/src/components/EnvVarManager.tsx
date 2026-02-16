import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Plus, Trash2, Eye, EyeOff, Edit, Copy, Lock } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import {
  getProjectEnvVars,
  createEnvVar,
  updateEnvVar,
  deleteEnvVar,
  revealEnvVarValue,
} from '@/api/envVars';
import type { EnvVar } from '@/api/envVars';

interface EnvVarManagerProps {
  projectId: string;
}

export const EnvVarManager: React.FC<EnvVarManagerProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVar, setEditingVar] = useState<EnvVar | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [revealedVars, setRevealedVars] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    isSecret: false,
  });

  const loadEnvVars = async () => {
    try {
      setLoading(true);
      const response = await getProjectEnvVars(projectId);
      setEnvVars(response.envVars);
    } catch (error) {
      console.error('Failed to load environment variables:', error);
      toast({
        title: 'Error',
        description: 'Failed to load environment variables',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnvVars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleOpenDialog = (envVar?: EnvVar) => {
    if (envVar) {
      setEditingVar(envVar);
      setFormData({
        key: envVar.key,
        value: envVar.value,
        description: envVar.description || '',
        isSecret: envVar.isSecret,
      });
    } else {
      setEditingVar(null);
      setFormData({
        key: '',
        value: '',
        description: '',
        isSecret: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingVar(null);
    setFormData({
      key: '',
      value: '',
      description: '',
      isSecret: false,
    });
  };

  const handleSubmit = async () => {
    if (!formData.key.trim() || !formData.value.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Key and value are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingVar) {
        await updateEnvVar(editingVar.id, formData);
        toast({
          title: 'Success',
          description: 'Environment variable updated successfully',
        });
      } else {
        await createEnvVar(projectId, formData);
        toast({
          title: 'Success',
          description: 'Environment variable created successfully',
        });
      }
      handleCloseDialog();
      loadEnvVars();
    } catch (error) {
      console.error('Failed to save environment variable:', error);
      toast({
        title: 'Error',
        description: 'Failed to save environment variable',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEnvVar(id);
      toast({
        title: 'Success',
        description: 'Environment variable deleted successfully',
      });
      setDeleteConfirmId(null);
      loadEnvVars();
    } catch (error) {
      console.error('Failed to delete environment variable:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete environment variable',
        variant: 'destructive',
      });
    }
  };

  const handleReveal = async (id: string) => {
    if (revealedVars.has(id)) {
      const newRevealed = new Set(revealedVars);
      newRevealed.delete(id);
      setRevealedVars(newRevealed);
    } else {
      try {
        const response = await revealEnvVarValue(id);
        const newEnvVars = envVars.map((v) =>
          v.id === id ? { ...v, value: response.value } : v
        );
        setEnvVars(newEnvVars);
        const newRevealed = new Set(revealedVars);
        newRevealed.add(id);
        setRevealedVars(newRevealed);
      } catch (error) {
        console.error('Failed to reveal value:', error);
        toast({
          title: 'Error',
          description: 'Failed to reveal value',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: 'Copied',
      description: 'Value copied to clipboard',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading environment variables...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Manage your project's environment variables securely
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <Plus className="h-4 w-4" />
                  Add Variable
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-slate-900">
                <DialogHeader>
                  <DialogTitle>
                    {editingVar ? 'Edit Environment Variable' : 'Add Environment Variable'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingVar
                      ? 'Update the environment variable details below.'
                      : 'Add a new environment variable to your project.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Key</Label>
                    <Input
                      id="key"
                      placeholder="DATABASE_URL"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type={formData.isSecret ? 'password' : 'text'}
                      placeholder="your-value-here"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="What is this variable used for?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="h-20"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isSecret"
                      checked={formData.isSecret}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isSecret: checked })
                      }
                    />
                    <Label htmlFor="isSecret" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Mark as secret (will be encrypted)
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingVar ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {envVars.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No environment variables</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first environment variable to get started
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Plus className="h-4 w-4" />
                Add Variable
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {envVars.map((envVar) => (
                <div
                  key={envVar.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono font-semibold">{envVar.key}</code>
                        {envVar.isSecret && (
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Secret
                          </Badge>
                        )}
                      </div>
                      {envVar.description && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {envVar.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {envVar.isSecret && !revealedVars.has(envVar.id)
                            ? '••••••••••••••••••••'
                            : envVar.value}
                        </code>
                        {envVar.isSecret && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReveal(envVar.id)}
                            className="h-6 px-2"
                          >
                            {revealedVars.has(envVar.id) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(envVar.value)}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(envVar)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(envVar.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this environment variable. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
