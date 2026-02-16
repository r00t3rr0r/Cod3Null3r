import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProjects, deleteProject, duplicateProject } from '@/api/projects';
import { useToast } from '@/hooks/useToast';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.projects);
      filterAndSortProjects(response.projects, searchTerm, statusFilter, sortBy);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = (
    items: any[],
    search: string,
    status: string,
    sort: string
  ) => {
    let filtered = items;

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (sort === 'recent') {
      filtered.sort(
        (a, b) =>
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
    } else if (sort === 'oldest') {
      filtered.sort(
        (a, b) =>
          new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
      );
    } else if (sort === 'alphabetical') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProjects(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterAndSortProjects(projects, value, statusFilter, sortBy);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterAndSortProjects(projects, searchTerm, value, sortBy);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    filterAndSortProjects(projects, searchTerm, statusFilter, value);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
      filterAndSortProjects(
        projects.filter((p) => p._id !== id),
        searchTerm,
        statusFilter,
        sortBy
      );
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProject(id);
      toast({
        title: 'Success',
        description: 'Project duplicated successfully',
      });
      loadProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate project',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage and organize your AI-generated applications
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="imported">Imported</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">Loading projects...</p>
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first project to get started'}
                </p>
                <Button
                  onClick={() => navigate('/create')}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <Plus className="h-4 w-4" />
                  Create New App
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};