import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, BarChart, Lock, AlertCircle } from 'lucide-react';
import { useFeatureAccess } from '../hooks/useFeatureAccess';

function Dashboard() {
  const access = useFeatureAccess();
  
  const recentProjects = [
    { id: 1, name: 'Meeting Notes', date: '2024-02-20', type: 'Business' },
    { id: 2, name: 'Product Description', date: '2024-02-19', type: 'Sales' },
    { id: 3, name: 'To-Do List', date: '2024-02-18', type: 'Personal' },
  ];

  const QuickActionCard = ({ 
    to, 
    icon: Icon, 
    title, 
    description, 
    isLocked, 
    onClick 
  }: { 
    to: string; 
    icon: any; 
    title: string; 
    description: string; 
    isLocked?: boolean;
    onClick?: () => void;
  }) => {
    const content = (
      <div className={`bg-white p-6 rounded-xl shadow-sm transition-shadow relative ${!isLocked && 'hover:shadow-md'} ${isLocked ? 'opacity-75' : ''}`}>
        <Icon className="h-8 w-8 text-indigo-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          {title}
          {isLocked && <Lock className="h-4 w-4 text-gray-400" />}
        </h3>
        <p className="text-gray-600">{description}</p>
        {isLocked && (
          <div className="absolute inset-0 bg-gray-50/50 rounded-xl flex items-center justify-center">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Upgrade to access</p>
            </div>
          </div>
        )}
      </div>
    );

    if (isLocked) {
      return (
        <div onClick={onClick} className="cursor-not-allowed">
          {content}
        </div>
      );
    }

    return <Link to={to}>{content}</Link>;
  };

  const handleUpgradeClick = () => {
    // Navigate to pricing page or show upgrade modal
    window.location.href = '/pricing';
  };

  const maxProjects = access.getMaxProjects();
  const transformationsLeft = access.getRemainingTransformations();
  const monthlyTransformations = access.getMonthlyTransformations();
  const currentPlan = access.getCurrentPlan();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to your {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Dashboard!</h1>
        <p className="text-gray-600 mt-2">
          You have {transformationsLeft} out of {monthlyTransformations} transformations remaining this month.
        </p>
        {transformationsLeft === 0 && (
          <div className="mt-4 flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p>You've used all your transformations for this month. Upgrade your plan for more!</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <QuickActionCard
          to="/new-project"
          icon={FileText}
          title="New Project"
          description={`Create up to ${maxProjects === -1 ? 'unlimited' : maxProjects} projects`}
          isLocked={!access.canPerformTransformation()}
          onClick={handleUpgradeClick}
        />

        <QuickActionCard
          to="/my-projects"
          icon={Clock}
          title="Recent Projects"
          description="View your latest transformations"
          isLocked={false}
        />

        <QuickActionCard
          to="/analytics"
          icon={BarChart}
          title="Analytics"
          description="Track your usage and insights"
          isLocked={!access.canUseAdvancedTemplates()}
          onClick={handleUpgradeClick}
        />
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          {maxProjects !== -1 && (
            <p className="text-sm text-gray-600">
              {recentProjects.length} of {maxProjects} projects used
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id} className="border-b">
                  <td className="py-3 px-4">{project.name}</td>
                  <td className="py-3 px-4">{project.type}</td>
                  <td className="py-3 px-4">{project.date}</td>
                  <td className="py-3 px-4">
                    <Link to={`/project/${project.id}`} className="text-indigo-600 hover:text-indigo-800">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;