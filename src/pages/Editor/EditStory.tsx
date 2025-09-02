import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Rss,
  Home,
  FileStack,
  BookOpen,
  Calendar,
  History,
  Search,
  Bell,
  User,
  ArrowLeft,
  Save,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image as ImageIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import profileImage from "figma:asset/9d8e6f1b93f3d79491ab7078e23a0b7edff2f354.png";

interface EditStoryProps {
  onBack: () => void;
  storyTitle: string;
}

export function EditStory({ onBack, storyTitle }: EditStoryProps) {
  const [title, setTitle] = useState(storyTitle);
  const [content, setContent] =
    useState(`The city council has voted on a new housing development project that will shape the community for decades. The comprehensive housing plan addresses growing demand and aims to provide affordable housing options for residents at various income levels.

After months of debate, the council reached a consensus on key provisions including zoning requirements and affordability guarantees. The city council unanimously voted in favor of advancing the plan with provisions for 200 affordable housing units set to be completed by the end of next year.

Community leaders hailed the consensus as a major milestone, noting key provisions including zoning requirement changes and the downtown area. The city council unanimously voted in favor of advancing the plan with provisions for 200 affordable housing units set to be completed by the end of next year.`);

  const sidebarItems = [
    { icon: Rss, label: "Agency Feeds", active: false, hasNotification: false },
    { icon: Home, label: "Dashboard", active: false, hasNotification: false },
    {
      icon: FileStack,
      label: "Review Queue",
      active: true,
      hasNotification: true,
      notificationCount: "4",
    },
    {
      icon: BookOpen,
      label: "Publish Center",
      active: false,
      hasNotification: false,
    },
    {
      icon: Calendar,
      label: "Calendar",
      active: false,
      hasNotification: false,
    },
    {
      icon: History,
      label: "History Log",
      active: false,
      hasNotification: false,
    },
  ];

  const multiWindowItems = [
    { label: "News Feeds", checked: false },
    { label: "Review Queue", checked: false },
    { label: "Publish Center", checked: false },
    { label: "Calendar", checked: false },
  ];

  const categories = [
    { name: "News", active: true },
    { name: "Politics", active: false },
    { name: "Sports", active: false },
    { name: "Entertainment", active: false },
    { name: "Technology", active: false },
  ];

  const handleSave = () => {
    console.log("Saving story:", { title, content });
    // Handle save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Government Logo and Branding */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-400 rounded-sm flex flex-col items-center justify-center">
                  <div className="text-xs font-bold text-green-800">TN</div>
                  <div className="w-6 h-0.5 bg-green-800 mt-0.5"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CHENNAI</h1>
                <p className="text-sm text-gray-600">INSTITUTE OF JOURNALISM</p>
              </div>
            </div>

            {/* Right side with search and profile */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 border-none rounded-full"
                />
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <ImageWithFallback
                  src={profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 shadow-sm h-[calc(100vh-80px)] border-r">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                  item.active
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.hasNotification && (
                  <Badge
                    className={`text-xs px-2 py-1 min-w-[20px] h-5 flex items-center justify-center ${
                      item.active
                        ? "bg-green-800 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {item.notificationCount}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Multi Window Section */}
          <div className="px-4 mt-8">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
              MULTI WINDOW
            </h4>
            <div className="space-y-3">
              {multiWindowItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={`multi-${index}`}
                    checked={item.checked}
                    className="border-gray-400"
                  />
                  <label
                    htmlFor={`multi-${index}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header Section */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Review
            </Button>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Story</h2>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Title Section */}
            <div className="p-6 border-b">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold border-gray-300"
                placeholder="Enter article title..."
              />
            </div>

            {/* Toolbar */}
            <div className="px-6 py-3 border-b bg-gray-50">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="p-2">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Underline className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <Button variant="ghost" size="sm" className="p-2">
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <AlignRight className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <Button variant="ghost" size="sm" className="p-2">
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <ListOrdered className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <Button variant="ghost" size="sm" className="p-2">
                  <Link className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content Editor */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Content
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] border-gray-300 text-base leading-relaxed"
                placeholder="Write your article content here..."
              />
            </div>

            {/* Categories Section */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant={category.active ? "default" : "outline"}
                    className={`px-3 py-1 cursor-pointer transition-colors ${
                      category.active
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Last saved: Never</div>
                <div className="flex space-x-3">
                  <Button variant="outline">Save as Draft</Button>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Update Story
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
