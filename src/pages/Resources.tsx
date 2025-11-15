import { useEffect, useState } from 'react';
import { supabase, Resource } from '../lib/supabase';
import { BookOpen, Video, Users, FileText, ExternalLink } from 'lucide-react';

type ResourcesProps = {
  onNavigate: (page: string) => void;
  recommendedSkills?: string[];
};

export default function Resources({ onNavigate, recommendedSkills = [] }: ResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      setResources(data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'course':
        return BookOpen;
      case 'mentorship':
        return Users;
      case 'template':
        return FileText;
      case 'guide':
        return Video;
      default:
        return BookOpen;
    }
  };

  const filteredResources = filter === 'all'
    ? resources
    : resources.filter(r => r.category === filter);

  const recommendedResources = recommendedSkills.length > 0
    ? resources.filter(r => r.skill_tags.some(tag => recommendedSkills.includes(tag)))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
          <p className="text-gray-600 mt-2">
            Improve your skills and qualify for review opportunities
          </p>
        </div>

        {recommendedSkills.length > 0 && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Recommended for You
            </h2>
            <p className="text-gray-700 mb-4">
              Based on your vetting results, we recommend improving these skills: {recommendedSkills.join(', ')}
            </p>
            {recommendedResources.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedResources.slice(0, 4).map((resource) => {
                  const Icon = getCategoryIcon(resource.category);
                  return (
                    <div key={resource.id} className="bg-white rounded-lg p-4 border border-yellow-300">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-sm text-teal-600 hover:text-teal-700 mt-2"
                          >
                            <span>Learn More</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setFilter('course')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'course'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setFilter('mentorship')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'mentorship'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Mentorship
          </button>
          <button
            onClick={() => setFilter('template')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'template'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setFilter('guide')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'guide'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Guides
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = getCategoryIcon(resource.category);
            return (
              <div key={resource.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {resource.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {resource.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.skill_tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium"
                >
                  <span>Access Resource</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No resources found for this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
