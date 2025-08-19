import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { 
  FileText, 
  Radio, 
  Users, 
  RotateCcw, 
  History, 
  Plus,
  Mic,
  Video,
  Rss,
  Heart,
  Save,
  Send,
  Upload,
  Bell
} from 'lucide-react';

interface VideoArticleEditorProps {
  article?: any;
  onBack: () => void;
  onNavigateToNewsFeeds: () => void;
}

export default function VideoArticleEditor({ article, onBack, onNavigateToNewsFeeds }: VideoArticleEditorProps) {
  const [activeTab, setActiveTab] = useState('Video Post');
  const [selectedCategory, setSelectedCategory] = useState('Politics');
  const [title, setTitle] = useState('');

  const tabs = ['Text Article', 'Audio Post', 'Video Post'];
  const categories = ['Politics', 'Business', 'Entertainment', 'Sports', 'Environment'];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">CIJ</span>
            </div>
            <div>
              <div className="font-semibold text-sm">CHENNAI</div>
              <div className="text-xs text-gray-500">INSTITUTE OF JOURNALISM</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={onNavigateToNewsFeeds}
            >
              <Radio className="w-4 h-4" />
              Agency Feeds
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={onBack}
            >
              <Users className="w-4 h-4" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <FileText className="w-4 h-4" />
              Drafts
              <span className="ml-auto bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full">
                4
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <RotateCcw className="w-4 h-4" />
              Reverted Post
              <span className="ml-auto bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                1
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <History className="w-4 h-4" />
              History Log
            </Button>
          </div>

          <div className="my-4 border-t border-gray-200"></div>

          {/* Quick Create */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Quick Create</h4>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Text Article
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Mic className="w-4 h-4" />
                Audio Post
              </Button>
              <Button variant="default" size="sm" className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700">
                <Video className="w-4 h-4" />
                Video Post
              </Button>
            </div>
          </div>

          <div className="my-4 border-t border-gray-200"></div>

          {/* Multi Window */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Multi Window</h4>
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={onNavigateToNewsFeeds}
              >
                <Rss className="w-4 h-4" />
                News Feeds
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Plus className="w-4 h-4" />
                Create Article
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <RotateCcw className="w-4 h-4" />
                Reverted Post
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Drafts
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Heart className="w-4 h-4" />
                Favourites
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-medium">Create Video Post</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <span className="text-sm text-gray-600">User Reporter</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Draft
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-2">
                  <Send className="w-4 h-4" />
                  Submit for Review
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                  className={activeTab === tab ? "bg-gray-900 text-white" : ""}
                >
                  {tab}
                </Button>
              ))}
            </div>

            {/* Content Editor Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Content Editor</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Draft</span>
                <span className="text-sm text-green-600">Auto-saved</span>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Select Category</label>
                <span className="text-red-500">*</span>
              </div>
              
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Title</label>
                <span className="text-red-500">*</span>
              </div>
              
              <Input
                placeholder="Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white"
              />
            </div>

            {/* Video Upload Section */}
            <div className="space-y-3">
              <Card className="p-12 border-2 border-dashed border-gray-300 bg-white">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <Video className="w-8 h-8 text-orange-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Or Upload video</h3>
                    <p className="text-sm text-gray-500">
                      Drag & drop your video file or click to browse
                    </p>
                    <p className="text-xs text-gray-400">
                      Supports MP4, MOV, AVI (Max 500MB)
                    </p>
                  </div>
                  
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                </div>
              </Card>
            </div>

            {/* Thumbnail Preview */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Thumbnail Preview</label>
              <div className="h-40 bg-white border border-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}