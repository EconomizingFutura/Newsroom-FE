import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DashboardProps {
  onEditStory: (article: any) => void;
  onNavigateToDrafts: () => void;
  onNavigateToReverted: () => void;
  onNavigateToHistory: () => void;
  onNavigateToNewsFeeds: () => void;
  onCreateNewTextArticle: () => void;
  onCreateNewAudioArticle: () => void;
  onCreateNewVideoArticle: () => void;
}

export default function Dashboard({ onEditStory }: DashboardProps) {
  // Mock data for demonstration
  const stats = {
    totalPosts: 7,
    drafts: 3,
    submitted: 1,
    approved: 10,
    needRevision: 5,
  };

  const urgentActions = [
    {
      id: 1,
      type: "Article Approved",
      title: "THE FIRST UP ON POLITICAL MESSAGE THE FIGHT AGAINST ALLEGIATION",
      status: "approved",
    },
    {
      id: 2,
      type: "Article Approved",
      title: "THE FIRST UP ON POLITICAL MESSAGE THE FIGHT AGAINST ALLEGIATION",
      status: "approved",
    },
    {
      id: 3,
      type: "Article Approved",
      title: "THE FIRST UP ON POLITICAL MESSAGE THE FIGHT AGAINST ALLEGIATION",
      status: "approved",
    },
    {
      id: 4,
      type: "Article Approved",
      title: "THE FIRST UP ON POLITICAL MESSAGE THE FIGHT AGAINST ALLEGIATION",
      status: "approved",
    },
  ];

  const userName = "Muthul";

  return (
    <div className="flex-1 h-screen bg-background">
      {/* Left Sidebar */}

      {/* Main Content */}
      <div className=" flex flex-col">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">Welcome back, {userName}!</h1>
            <p className="text-sm text-muted-foreground">
              Manage your stories and track your progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Save Draft
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Submit For Review
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalPosts}
              </div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.drafts}
              </div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {stats.submitted}
              </div>
              <div className="text-sm text-muted-foreground">Submitted</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.needRevision}
              </div>
              <div className="text-sm text-muted-foreground">Need Revision</div>
            </Card>
          </div>

          {/* Urgent Actions Required */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <h2 className="text-lg font-medium">Urgent Actions Required</h2>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {urgentActions.length}
              </span>
            </div>

            <div className="space-y-3">
              {urgentActions.map((action) => (
                <Card key={action.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {action.type}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-red-600 leading-relaxed">
                        {action.title}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => onEditStory(action)}
                    >
                      Edit Story
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
