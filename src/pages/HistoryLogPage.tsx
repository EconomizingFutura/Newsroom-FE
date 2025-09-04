import React, { useState, type JSX, useEffect } from "react";
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
import { Search, Eye, FileText, Mic, Video, Calendar } from "lucide-react";
import { HeaderIcon } from "@/utils/HeaderIcons";
import { HistoryCard } from "@/components/ui/card";
import { HISTORY_STATUS } from "@/utils/draftUtils";
import { useNavigate } from "react-router";
import { returnType } from "@/utils/utils";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import { API_LIST } from "@/api/endpoints";
import { GET } from "@/api/apiMethods";
import moment from "moment";

const HistoryLogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Type");
  const [dateRange, setDateRange] = useState("Date Range");
  const navigate = useNavigate();

  const handlePageSize = (val: string) => {
    const size = val.split(" ")[0];
    console.log(size, val);
    setPageSize(Number(size));
  };
  const [historyArticles, setHistoryArticles] = useState([]);
  const statusOptions = [
    "All Status",
    "Approved",
    "Submitted",
    "Reverted",
    "Draft",
  ];
  const typeOptions = ["All Type", "Text", "Audio", "Video"];

  const filteredArticles = historyArticles?.filter((article: any) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || article.status === statusFilter;
    const matchesType =
      typeFilter === "All Type" || article.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const {
    pageCount,
    currentPage,
    setPageSize,
    setCurrentPage,
    handlePageChange,
    pageSize,
  } = usePagination({
    initialPage: 1,
    totalPages: filteredArticles.length,
    initialPageSize: 10,
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const initialStats = [
    {
      title: "Total Posts",
      value: 0,
      pillBg: "bg-[#F2F4F6]",
      pillText: "text-[#4A5565]",
    },
    {
      title: "Draft",
      value: 0,
      pillBg: "bg-[#F2F4F6]",
      pillText: "text-gray-600",
    },
    {
      title: "Submitted",
      value: 0,
      pillBg: "bg-[#DCE9FE]",
      pillText: "text-[#206DFD]",
    },
    {
      title: "Approved",
      value: 0,
      pillBg: "bg-[#DBF2D9]",
      pillText: "text-[#008001]",
    },
    {
      title: "Reverted",
      value: 0,
      pillBg: "bg-[#FEE2E0]",
      pillText: "text-[#F41D28]",
    },
  ];
  type PostType = "text" | "audio" | "video";
  const typeIcons: Record<PostType, JSX.Element> = {
    text: <FileText className="w-5 h-5 text-gray-700" />,
    audio: <Mic className="w-5 h-5 text-gray-700" />,
    video: <Video className="w-5 h-5 text-gray-700" />,
  };

  const handleEdit = (id: string) => {
    const articleType =
      paginatedArticles.find((article: any) => article.id === id)?.type ||
      "Text";
    const route = returnType(articleType);
    navigate(`/${route}/${id}?from=history`);
  };

  const [stats, setStats] = useState(initialStats);
  useEffect(() => {
    const getStatsData = async () => {
      try {
        const response: any = await GET(API_LIST.BASE_URL + API_LIST.STATS);
        const updatedStats = stats.map((item) => {
          let key = item.title.toUpperCase();
          return {
            ...item,
            value: response[key] ?? 0,
          };
        });
        setStats(updatedStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const getHistoryList = async () => {
      try {
        const response: any = await GET(API_LIST.BASE_URL + API_LIST.HISTORY);
        setHistoryArticles(response.data ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getHistoryList();
    getStatsData();
  }, []);

  function getArticleType(article: any): "text" | "audio" | "video" {
    if (article.content && article.content !== "") {
      return "text";
    }
    if (article.audioUrl && article.audioUrl.trim() !== "") {
      return "audio";
    }
    if (article.videoUrl && article.videoUrl.trim() !== "") {
      return "video";
    }
    return "text"; // default fallback
  }

  return (
    <div className=" flex-1 py-16 h-screen bg-gray-50">
      {/* Main Content */}
      <div
        style={{ paddingTop: "32px" }}
        className=" flex flex-col gap-[24px] p-[24px] bg-[#F6FAF6]"
      >
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
        <div className="border-b border-gray-200 px-[24px] py-[16px] bg-white rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 justify-between">
              <div className="relative max-w-96 w-full border border-[#ECECEC] bg-[#F7FBF7] rounded-[8px]">
                <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search Articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full bg-[#F6FAF6]"
                />
              </div>

              <div className="flex gap-[24px]">
                <div className="border border-[#ECECEC] bg-[#F7FBF7] rounded-[8px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 font-semibold bg-[#F6FAF6] ![&>svg]:text-black text-black">
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
                </div>
                <div className="border border-[#ECECEC] bg-[#F7FBF7] rounded-[8px]">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40 font-semibold bg-[#F6FAF6] ![&>svg]:text-black text-black">
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
                </div>
                <div className="border border-[#ECECEC] bg-[#F7FBF7] rounded-[8px]">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-40 font-semibold bg-[#F6FAF6] ![&>svg]:text-black text-black">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Date Range">Date Range</SelectItem>
                      <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                      <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                      <SelectItem value="Last 3 months">
                        Last 3 months
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 overflow-auto bg-white rounded-2xl shadow-md">
          <div className="bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div className="col-span-4 font-bold text-sm text-gray-500">
                Title
              </div>
              <div className="col-span-2 font-bold text-sm text-gray-500">
                Type
              </div>
              <div className="col-span-2 font-bold text-sm text-gray-500">
                Status
              </div>
              <div className="col-span-1 font-bold text-sm text-gray-500">
                Category
              </div>
              <div className="col-span-2 font-bold text-sm text-gray-500">
                Last Updated
              </div>
              <div className="col-span-1 font-bold text-sm text-gray-500">
                Action
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {paginatedArticles.length > 0 ? (
                paginatedArticles.map((article: any) => (
                  <div
                    key={article.id}
                    className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors items-center"
                  >
                    <div className="col-span-4 truncate">
                      <h3 className="text-sm font-normal text-[14px] text-[#1E2939] truncate">
                        {article.title}
                      </h3>
                    </div>

                    <div className="col-span-2">
                      <div className="text-[14px] flex items-center gap-[8px]">
                        {typeIcons[getArticleType(article) as PostType]}
                        <span>{getArticleType(article)}</span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <Badge
                        className={`px-[16px] font-semibold py-[6px] text-[14px] ${HISTORY_STATUS(
                          article.status
                        )}`}
                      >
                        <span>{article.status}</span>
                      </Badge>
                    </div>

                    <div className="col-span-1">
                      <div className="text-[14px] text-gray-900">
                        {article.category}
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-[8px]">
                      <Calendar className="w-4 h-4" />
                      <div className="text-[14px] text-gray-900">
                        {moment(article.updatedAt).format(
                          "DD MMM YYYY hh:mm A"
                        )}
                      </div>
                    </div>

                    <div className="col-span-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleEdit(article.id)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 text-[14px]">
                  No log available
                </div>
              )}
            </div>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          setCurrentPage={setCurrentPage}
          setSortConfig={handlePageSize}
        />
      </div>
    </div>
  );
};

export default HistoryLogPage;
