import express from 'express';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';
import ProjectService from '../services/projectService';
const router = express.Router();
// Get all files for a project
router.get('/projects/:projectId/files', requireUser(ALL_ROLES), async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // Verify project ownership
        const project = await ProjectService.get(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        // For now, return mock files (in production, this would read actual generated files)
        const files = [
            {
                path: 'src/App.tsx',
                name: 'App.tsx',
                content: `import React from 'react';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <Router>\n      <Routes>\n        <Route path="/" element={<div>Home</div>} />\n      </Routes>\n    </Router>\n  );\n}\n\nexport default App;`,
                language: 'typescript',
                size: 250
            },
            {
                path: 'package.json',
                name: 'package.json',
                content: `{\n  "name": "${project.name.toLowerCase().replace(/\s+/g, '-')}",\n  "version": "1.0.0",\n  "type": "module"\n}`,
                language: 'json',
                size: 100
            }
        ];
        return res.json({ files });
    }
    catch (error) {
        console.error('Error fetching project files:', error);
        return res.status(500).json({ message: 'Failed to fetch project files' });
    }
});
// Get a specific file content
router.get('/projects/:projectId/files/*', requireUser(ALL_ROLES), async (req, res) => {
    try {
        const { projectId } = req.params;
        const filePath = req.params[0];
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // Verify project ownership
        const project = await ProjectService.get(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        // For now, return mock file content
        const file = {
            path: filePath,
            name: filePath.split('/').pop() || '',
            content: `// File content for ${filePath}\n// Project: ${project.name}`,
            language: 'typescript',
            size: 100
        };
        return res.json({ file });
    }
    catch (error) {
        console.error('Error fetching file content:', error);
        return res.status(500).json({ message: 'Failed to fetch file content' });
    }
});
export default router;
//# sourceMappingURL=codeFileRoutes.js.map