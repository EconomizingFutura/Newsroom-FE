import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Download } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";

interface HistoryLogPageProps {
  onViewArticle: (article: any) => void;
}

export default function HistoryLogPage({ onViewArticle }: HistoryLogPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Type");
  const [dateRange, setDateRange] = useState("Date Range");

  // Mock history data
  const historyArticles = [
    {
      id: 1,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Approved",
      reporter: "Muthul",
      category: "General",
      date: "20/01/2025",
      time: "10:30 AM",
      wordCount: 1247,
    },
    {
      id: 2,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Submitted",
      reporter: "Muthul",
      category: "General",
      date: "19/01/2025",
      time: "02:15 PM",
      wordCount: 1089,
    },
    {
      id: 3,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Reverted",
      reporter: "Muthul",
      category: "General",
      date: "18/01/2025",
      time: "04:45 PM",
      wordCount: 956,
    },
    {
      id: 4,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Approved",
      reporter: "Muthul",
      category: "General",
      date: "17/01/2025",
      time: "11:20 AM",
      wordCount: 1156,
    },
    {
      id: 5,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Draft",
      reporter: "Muthul",
      category: "General",
      date: "16/01/2025",
      time: "03:30 PM",
      wordCount: 834,
    },
    {
      id: 6,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text",
      status: "Reverted",
      reporter: "Muthul",
      category: "General",
      date: "15/01/2025",
      time: "09:15 AM",
      wordCount: 1203,
    },
  ];

  const statusOptions = [
    "All Status",
    "Approved",
    "Submitted",
    "Reverted",
    "Draft",
  ];
  const typeOptions = ["All Type", "Text", "Audio", "Video"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Reverted":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Text":
        return "bg-blue-100 text-blue-800";
      case "Audio":
        return "bg-purple-100 text-purple-800";
      case "Video":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredArticles = historyArticles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || article.status === statusFilter;
    const matchesType =
      typeFilter === "All Type" || article.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className=" flex-1 py-16 h-screen bg-gray-50">
      {/* Main Content */}
      <div className=" flex flex-col">
        {/* Top Header */}
        <ContentHeader text="History Log" iconName="History" />
        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search Articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Date Range">Date Range</SelectItem>
                  <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                  <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                  <SelectItem value="Last 3 months">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Article Table */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div className="col-span-4">Article Title</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Reporter</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {article.title}
                    </h3>
                    <div className="text-xs text-gray-500">
                      {article.wordCount} words • {article.time}
                    </div>
                  </div>

                  <div className="col-span-1">
                    <Badge className={`text-xs ${getTypeColor(article.type)}`}>
                      {article.type}
                    </Badge>
                  </div>

                  <div className="col-span-1">
                    <Badge
                      className={`text-xs ${getStatusColor(article.status)}`}
                    >
                      {article.status}
                    </Badge>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm text-gray-900">
                      {article.reporter}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm text-gray-900">
                      {article.category}
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="text-sm text-gray-900">{article.date}</div>
                  </div>

                  <div className="col-span-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => onViewArticle(article)}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
