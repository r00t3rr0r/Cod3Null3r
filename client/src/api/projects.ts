import api from './api';

// Description: Get all projects for the user
// Endpoint: GET /api/projects
// Request: {}
// Response: { projects: Array<Project> }
export const getProjects = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        projects: [
          {
            _id: '1',
            name: 'Task Management App',
            description: 'A collaborative task management application with real-time updates',
            status: 'completed',
            createdAt: '2024-01-15',
            lastModified: '2024-01-20',
            filesCount: 47,
            linesOfCode: 3250,
            technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
            type: 'new',
          },
          {
            _id: '2',
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration',
            status: 'in-progress',
            createdAt: '2024-01-18',
            lastModified: '2024-01-22',
            filesCount: 62,
            linesOfCode: 5100,
            technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
            type: 'new',
          },
          {
            _id: '3',
            name: 'Legacy Dashboard Refactor',
            description: 'Refactored and modernized existing dashboard',
            status: 'completed',
            createdAt: '2024-01-10',
            lastModified: '2024-01-19',
            filesCount: 35,
            linesOfCode: 2100,
            technologies: ['Vue.js', 'Express', 'MySQL'],
            type: 'imported',
          },
        ],
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get('/api/projects');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get a single project by ID
// Endpoint: GET /api/projects/:id
// Request: {}
// Response: { project: Project }
export const getProjectById = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        project: {
          _id: id,
          name: 'Task Management App',
          description: 'A collaborative task management application with real-time updates',
          status: 'completed',
          createdAt: '2024-01-15',
          lastModified: '2024-01-20',
          filesCount: 47,
          linesOfCode: 3250,
          technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
          type: 'new',
        },
      });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/projects/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Create a new project
// Endpoint: POST /api/projects
// Request: { name: string, description: string }
// Response: { success: boolean, projectId: string }
export const createProject = (data: { name: string; description: string }) => {
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
  //   return await api.post('/api/projects', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Delete a project
// Endpoint: DELETE /api/projects/:id
// Request: {}
// Response: { success: boolean }
export const deleteProject = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.delete(`/api/projects/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Duplicate a project
// Endpoint: POST /api/projects/:id/duplicate
// Request: {}
// Response: { success: boolean, projectId: string }
export const duplicateProject = (id: string) => {
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
  //   return await api.post(`/api/projects/${id}/duplicate`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};