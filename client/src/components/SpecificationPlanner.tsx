import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Loader, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { generateSpecification, exportSpecification } from '@/api/specifications';
import type { AppSpecification } from '@/api/specifications';

interface SpecificationPlannerProps {
  projectName: string;
  projectDescription: string;
  requirements: Record<string, unknown>[];
}

export const SpecificationPlanner: React.FC<SpecificationPlannerProps> = ({
  projectName,
  projectDescription,
  requirements,
}) => {
  const { toast } = useToast();
  const [specification, setSpecification] = useState<AppSpecification | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'markdown' | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const handleGenerateSpec = async () => {
    try {
      setLoading(true);
      const response = await generateSpecification(projectName, projectDescription, requirements);
      setSpecification(response.specification);
      setExpandedSections(new Set(['overview', 'requirements']));
      toast({
        title: 'Success',
        description: 'Application specification generated successfully',
      });
    } catch (error) {
      console.error('Failed to generate specification:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate specification',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'markdown') => {
    if (!specification) return;

    try {
      setExporting(format);
      await exportSpecification(specification.id, format);
      toast({
        title: 'Success',
        description: `Specification exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Failed to export:', error);
      toast({
        title: 'Error',
        description: `Failed to export as ${format.toUpperCase()}`,
        variant: 'destructive',
      });
    } finally {
      setExporting(null);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (!specification) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Specification
          </CardTitle>
          <CardDescription>
            Generate comprehensive technical specifications for your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Specification includes:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✓ Functional requirements and use cases</li>
              <li>✓ Technical architecture and technology stack</li>
              <li>✓ Complete API endpoint definitions</li>
              <li>✓ Database schema and data models</li>
              <li>✓ Security and performance requirements</li>
              <li>✓ Scalability and deployment strategy</li>
            </ul>
          </div>

          <Button
            onClick={handleGenerateSpec}
            disabled={loading}
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Generating Specification...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Detailed Specification
              </>
            )}
          </Button>

          {loading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Generating comprehensive specification...</p>
              <Progress value={65} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{specification.projectName} - Specification v{specification.version}</CardTitle>
            <CardDescription>
              Generated on{' '}
              {new Date(specification.generatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('markdown')}
              disabled={exporting === 'markdown'}
              className="gap-2"
            >
              {exporting === 'markdown' ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              disabled={exporting === 'pdf'}
              className="gap-2"
            >
              {exporting === 'pdf' ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overview Section */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('overview')}
            className="w-full p-4 hover:bg-accent transition-colors text-left flex items-center justify-between font-semibold"
          >
            <span>Project Overview</span>
            <span>{expandedSections.has('overview') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('overview') && (
            <div className="border-t bg-muted/30 p-4 space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{specification.projectDescription}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Target Audience</h4>
                <p className="text-sm text-muted-foreground">{specification.targetAudience}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Objectives</h4>
                <ul className="space-y-1">
                  {specification.objectives.map((obj, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Functional Requirements */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('requirements')}
            className="w-full p-4 hover:bg-accent transition-colors text-left flex items-center justify-between font-semibold"
          >
            <span>Functional Requirements ({specification.functionalRequirements.length})</span>
            <span>{expandedSections.has('requirements') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('requirements') && (
            <div className="border-t bg-muted/30 p-4 space-y-3">
              {specification.functionalRequirements.map((req) => (
                <div key={req.id} className="pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h5 className="font-medium text-sm">{req.title}</h5>
                    <Badge variant="secondary" className="text-xs">
                      {req.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technical Requirements */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('technical')}
            className="w-full p-4 hover:bg-accent transition-colors text-left flex items-center justify-between font-semibold"
          >
            <span>Technical Requirements ({specification.technicalRequirements.length})</span>
            <span>{expandedSections.has('technical') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('technical') && (
            <div className="border-t bg-muted/30 p-4 space-y-3">
              {specification.technicalRequirements.map((tech, idx) => (
                <div key={idx} className="pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {tech.layer}
                    </Badge>
                    <span className="font-medium text-sm">{tech.technology}</span>
                    {tech.version && <span className="text-xs text-muted-foreground">v{tech.version}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{tech.rationale}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Endpoints */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('api')}
            className="w-full p-4 hover:bg-accent transition-colors text-left flex items-center justify-between font-semibold"
          >
            <span>API Endpoints ({specification.apiEndpoints.length})</span>
            <span>{expandedSections.has('api') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('api') && (
            <div className="border-t bg-muted/30 p-4 space-y-3">
              {specification.apiEndpoints.map((endpoint) => (
                <div key={endpoint.id} className="pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {endpoint.method}
                    </Badge>
                    <code className="text-xs font-mono">{endpoint.path}</code>
                    {endpoint.authentication && (
                      <Badge variant="secondary" className="text-xs">
                        Auth
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Models */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('models')}
            className="w-full p-4 hover:bg-accent transition-colors text-left flex items-center justify-between font-semibold"
          >
            <span>Data Models ({specification.dataModels.length})</span>
            <span>{expandedSections.has('models') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('models') && (
            <div className="border-t bg-muted/30 p-4 space-y-3">
              {specification.dataModels.map((model) => (
                <div key={model.id} className="pb-3 border-b last:border-b-0 last:pb-0">
                  <h5 className="font-medium text-sm mb-2">{model.name}</h5>
                  <p className="text-sm text-muted-foreground mb-2">{model.description}</p>
                  <div className="space-y-1">
                    {model.fields.map((field, idx) => (
                      <div key={idx} className="text-xs">
                        <code className="font-mono">{field.name}</code>
                        <span className="ml-2 text-muted-foreground">{field.type}</span>
                        {field.required && <Badge className="ml-2 text-xs">Required</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Architecture & Security */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('architecture')}
            className="w-full p-4 hover:bg-accent transition-colors text-left flex items-center justify-between font-semibold"
          >
            <span>Architecture & Security</span>
            <span>{expandedSections.has('architecture') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('architecture') && (
            <div className="border-t bg-muted/30 p-4 space-y-4">
              <div>
                <h5 className="font-medium text-sm mb-2">Architecture Overview</h5>
                <p className="text-sm text-muted-foreground">{specification.architecture}</p>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-2">Security Considerations</h5>
                <ul className="space-y-1">
                  {specification.securityConsiderations.map((sec, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {sec}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-2">Performance Requirements</h5>
                <ul className="space-y-1">
                  {specification.performanceRequirements.map((perf, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {perf}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Deployment & Scalability */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('deployment')}
            className="w-full p-4 hover:bg-accent transition-colors text-left flex items-center justify-between font-semibold"
          >
            <span>Deployment & Scalability</span>
            <span>{expandedSections.has('deployment') ? '−' : '+'}</span>
          </button>
          {expandedSections.has('deployment') && (
            <div className="border-t bg-muted/30 p-4 space-y-4">
              <div>
                <h5 className="font-medium text-sm mb-2">Scalability Plan</h5>
                <p className="text-sm text-muted-foreground">{specification.scalabilityPlan}</p>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-2">Deployment Strategy</h5>
                <p className="text-sm text-muted-foreground">{specification.deploymentStrategy}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
