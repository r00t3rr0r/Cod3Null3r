import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface CodeEditorProps {
  filePath?: string;
  content?: string;
  language?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  filePath,
  content = '',
  language = 'typescript',
  readOnly = true,
}) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied!',
      description: 'Code copied to clipboard',
    });
  };

  const getLanguageColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      typescript: 'text-blue-600',
      javascript: 'text-yellow-600',
      jsx: 'text-blue-400',
      tsx: 'text-blue-600',
      css: 'text-purple-600',
      html: 'text-orange-600',
      json: 'text-gray-600',
      python: 'text-blue-500',
      sql: 'text-orange-500',
    };
    return colors[lang] || 'text-gray-600';
  };

  const lines = content.split('\n');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{filePath || 'Code Editor'}</CardTitle>
            <p className={`text-xs mt-1 ${getLanguageColor(language)}`}>
              {language.toUpperCase()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="bg-slate-950 text-slate-100 font-mono text-sm">
          <div className="flex">
            <div className="bg-slate-900 text-slate-500 px-4 py-4 text-right select-none">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="flex-1 p-4 overflow-x-auto">
              <code>{content}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};