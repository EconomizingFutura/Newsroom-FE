import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  X,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
} from "lucide-react";

interface NotificationsProps {
  onBack: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: string;
  isRead: boolean;
  category: string;
}

export function Notifications({ onBack }: NotificationsProps) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Article Submitted",
      message:
        'A new article "Climate Change Impact Report" has been submitted for review by Sarah Chen.',
      type: "info",
      time: "2 minutes ago",
      isRead: false,
      category: "Review",
    },
    {
      id: 2,
      title: "Article Approved",
      message:
        'Your article "Local Business Recovery" has been approved and is ready for publishing.',
      type: "success",
      time: "15 minutes ago",
      isRead: false,
      category: "Approval",
    },
    {
      id: 3,
      title: "Deadline Approaching",
      message:
        'The deadline for "Environmental Report" is approaching in 2 hours.',
      type: "warning",
      time: "1 hour ago",
      isRead: true,
      category: "Deadline",
    },
    {
      id: 4,
      title: "System Maintenance",
      message:
        "Scheduled system maintenance will occur tonight at 2:00 AM. Expected downtime: 30 minutes.",
      type: "info",
      time: "2 hours ago",
      isRead: false,
      category: "System",
    },
    {
      id: 5,
      title: "Article Rejected",
      message:
        'The article "Sports Update" has been rejected. Please review the feedback and resubmit.',
      type: "error",
      time: "3 hours ago",
      isRead: true,
      category: "Rejection",
    },
    {
      id: 6,
      title: "New Comment",
      message:
        'Editor Mike Rodriguez has left a comment on your article "Technology Trends".',
      type: "info",
      time: "4 hours ago",
      isRead: true,
      category: "Comment",
    },
    {
      id: 7,
      title: "Publishing Scheduled",
      message:
        'Your article "Business Quarter Review" has been scheduled for publication tomorrow at 8:00 AM.',
      type: "success",
      time: "5 hours ago",
      isRead: false,
      category: "Publishing",
    },
    {
      id: 8,
      title: "Meeting Reminder",
      message:
        "Weekly editorial meeting starts in 30 minutes in Conference Room A.",
      type: "warning",
      time: "6 hours ago",
      isRead: true,
      category: "Meeting",
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return "bg-gray-50";

    switch (type) {
      case "success":
        return "bg-green-50 border-l-4 border-l-green-500";
      case "warning":
        return "bg-yellow-50 border-l-4 border-l-yellow-500";
      case "error":
        return "bg-red-50 border-l-4 border-l-red-500";
      default:
        return "bg-blue-50 border-l-4 border-l-blue-500";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.isRead) ||
      (filter === "read" && notification.isRead);

    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Bell className="w-6 h-6 text-green-600" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-100 text-red-800 text-sm">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">
                  Stay updated with the latest activities and alerts.
                </p>
              </div>
              <Button
                onClick={markAllAsRead}
                variant="outline"
                disabled={unreadCount === 0}
              >
                Mark All as Read
              </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Try adjusting your search criteria."
                    : "You're all caught up!"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg border border-gray-200 p-6 transition-all hover:shadow-sm ${getNotificationBgColor(
                    notification.type,
                    notification.isRead
                  )}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              notification.isRead
                                ? "text-gray-700"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p
                            className={`mt-1 text-sm ${
                              notification.isRead
                                ? "text-gray-500"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.message}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {notification.category}
                          </Badge>
                        </div>

                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
