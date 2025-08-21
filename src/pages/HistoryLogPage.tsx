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
import { Search, Eye, Download,FileText, Mic, Video, Calendar } from "lucide-react";
import { HeaderIcon } from "@/utils/HeaderIcons";
import { HistoryCard } from "@/components/ui/card";

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
      type: "Text Article",
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
      type: "Text Article",
      status: "In Review",
      reporter: "Muthul",
      category: "General",
      date: "19/01/2025",
      time: "02:15 PM",
      wordCount: 1089,
    },
    {
      id: 3,
      title: "Climate Change Report: Impact on Local Communities",
      type: "Text Article",
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
      type: "Audio Post",
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
      type: "Text Article",
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
      type: "Video Post",
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
      case "In Review":
        return "bg-blue-100 text-blue-800";
      case "Reverted":
        return "bg-red-100 text-red-800";
      case "Draft":
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

  const stats = [
    { title: "Total Posts", value: 20, pillBg: "bg-[#F2F4F6]", pillText: "text-[#4A5565]" },
    { title: "Draft", value: 10, pillBg: "bg-[#F2F4F6]", pillText: "text-gray-600" },
    { title: "Submitted", value: 10, pillBg: "bg-[#DCE9FE]", pillText: "text-[#206DFD]"},
    { title: "Approved", value: 10, pillBg: "bg-[#DBF2D9]", pillText: "text-[#008001]"},
    { title: "Reverted", value: 10, pillBg: "bg-[#FEE2E0]", pillText: "text-[#F41D28]"},
  ];
  type PostType = "Text Article" | "Audio Post" | "Video Post";
  const typeIcons: Record<PostType, JSX.Element> = {
    "Text Article": <FileText className="w-4 h-4 text-gray-700" />,
    "Audio Post": <Mic className="w-4 h-4 text-gray-700" />,
    "Video Post": <Video className="w-4 h-4 text-gray-700" />,
  };

  return (
    <div className=" flex-1 py-16 h-screen bg-gray-50">
      {/* Main Content */}
      <div style={{paddingTop: '32px'}} className=" flex flex-col gap-[24px] px-[24px] bg-[#F6FAF6]">
        {/* Top Header */}
        <div className="flex items-center gap-[8px]">
          <HeaderIcon className=" text-[#008001]" name="History" />
          <p className="font-bold text-2xl text-[#101828]">History Log</p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {stats.map((item, index) => (
            <HistoryCard
              key={index}
              title={item.title}
              value={item.value}
              pillBg={item.pillBg}
              pillText={item.pillText}
            />
          ))}
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-[24px] py-[16px] bg-white rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 justify-between">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search Articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[70%] bg-[#F6FAF6]"
                />
              </div>

              <div className="flex gap-[24px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger  className="w-40 bg-[#F6FAF6]">
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
                    <SelectTrigger className="w-40 bg-[#F6FAF6]">
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
                    <SelectTrigger className="w-40 bg-[#F6FAF6]">
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
            </div>
          </div>
        </div>

        {/* Article Table */}
        <div className="flex-1 overflow-auto bg-white rounded-2xl shadow-md">
          <div className="bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div className="col-span-3 font-bold text-sm text-gray-500">Title</div>
              <div className="col-span-2 font-bold text-sm text-gray-500">Type</div>
              <div className="col-span-2 font-bold text-sm text-gray-500">Status</div>
              <div className="col-span-2 font-bold text-sm text-gray-500">Category</div>
              <div className="col-span-2 font-bold text-sm text-gray-500">Last Updated</div>
              <div className="col-span-1 font-bold text-sm text-gray-500">Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors items-center"
                >
                  <div className="col-span-3 truncate">
                    <h3 className="text-sm font-normal text-[#1E2939] truncate">
                      {article.title}
                    </h3>
                  </div>

                  <div className="col-span-2">
                    <div className='text-xs flex gap-[8px]'>
                    {typeIcons[article.type as PostType]}
                    <span>{article.type}</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Badge
                      className={`px-[16px] py-[6px] text-xs ${getStatusColor(article.status)}`}
                    >
                      <span>{article.status}</span>
                    </Badge>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm text-gray-900">
                      {article.category}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-[8px]">
                    <Calendar className="w-4 h-4" />
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
