import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, Search, Eye, FileText, Clock } from "lucide-react";

interface Article {
  id: number;
  title: string;
  type: string;
  status: string;
  category: string;
  receivedTime: string;
  author: string;
}

export function HistoryLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Sample articles data
  const articles: Article[] = [
    {
      id: 1,
      title: "Climate Change Report: Impact...",
      type: "Text Article",
      status: "Approved",
      category: "Politics",
      receivedTime: "Aug 3, 2025, 08:39 PM",
      author: "Sarah Chen",
    },
    {
      id: 2,
      title: "Climate Change Report: Impact...",
      type: "Text Article",
      status: "Rejected",
      category: "Business",
      receivedTime: "Aug 3, 2025, 08:39 PM",
      author: "MutHu",
    },
    {
      id: 3,
      title: "Climate Change Report: Impact...",
      type: "Text Article",
      status: "In Review",
      category: "Entertainment",
      receivedTime: "Aug 3, 2025, 08:39 PM",
      author: "Hari",
    },
    {
      id: 4,
      title: "Climate Change Report: Impact...",
      type: "Text Article",
      status: "Approved",
      category: "Sports",
      receivedTime: "Aug 3, 2025, 08:39 PM",
      author: "MutHu",
    },
    {
      id: 5,
      title: "Climate Change Report: Impact...",
      type: "Text Article",
      status: "In Review",
      category: "Politics",
      receivedTime: "Aug 3, 2025, 08:39 PM",
      author: "Sarah Chen",
    },
    {
      id: 6,
      title: "Climate Change Report: Impact...",
      type: "Text Article",
      status: "Approved",
      category: "Business",
      receivedTime: "Aug 3, 2025, 08:39 PM",
      author: "Guna",
    },
    {
      id: 7,
      title: "Climate Change Report: Impact...",
      type: "Text Article",
      status: "In Review",
      category: "Sports",
      receivedTime: "Aug 3, 2025, 08:39 PM",
      author: "MutHu",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "In Review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Published":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <History className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">History Log</h1>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-6 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">
                  Total Published
                </div>
                <div className="text-2xl font-bold text-gray-900">20</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="text-sm text-green-600 mb-1">Approved</div>
                <div className="text-2xl font-bold text-green-600">10</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="text-sm text-red-600 mb-1">Rejected</div>
                <div className="text-2xl font-bold text-red-600">10</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="text-sm text-blue-600 mb-1">Scheduled</div>
                <div className="text-2xl font-bold text-blue-600">10</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  <SelectItem value="sarah">Sarah Chen</SelectItem>
                  <SelectItem value="muthu">MutHu</SelectItem>
                  <SelectItem value="nikitha">Nikitha</SelectItem>
                  <SelectItem value="guna">Guna</SelectItem>
                  <SelectItem value="hari">Hari</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Received Time
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Author
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {article.title}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{article.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={`text-xs px-2 py-1 ${getStatusColor(
                            article.status
                          )}`}
                        >
                          {article.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {article.category}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">
                            {article.receivedTime}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {article.author}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {}}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
