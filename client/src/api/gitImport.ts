import api from './api';

// Description: Analyze a Git repository
// Endpoint: POST /api/git/analyze
// Request: { repositoryUrl: string }
// Response: { analysis: GitProject }
export const analyzeGitRepository = (repositoryUrl: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        analysis: {
          name: 'my-awesome-app',
          url: repositoryUrl,
          description: 'This is a full-stack web application with React frontend and Node.js/Express backend. It includes user authentication, real-time features, and a MongoDB database.',
          filesCount: 247,
          linesOfCode: 15432,
          technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'],
          issues: [
            {
              severity: 'error',
              description: 'Security vulnerability in dependencies',
              location: 'package.json',
            },
            {
              severity: 'warning',
              description: 'Large bundle size (2.5MB)',
              location: 'dist/bundle.js',
            },
            {
              severity: 'warning',
              description: '2 outdated packages',
              location: 'package.json',
            },
          ],
        },
      });
    }, 2000);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/git/analyze', { repositoryUrl });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Start Git project rework
// Endpoint: POST /api/git/rework
// Request: { repositoryUrl: string, improvements: string }
// Response: { success: boolean, projectId: string }
export const startGitRework = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        projectId: Math.random().toString(36).substr(2, 9),
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/git/rework', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};