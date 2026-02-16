import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ChevronRight, ChevronDown, File, Folder, Search } from 'lucide-react';
import { Button } from './ui/button';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  language?: string;
}

interface FileTreeProps {
  files: any[];
  onFileSelect?: (path: string) => void;
  selectedFile?: string;
}

export const FileTree: React.FC<FileTreeProps> = ({ files, onFileSelect, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const buildFileTree = (files: any[]): FileNode[] => {
    const tree: { [key: string]: FileNode } = {};

    files.forEach((file) => {
      const parts = file.path.split('/');
      let current = tree;

      parts.forEach((part, index) => {
        if (!current[part]) {
          const isFile = index === parts.length - 1;
          current[part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: isFile ? 'file' : 'folder',
            children: isFile ? undefined : [],
            language: isFile ? file.language : undefined,
          };
        }
        if (current[part].children) {
          current = current[part].children as any;
        }
      });
    });

    return Object.values(tree);
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTree = (nodes: FileNode[], level: number = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isExpanded = expandedFolders.has(node.path);
      const matchesSearch =
        searchTerm === '' || node.name.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch && node.type === 'file') return null;

      return (
        <div key={node.path}>
          <div
            className={`flex items-center gap-1 px-2 py-1 hover:bg-accent rounded cursor-pointer text-sm ${
              selectedFile === node.path ? 'bg-accent' : ''
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(node.path);
              } else {
                onFileSelect?.(node.path);
              }
            }}
          >
            {node.type === 'folder' ? (
              <>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <Folder className="h-4 w-4 text-blue-500" />
              </>
            ) : (
              <>
                <div className="w-4" />
                <File className="h-4 w-4 text-gray-500" />
              </>
            )}
            <span className="truncate">{node.name}</span>
          </div>
          {node.type === 'folder' && isExpanded && node.children && (
            <div>{renderTree(node.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const tree = buildFileTree(files);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Project Structure</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderTree(tree)}
        </div>
      </CardContent>
    </Card>
  );
};