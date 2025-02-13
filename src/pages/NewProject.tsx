import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FileText, Wand2, Loader2, Upload, Image as ImageIcon,
  Book, Briefcase, Users, PenTool, FileCode, Mail,
  ClipboardList, Feather, MessageCircle, Code, Presentation,
  UserCheck, Coffee, Smile, Crown, Zap, Code2, TrendingUp,
  BookOpen, Heart, Award, Palette, MessageSquare
} from 'lucide-react';
import BackButton from '../components/BackButton';
import { useSubscription } from '../contexts/SubscriptionContext';

interface ToneOption {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface TemplateOption {
  id: string;
  name: string;
  icon: any;
  description: string;
}

export default function NewProject() {
  const navigate = useNavigate();
  const { checkFeatureAccess } = useSubscription();
  const [notes, setNotes] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('professional');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('business');
  const [transformedContent, setTransformedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const tones: ToneOption[] = [
    { id: 'professional', name: 'Professional', icon: Briefcase, description: 'Formal and business-appropriate tone' },
    { id: 'casual', name: 'Casual', icon: Coffee, description: 'Relaxed and conversational style' },
    { id: 'friendly', name: 'Friendly', icon: Smile, description: 'Warm and approachable tone' },
    { id: 'technical', name: 'Technical', icon: Code2, description: 'Precise and technical language' },
    { id: 'academic', name: 'Academic', icon: Book, description: 'Scholarly and research-oriented' },
    { id: 'creative', name: 'Creative', icon: Palette, description: 'Imaginative and artistic style' },
    { id: 'persuasive', name: 'Persuasive', icon: TrendingUp, description: 'Convincing and compelling tone' },
    { id: 'storytelling', name: 'Storytelling', icon: BookOpen, description: 'Narrative and engaging style' },
    { id: 'empathetic', name: 'Empathetic', icon: Heart, description: 'Understanding and compassionate' },
    { id: 'authoritative', name: 'Authoritative', icon: Crown, description: 'Confident and expert tone' },
    { id: 'inspirational', name: 'Inspirational', icon: Award, description: 'Motivating and uplifting' },
    { id: 'conversational', name: 'Conversational', icon: MessageSquare, description: 'Natural dialogue style' }
  ];

  const templates: TemplateOption[] = [
    { id: 'business', name: 'Business Report', icon: Briefcase, description: 'Professional business documentation' },
    { id: 'academic', name: 'Academic Paper', icon: Book, description: 'Scholarly research and essays' },
    { id: 'presentation', name: 'Presentation', icon: Presentation, description: 'Slide deck and speech notes' },
    { id: 'technical', name: 'Technical Doc', icon: FileCode, description: 'Technical documentation and guides' },
    { id: 'email', name: 'Email', icon: Mail, description: 'Professional email communication' },
    { id: 'creative', name: 'Creative Writing', icon: Feather, description: 'Stories and creative pieces' },
    { id: 'meeting', name: 'Meeting Notes', icon: ClipboardList, description: 'Meeting minutes and summaries' },
    { id: 'social', name: 'Social Media', icon: Users, description: 'Social media content' },
    { id: 'blog', name: 'Blog Post', icon: PenTool, description: 'Blog articles and posts' },
    { id: 'documentation', name: 'API Docs', icon: Code, description: 'API and code documentation' },
    { id: 'chat', name: 'Chat Script', icon: MessageCircle, description: 'Conversation scripts' },
    { id: 'tutorial', name: 'Tutorial', icon: BookOpen, description: 'Step-by-step guides' }
  ];

  const handleNotesChange = (value: string) => {
    const { hasAccess, message } = checkFeatureAccess('noteLength', value.length);
    if (!hasAccess) {
      setError(message || 'Note length exceeds your plan limit');
      return;
    }
    setError('');
    setNotes(value);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setImageFile(file);
      setError('');
    }
  };

  const handleTransform = async () => {
    if (!notes.trim() && !imageFile) {
      setError('Please enter text or upload an image');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Your transformation logic here
      setTransformedContent('Transformed content will appear here');
    } catch (err) {
      setError('Failed to transform content');
    } finally {
      setIsLoading(false);
    }
  };

  const SelectableOption = ({ 
    option, 
    isSelected, 
    onSelect 
  }: { 
    option: ToneOption | TemplateOption; 
    isSelected: boolean; 
    onSelect: () => void;
  }) => {
    const Icon = option.icon;
    return (
      <div
        onClick={onSelect}
        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'border-indigo-600 bg-indigo-50' 
            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`} />
          <div>
            <h3 className={`font-medium ${isSelected ? 'text-indigo-600' : 'text-gray-900'}`}>
              {option.name}
            </h3>
            <p className="text-sm text-gray-500">{option.description}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Helmet>
        <title>New Project - MessyNotes.ai</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton className="mb-6" />
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-900 mb-8">Create New Project</h1>

          <div className="space-y-8">
            {/* Template Selection */}
            <div>
              <h2 className="text-xl font-semibold text-purple-900 mb-4">Choose Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <SelectableOption
                    key={template.id}
                    option={template}
                    isSelected={selectedTemplate === template.id}
                    onSelect={() => setSelectedTemplate(template.id)}
                  />
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <h2 className="text-xl font-semibold text-purple-900 mb-4">Select Tone</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tones.map((tone) => (
                  <SelectableOption
                    key={tone.id}
                    option={tone}
                    isSelected={selectedTone === tone.id}
                    onSelect={() => setSelectedTone(tone.id)}
                  />
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-purple-900 mb-2">
                    Your Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={12}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 resize-y"
                    placeholder="Enter your messy notes here..."
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                  />
                </div>

                {/* Image Upload */}
                <div className="flex items-center space-x-4">
                  <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-purple-300 shadow-sm text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50">
                    <Upload className="w-5 h-5 mr-2" />
                    Attach Image
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {imageFile && (
                    <span className="text-sm text-purple-600">
                      {imageFile.name}
                    </span>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  onClick={handleTransform}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Transform
                    </>
                  )}
                </button>

                {transformedContent && (
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Transformed Content
                    </label>
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="text-purple-900 whitespace-pre-wrap">{transformedContent}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}