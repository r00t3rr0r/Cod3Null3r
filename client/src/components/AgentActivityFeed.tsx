import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ChevronDown, ChevronUp, Pause } from 'lucide-react';

interface ActivityItem {
  id: string;
  agentId: string;
  agentName: string;
  task: string;
  status: 'completed' | 'working' | 'error';
  filesModified: string[];
  timeSpent: number;
  timestamp: string;
  progress?: number;
}

interface AgentActivityFeedProps {
  activities: ActivityItem[];
  onPause?: () => void;
}

export const AgentActivityFeed: React.FC<AgentActivityFeedProps> = ({ activities, onPause }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'working':
        return '⏳';
      case 'error':
        return '✕';
      default:
        return '○';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'working':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Agent Activity</CardTitle>
          {activities.some((a) => a.status === 'working') && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPause}
              className="gap-2"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border rounded-lg p-3 hover:bg-accent transition-colors"
          >
            <div
              className="flex items-start justify-between cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === activity.id ? null : activity.id)
              }
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${getStatusColor(activity.status)}`}>
                    {getStatusIcon(activity.status)}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{activity.agentName}</p>
                    <p className="text-xs text-muted-foreground">{activity.task}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
                {expandedId === activity.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>

            {activity.status === 'working' && activity.progress !== undefined && (
              <div className="mt-2">
                <Progress value={activity.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.progress}% • {formatTime(activity.timeSpent)}
                </p>
              </div>
            )}

            {expandedId === activity.id && (
              <div className="mt-3 pt-3 border-t space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Files Modified:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activity.filesModified.length > 0 ? (
                      activity.filesModified.map((file) => (
                        <Badge key={file} variant="secondary" className="text-xs">
                          {file}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No files yet</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Time: {formatTime(activity.timeSpent)}</span>
                  <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};