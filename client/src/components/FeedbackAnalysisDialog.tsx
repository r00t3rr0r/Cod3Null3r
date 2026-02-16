import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { AlertCircle, CheckCircle2, Clock, AlertTriangle, Lightbulb } from 'lucide-react';
import type {
  FeedbackSummary,
  ImplementationPlan,
  ImplementationPhase,
} from '@/api/feedbackAnalysis';

interface FeedbackAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: FeedbackSummary | null;
  implementationPlan: ImplementationPlan | null;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'high':
      return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
    case 'medium':
      return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
    case 'low':
      return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
    default:
      return 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800';
  }
};

const PhaseItem: React.FC<{ phase: ImplementationPhase }> = ({ phase }) => {
  return (
    <div className="border-l-4 border-blue-500 pl-4 py-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-semibold">
          {phase.phase}
        </span>
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{phase.title}</h4>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{phase.description}</p>
      <div className="space-y-1 mb-3">
        {phase.tasks.map((task, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="text-blue-500 font-bold mt-0.5">•</span>
            <span className="text-slate-700 dark:text-slate-300">{task}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Clock className="h-3 w-3" />
        {phase.estimatedTime}
      </div>
    </div>
  );
};

export const FeedbackAnalysisDialog: React.FC<FeedbackAnalysisDialogProps> = ({
  open,
  onOpenChange,
  summary,
  implementationPlan,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Feedback Analysis & Implementation Plan</DialogTitle>
          <DialogDescription>
            Review the analysis of your feedback and confirm before implementing changes
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Analyzing your feedback...</p>
            </div>
          </div>
        ) : summary && implementationPlan ? (
          <div className="space-y-6">
            {/* Summary Section */}
            <Card className={`border-2 ${getComplexityColor(summary.estimatedComplexity)}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Feedback Summary
                </CardTitle>
                <CardDescription>Professional analysis of your requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Theme */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Overall Theme
                  </h4>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 text-sm">
                    {summary.overallTheme}
                  </Badge>
                </div>

                {/* Estimated Complexity */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Estimated Complexity
                  </h4>
                  <Badge
                    className={`${getPriorityColor(summary.estimatedComplexity)} px-3 py-1 text-sm font-semibold`}
                  >
                    {summary.estimatedComplexity.charAt(0).toUpperCase() +
                      summary.estimatedComplexity.slice(1)}
                  </Badge>
                </div>

                {/* Key Points */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Key Points
                  </h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">✓</span>
                        <span className="text-slate-700 dark:text-slate-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact Areas */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Impact Areas
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {summary.impactAreas.map((area, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-2 rounded bg-slate-100 dark:bg-slate-800"
                      >
                        <Badge className={getPriorityColor(area.priority)}>
                          {area.priority}
                        </Badge>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {area.area}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {area.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Plan Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  {implementationPlan.title}
                </CardTitle>
                <CardDescription>{implementationPlan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timeline */}
                <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Total Estimated Time
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {implementationPlan.totalEstimatedTime}
                    </p>
                  </div>
                </div>

                {/* Implementation Phases */}
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Implementation Phases
                  </h4>
                  <div className="space-y-4">
                    {implementationPlan.phases.map((phase) => (
                      <PhaseItem key={phase.phase} phase={phase} />
                    ))}
                  </div>
                </div>

                {/* Benefits & Risks */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Benefits */}
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {implementationPlan.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                          <span className="font-bold mt-0.5">+</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risks
                    </h4>
                    <ul className="space-y-2">
                      {implementationPlan.risks.map((risk, index) => (
                        <li key={index} className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                          <span className="font-bold mt-0.5">!</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No data available</p>
          </div>
        )}

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !summary || !implementationPlan}
            className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Proceed with Implementation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
