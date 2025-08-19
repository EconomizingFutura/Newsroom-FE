import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
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
  Bell,
  Circle
} from 'lucide-react';

interface NewsFeedsPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToDrafts: () => void;
  onNavigateToReverted: () => void;
  onNavigateToHistory: () => void;
  onCreateNewTextArticle: () => void;
  onCreateNewAudioArticle: () => void;
  onCreateNewVideoArticle: () => void;
}

export default function NewsFeedsPage({ 
  onNavigateToDashboard, 
  onNavigateToDrafts, 
  onNavigateToReverted, 
  onNavigateToHistory,
  onCreateNewTextArticle,
  onCreateNewAudioArticle,
  onCreateNewVideoArticle
}: NewsFeedsPageProps) {
  const [activeSource, setActiveSource] = useState('BBC');

  const newsSources = ['BBC', 'The New York Times', 'Reuters', 'The Washington Post'];

  // Mock news data
  const newsArticles = {
    'BBC': [
      {
        id: 1,
        title: 'Kremlin plays down Trump\'s nuclear rhetoric as US envoy set to visit Moscow',
        image: 'https://images.unsplash.com/photo-1689902520239-47512e3b0a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrcmVtbGluJTIwbW9zY293JTIwcG9saXRpY3N8ZW58MXx8fHwxNzU1NTM3MDI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '8m ago',
        category: 'News',
        isLive: false
      },
      {
        id: 2,
        title: 'Democrats flex Texas to block Republican redistricting map backed by Trump',
        image: 'https://images.unsplash.com/photo-1668706971199-37e30a4e6298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVtcCUyMGJpZGVuJTIwcG9saXRpY2lhbnN8ZW58MXx8fHwxNzU1NTM3MDMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '1h 5 mins',
        category: 'News',
        isLive: false
      },
      {
        id: 3,
        title: 'Pastures TikToker fired over drone attacks and UK \'sociality casualty\' claim clarified',
        image: 'https://images.unsplash.com/photo-1740220520787-92e84c27a15c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc3JhZWxpJTIwZ2F6YSUyMGNvbmZsaWN0fGVufDF8fHx8MTc1NTUzNzAzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '1h 5 mins',
        category: 'News',
        isLive: true
      },
      {
        id: 4,
        title: 'Hundreds of Israeli ex-officials appeal to Trump to help end Gaza war',
        image: 'https://images.unsplash.com/photo-1719255417989-b6858e87359e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwaGFja2luZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU1NTM3MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '4 mins ago',
        category: 'News',
        isLive: false
      },
      {
        id: 5,
        title: 'Hackers, secret cables and security fears: The explosive fight over Myanmar Coup',
        image: 'https://images.unsplash.com/photo-1610470850940-27b52ca7c0fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXNsYSUyMGVsZWN0cmljJTIwY2FyfGVufDF8fHx8MTc1NTUzNzA0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '6 mins ago',
        category: 'Sport',
        isLive: false
      },
      {
        id: 6,
        title: 'Police officer removes alligator from family\'s pool with bare hands',
        image: 'https://images.unsplash.com/photo-1684979459356-b749a459e693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xpY2UlMjBvZmZpY2VyJTIwZmFtaWx5fGVufDF8fHx8MTc1NTUzNzA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '4hrs ago',
        category: 'US & Canada',
        isLive: false
      },
      {
        id: 7,
        title: 'Tesla awards boss Elon Musk $239m in shares',
        image: 'https://images.unsplash.com/photo-1610470850940-27b52ca7c0fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXNsYSUyMGVsZWN0cmljJTIwY2FyfGVufDF8fHx8MTc1NTUzNzA0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '5hrs ago',
        category: 'Business',
        isLive: false
      }
    ],
    'The New York Times': [
      {
        id: 8,
        title: 'Biden Administration Extends TPS for Venezuela Nationals',
        image: 'https://images.unsplash.com/photo-1668706971199-37e30a4e6298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVtcCUyMGJpZGVuJTIwcG9saXRpY2lhbnN8ZW58MXx8fHwxNzU1NTM3MDMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '2h ago',
        category: 'Politics',
        isLive: false
      }
    ],
    'Reuters': [
      {
        id: 9,
        title: 'Global Markets React to Economic Policy Changes',
        image: 'https://images.unsplash.com/photo-1719255417989-b6858e87359e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwaGFja2luZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU1NTM3MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '1h ago',
        category: 'Business',
        isLive: false
      }
    ],
    'The Washington Post': [
      {
        id: 10,
        title: 'Congressional Hearing on Infrastructure Spending',
        image: 'https://images.unsplash.com/photo-1689902520239-47512e3b0a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrcmVtbGluJTIwbW9zY293JTIwcG9saXRpY3N8ZW58MXx8fHwxNzU1NTM3MDI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        time: '3h ago',
        category: 'Politics',
        isLive: false
      }
    ]
  };

  const currentArticles = newsArticles[activeSource as keyof typeof newsArticles] || [];

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
            <Button variant="default" size="sm" className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700">
              <Radio className="w-4 h-4" />
              Agency Feeds
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={onNavigateToDashboard}
            >
              <Users className="w-4 h-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={onNavigateToDrafts}
            >
              <FileText className="w-4 h-4" />
              Drafts
              <span className="ml-auto bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full">
                4
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={onNavigateToReverted}
            >
              <RotateCcw className="w-4 h-4" />
              Reverted Post
              <span className="ml-auto bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                1
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={onNavigateToHistory}
            >
              <History className="w-4 h-4" />
              History Log
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Quick Create */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Quick Create</h4>
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={onCreateNewTextArticle}
              >
                <FileText className="w-4 h-4" />
                Text Article
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={onCreateNewAudioArticle}
              >
                <Mic className="w-4 h-4" />
                Audio Post
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={onCreateNewVideoArticle}
              >
                <Video className="w-4 h-4" />
                Video Post
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Multi Window */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Multi Window</h4>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2 bg-green-50 text-green-600 hover:bg-green-100">
                <Rss className="w-4 h-4" />
                News Feeds
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={onCreateNewTextArticle}
              >
                <Plus className="w-4 h-4" />
                Create Article
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={onNavigateToReverted}
              >
                <RotateCcw className="w-4 h-4" />
                Reverted Post
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={onNavigateToDrafts}
              >
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
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <Rss className="w-4 h-4 text-green-600" />
              </div>
              <h1 className="text-lg font-medium">News Feeds</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full absolute -top-1 -right-1"></div>
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                </div>
                <span className="text-sm text-gray-600">User Reporter</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Register
                </Button>
                <Button size="sm" className="bg-gray-900 text-white">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* News Source Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex gap-4">
            {newsSources.map((source) => (
              <Button
                key={source}
                variant={activeSource === source ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSource(source)}
                className={activeSource === source ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}
              >
                {source}
              </Button>
            ))}
          </div>
        </div>

        {/* News Articles */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Featured Articles */}
              <div className="space-y-6">
                {currentArticles.slice(0, 3).map((article) => (
                  <Card key={article.id} className="overflow-hidden bg-white hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video relative">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      {article.isLive && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                          <Circle className="w-2 h-2 fill-current" />
                          LIVE
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 leading-tight mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{article.time}</span>
                        <span>•</span>
                        <span>{article.category}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Right Column - Side Articles */}
              <div className="space-y-4">
                {currentArticles.slice(3).map((article) => (
                  <Card key={article.id} className="overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-16 flex-shrink-0">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 leading-tight mb-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{article.time}</span>
                          <span>•</span>
                          <span>{article.category}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}