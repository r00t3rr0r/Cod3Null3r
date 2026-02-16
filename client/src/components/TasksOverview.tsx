import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle2, Clock, AlertCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { getProjectTasks, getProjectEpics } from '@/api/tasks';
import type { Task, Epic } from '@/api/tasks';

interface TasksOverviewProps {
  projectId: string;
}

export const TasksOverview: React.FC<TasksOverviewProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, epicsResponse] = await Promise.all([
        getProjectTasks(projectId),
        getProjectEpics(projectId),
      ]);
      setTasks(tasksResponse.tasks);
      setEpics(epicsResponse.epics);
    } catch (error) {
      console.error('Failed to load tasks and epics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const toggleEpic = (epicId: string) => {
    const newExpanded = new Set(expandedEpics);
    if (newExpanded.has(epicId)) {
      newExpanded.delete(epicId);
    } else {
      newExpanded.add(epicId);
    }
    setExpandedEpics(newExpanded);
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getEpicStatusColor = (status: Epic['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const overallProgress = epics.length > 0
    ? Math.round(epics.reduce((sum, epic) => sum + epic.progress, 0) / epics.length)
    : 0;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Tasks & Progress</CardTitle>
        <CardDescription>Track development progress and task completion</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>{completedTasks} completed</span>
            <span>{inProgressTasks} in progress</span>
            <span>{totalTasks - completedTasks - inProgressTasks} pending</span>
          </div>
        </div>

        {/* Tabs for Epics and Tasks */}
        <Tabs defaultValue="epics" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="epics">Epics ({epics.length})</TabsTrigger>
            <TabsTrigger value="tasks">All Tasks ({tasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="epics" className="flex-1 overflow-y-auto mt-4 space-y-2">
            {epics.map((epic) => {
              const epicTasks = tasks.filter(t => t.epicId === epic.id);
              const isExpanded = expandedEpics.has(epic.id);

              return (
                <div key={epic.id} className="border rounded-lg overflow-hidden">
                  <div
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => toggleEpic(epic.id)}
                  >
                    <div className="flex items-start gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 mt-1 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{epic.title}</h4>
                          <Badge className={getEpicStatusColor(epic.status)} variant="secondary">
                            {epic.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                          {epic.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={epic.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {epic.completedTaskCount}/{epic.taskCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && epicTasks.length > 0 && (
                    <div className="border-t bg-muted/30">
                      {epicTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 border-b last:border-b-0 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            {getStatusIcon(task.status)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium truncate">{task.title}</span>
                                <Badge className={getStatusColor(task.status)} variant="secondary">
                                  {task.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {task.description}
                              </p>
                              {task.progress > 0 && (
                                <div className="flex items-center gap-2">
                                  <Progress value={task.progress} className="h-1 flex-1" />
                                  <span className="text-xs text-muted-foreground">
                                    {task.progress}%
                                  </span>
                                </div>
                              )}
                              {task.assignedAgent && (
                                <div className="mt-1 text-xs text-muted-foreground">
                                  Agent: {task.assignedAgent}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="tasks" className="flex-1 overflow-y-auto mt-4 space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-2">
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium">{task.title}</span>
                      <Badge className={getStatusColor(task.status)} variant="secondary">
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {task.description}
                    </p>
                    {task.progress > 0 && (
                      <div className="flex items-center gap-2 mb-1">
                        <Progress value={task.progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground">
                          {task.progress}%
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {task.assignedAgent && <span>Agent: {task.assignedAgent}</span>}
                      {task.estimatedTime && (
                        <span>Est: {task.estimatedTime}min</span>
                      )}
                      {task.actualTime && (
                        <span>Actual: {task.actualTime}min</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
