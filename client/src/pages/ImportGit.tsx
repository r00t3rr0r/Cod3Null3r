import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Loader, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeGitRepository, startGitRework } from '@/api/gitImport';
import { useToast } from '@/hooks/useToast';

type Step = 'input' | 'analyzing' | 'review' | 'improvements';

interface GitAnalysis {
  name: string;
  url: string;
  description: string;
  filesCount: number;
  linesOfCode: number;
  technologies: string[];
  issues: Array<{
    severity: string;
    description: string;
    location: string;
  }>;
}

export const ImportGit: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('input');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [analysis, setAnalysis] = useState<GitAnalysis | null>(null);
  const [improvements, setImprovements] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!repositoryUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a repository URL',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setStep('analyzing');
      const response = await analyzeGitRepository(repositoryUrl);
      setAnalysis(response.analysis);
      setStep('review');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze repository',
        variant: 'destructive',
      });
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRework = async () => {
    if (!improvements.trim()) {
      toast({
        title: 'Error',
        description: 'Please describe what you want to improve',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await startGitRework({
        repositoryUrl,
        improvements,
      });
      navigate(`/project/${response.projectId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start rework',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-4xl mx-auto">
            {step === 'input' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Import Git Project
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Analyze and improve your existing Git repository
                  </p>
                </div>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Repository URL</CardTitle>
                    <CardDescription>
                      Enter the URL of your Git repository (GitHub, GitLab, etc.)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="https://github.com/username/repository"
                      value={repositoryUrl}
                      onChange={(e) => setRepositoryUrl(e.target.value)}
                      className="h-10"
                    />
                    <Button
                      onClick={handleAnalyze}
                      disabled={loading || !repositoryUrl.trim()}
                      className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      {loading ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze Repository
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 'analyzing' && (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <p className="text-lg font-medium">Analyzing repository...</p>
                <p className="text-slate-600 dark:text-slate-400">
                  This may take a moment as we scan your project structure
                </p>
              </div>
            )}

            {step === 'review' && analysis && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Project Analysis
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Review the analysis of your repository
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{analysis.name}</CardTitle>
                    <CardDescription>{analysis.url}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{analysis.description}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Files</p>
                        <p className="text-2xl font-bold">{analysis.filesCount}</p>
                      </div>
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Lines of Code</p>
                        <p className="text-2xl font-bold">{analysis.linesOfCode}</p>
                      </div>
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                        <p className="text-xs text-slate-600 dark:text-slate-400">Technologies</p>
                        <p className="text-2xl font-bold">{analysis.technologies.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technology Stack</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {analysis.technologies.map((tech: string) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                {analysis.issues.length > 0 && (
                  <Card className="border-red-200 dark:border-red-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Issues Detected
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {analysis.issues.map((issue, index: number) => (
                        <Alert key={index} className="border-l-4 border-red-600">
                          <AlertDescription>
                            <p className="font-medium">{issue.description}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              Location: {issue.location}
                            </p>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={() => setStep('improvements')}
                  className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  Proceed with Rework
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 'improvements' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Plan Your Improvements
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Describe what you'd like to improve or change in your project
                  </p>
                </div>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>What would you like to improve?</CardTitle>
                    <CardDescription>
                      Examples: Refactor authentication, add new features, improve performance, update dependencies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Describe your improvements..."
                      value={improvements}
                      onChange={(e) => setImprovements(e.target.value)}
                      className="min-h-32 resize-none"
                    />
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setStep('review')}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleStartRework}
                        disabled={loading || !improvements.trim()}
                        className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                      >
                        {loading ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            Start Rework
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};