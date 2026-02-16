import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getClarificationQuestions, getTechStackRecommendation, getDevelopmentRoadmap, startCodeGeneration } from '@/api/appCreation';
import { useToast } from '@/hooks/useToast';

type Step = 'description' | 'clarification' | 'summary' | 'architecture' | 'generation';

interface Question {
  id: string;
  question: string;
  type: string;
  options?: string[];
}

export const CreateApp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('description');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [requirements, setRequirements] = useState<any[]>([]);
  const [techStack, setTechStack] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleDescriptionSubmit = async () => {
    if (!description.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a project description',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await getClarificationQuestions(description);
      setQuestions(response.questions);
      setCurrentQuestionIndex(0);
      setStep('clarification');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate questions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerQuestion = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, move to summary
      try {
        setLoading(true);
        const reqs = questions.map((q) => ({
          id: q.id,
          category: 'General',
          description: q.question,
          priority: 'high',
        }));
        setRequirements(reqs);

        const techResponse = await getTechStackRecommendation(reqs);
        setTechStack(techResponse.techStack);

        const roadmapResponse = await getDevelopmentRoadmap(reqs, techResponse.techStack);
        setRoadmap(roadmapResponse.roadmap);

        setStep('architecture');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to generate architecture',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartGeneration = async () => {
    if (!projectName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a project name',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await startCodeGeneration({
        projectName,
        requirements,
        techStack,
      });
      navigate(`/project/${response.projectId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start code generation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-4xl mx-auto">
            {step === 'description' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Create New App
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Describe your app idea and let our AI agents build it for you
                  </p>
                </div>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>What would you like to build?</CardTitle>
                    <CardDescription>
                      Describe your application in natural language. Be as detailed as you'd like.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="e.g., Build a task management app with user authentication, real-time collaboration, and dark mode..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-32 resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">
                        {description.length} characters
                      </span>
                      <Button
                        onClick={handleDescriptionSubmit}
                        disabled={loading || !description.trim()}
                        className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                      >
                        {loading ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Next
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 'clarification' && currentQuestion && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Let's clarify your requirements
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Answer a few questions to help us understand your vision better
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-sm text-slate-500">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentQuestion.type === 'yes-no' && (
                      <div className="flex gap-4">
                        <Button
                          variant={answers[currentQuestion.id] === 'yes' ? 'default' : 'outline'}
                          onClick={() => handleAnswerQuestion('yes')}
                          className="flex-1"
                        >
                          Yes
                        </Button>
                        <Button
                          variant={answers[currentQuestion.id] === 'no' ? 'default' : 'outline'}
                          onClick={() => handleAnswerQuestion('no')}
                          className="flex-1"
                        >
                          No
                        </Button>
                      </div>
                    )}

                    {currentQuestion.type === 'multiple-choice' && (
                      <div className="grid grid-cols-1 gap-2">
                        {currentQuestion.options?.map((option) => (
                          <Button
                            key={option}
                            variant={
                              answers[currentQuestion.id] === option ? 'default' : 'outline'
                            }
                            onClick={() => handleAnswerQuestion(option)}
                            className="justify-start"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}

                    {currentQuestion.type === 'text' && (
                      <Textarea
                        placeholder="Type your answer..."
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerQuestion(e.target.value)}
                        className="min-h-24"
                      />
                    )}

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (currentQuestionIndex > 0) {
                            setCurrentQuestionIndex(currentQuestionIndex - 1);
                          }
                        }}
                        disabled={currentQuestionIndex === 0}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline">Skip</Button>
                        <Button
                          onClick={handleNextQuestion}
                          disabled={loading}
                          className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                        >
                          {loading ? (
                            <>
                              <Loader className="h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : currentQuestionIndex === questions.length - 1 ? (
                            <>
                              Review
                              <ArrowRight className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Next
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 'architecture' && techStack && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Architecture & Tech Stack
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Review the recommended technology stack and development roadmap
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frontend</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {techStack.frontend.map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="mr-2">
                          {tech}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Backend</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {techStack.backend.map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="mr-2">
                          {tech}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Database</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {techStack.database.map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="mr-2">
                          {tech}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {techStack.tools.map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="mr-2">
                          {tech}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Development Roadmap</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {roadmap.map((phase, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-semibold mb-2">{phase.phase}</h3>
                        <ul className="space-y-1 mb-2">
                          {phase.tasks.map((task: string, i: number) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400">
                              • {task}
                            </li>
                          ))}
                        </ul>
                        <span className="text-xs text-slate-500">
                          Estimated: {phase.estimatedDays} days
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="text"
                      placeholder="Enter project name..."
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep('clarification')}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleStartGeneration}
                    disabled={loading || !projectName.trim()}
                    className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        Start Development
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};