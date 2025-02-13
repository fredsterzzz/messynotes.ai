import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, FileText, Loader2, Search, Trash2, Edit, Download, ArrowLeft } from 'lucide-react';
import BackButton from '../components/BackButton';

export default function MyProjects() {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading] = React.useState(false);

  const projects = [
    {
      id: 1,
      title: 'Team Meeting Notes',
      date: '2024-02-20',
      excerpt: 'Transformed meeting notes about Q1 goals...',
      content: 'Transformed meeting notes about Q1 goals and roadmap. Discussed upcoming features, timeline, and resource allocation. Key points include:\n\n1. Q1 Goals Overview\n2. Project Milestones\n3. Resource Planning\n4. Risk Assessment'
    },
    {
      id: 2,
      title: 'Product Launch Copy',
      date: '2024-02-19',
      excerpt: 'Marketing copy for new product launch...',
      content: 'Marketing copy for our upcoming product launch. Highlights key features, benefits, and target audience. Includes:\n\n- Value Proposition\n- Key Features\n- Target Market Analysis\n- Launch Timeline'
    },
    {
      id: 3,
      title: 'Weekly Tasks',
      date: '2024-02-18',
      excerpt: 'Organized weekly todo list and goals...',
      content: 'Weekly task organization and goal setting. Prioritized items:\n\n1. High Priority Tasks\n2. Ongoing Projects\n3. Deadlines\n4. Team Coordination Points'
    }
  ];

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProject = projectId ? projects.find(p => p.id === parseInt(projectId)) : null;

  if (currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <Helmet>
          <title>{currentProject.title} - MessyNotes.ai</title>
        </Helmet>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <button
              onClick={() => navigate('/my-projects')}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Projects
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-purple-900 mb-2">{currentProject.title}</h1>
                <p className="text-gray-500">{currentProject.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50">
                  <Download className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="prose max-w-none">
              {currentProject.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Helmet>
        <title>My Projects - MessyNotes.ai</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">My Projects</h1>
          <button
            onClick={() => navigate('/new-project')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100 hover:border-purple-200"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-medium text-purple-900">{project.title}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{project.date}</span>
                </div>
                <p className="mt-2 text-gray-600 line-clamp-3">{project.excerpt}</p>
                <div className="flex justify-end mt-4">
                  <button 
                    className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project/${project.id}/edit`);
                    }}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Download logic here
                    }}
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Delete logic here
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}