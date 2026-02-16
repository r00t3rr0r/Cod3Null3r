import api from './api';

// Description: Get all files for a project
// Endpoint: GET /api/projects/:projectId/files
// Request: {}
// Response: { files: Array<CodeFile> }
export const getProjectFiles = (projectId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        files: [
          {
            path: 'src/App.tsx',
            name: 'App.tsx',
            content: `import React from 'react';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport { Layout } from './components/Layout';\nimport { Dashboard } from './pages/Dashboard';\n\nfunction App() {\n  return (\n    <Router>\n      <Layout>\n        <Routes>\n          <Route path="/" element={<Dashboard />} />\n        </Routes>\n      </Layout>\n    </Router>\n  );\n}\n\nexport default App;`,
            language: 'typescript',
            size: 342,
          },
          {
            path: 'src/components/Layout.tsx',
            name: 'Layout.tsx',
            content: `import React from 'react';\nimport { Header } from './Header';\nimport { Sidebar } from './Sidebar';\n\nexport const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {\n  return (\n    <div className="flex h-screen">\n      <Sidebar />\n      <div className="flex-1 flex flex-col">\n        <Header />\n        <main className="flex-1 overflow-auto">\n          {children}\n        </main>\n      </div>\n    </div>\n  );\n};`,
            language: 'typescript',
            size: 298,
          },
          {
            path: 'src/pages/Dashboard.tsx',
            name: 'Dashboard.tsx',
            content: `import React from 'react';\nimport { Card } from '../components/Card';\n\nexport const Dashboard: React.FC = () => {\n  return (\n    <div className="p-6">\n      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>\n      <div className="grid grid-cols-3 gap-4">\n        <Card title="Tasks" value="24" />\n        <Card title="Completed" value="18" />\n        <Card title="In Progress" value="6" />\n      </div>\n    </div>\n  );\n};`,
            language: 'typescript',
            size: 256,
          },
          {
            path: 'package.json',
            name: 'package.json',
            content: `{\n  "name": "task-management-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "react-router-dom": "^6.8.0"\n  }\n}`,
            language: 'json',
            size: 234,
          },
        ],
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/projects/${projectId}/files`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get a specific file content
// Endpoint: GET /api/projects/:projectId/files/:filePath
// Request: {}
// Response: { file: CodeFile }
export const getFileContent = (projectId: string, filePath: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        file: {
          path: filePath,
          name: filePath.split('/').pop() || '',
          content: `// File content for ${filePath}`,
          language: 'typescript',
          size: 1024,
        },
      });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/projects/${projectId}/files/${filePath}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};