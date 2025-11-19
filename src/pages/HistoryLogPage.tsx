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
import {
  Search,
  Eye,
  FileText,
  Mic,
  Video,
  Calendar,
  PencilLine,
} from "lucide-react";
import { HeaderIcon } from "@/utils/HeaderIcons";
import { HistoryCard } from "@/components/ui/card";
import { HISTORY_STATUS } from "@/utils/draftUtils";
import { useNavigate } from "react-router";
import { returnType } from "@/utils/utils";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import { API_LIST } from "@/api/endpoints";
import { GET, POST } from "@/api/apiMethods";
import moment from "moment";
import type { RevertedArticleTypes } from "@/types/draftPageTypes";
import Loading from "./Shared/agency-feeds/loading";

const HistoryLogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Type");
  const [dateRange, setDateRange] = useState("All");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [pageMetaData, setPageMetaData] = useState<{
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>({
    total: 11,
    page: 1,
    pageSize: 10,
    totalPages: 2,
    hasNextPage: true,
    hasPrevPage: false,
  });
  const handlePageSize = (val: string) => {
    const size = val.split(" ")[0];
    setPageSize(Number(size));
    setCurrentPage(1);
  };
  const [historyArticles, setHistoryArticles] = useState<
    RevertedArticleTypes[]
  >([]);
  const statusOptions = [
    "All Status",
    "APPROVED",
    "DRAFT",
    "REVERTED",
    "SUBMITTED",
  ];
  const typeOptions = ["All Type", "TEXT", "AUDIO", "VIDEO"];

  const {
    currentPage,
    setPageSize,
    setCurrentPage,
    handlePageChange,
    pageSize,
  } = usePagination({
    initialPage: 1,
    totalPages: pageMetaData.totalPages,
    initialPageSize: 10,
  });

  const initialStats = [
    {
      title: "Total",
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

  const handleEdit = (id: string, status: string) => {
    const articleType =
      historyArticles.find((article: any) => article.id === id)?.type || "Text";
    const route = returnType(articleType);
    const isPreviewAllowed = status === "DRAFT";
    navigate(`/${route}/${id}?from=history`, {
      state: !isPreviewAllowed,
    });
    // navigate(`/${route}/${id}?from=history`, { state: { name: "harish" } });
  };

  const [stats, setStats] = useState(initialStats);
  useEffect(() => {
    const getStatsData = async () => {
      try {
        const response: any = await GET(API_LIST.BASE_URL + API_LIST.STATS);
        const updatedStats = stats.map((item) => {
          let key = item.title.toUpperCase();
          let tempValue =
            key === "APPROVED" ? response["REVIEWED"] : response[key] ?? 0;
          return {
            ...item,
            value: tempValue,
          };
        });
        setStats(updatedStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getStatsData();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getHistoryList();
    return () => controller.abort();
  }, [currentPage, pageSize, statusFilter, typeFilter, dateRange, searchQuery]);

  const getHistoryList = async () => {
    try {
      setLoading(true);

      // 🧩 Build body payload instead of query string
      const payload: any = {
        page: currentPage,
        pageSize,
      };

      if (statusFilter !== "All Status") {
        payload.status =
          statusFilter === "APPROVED" ? "REVIEWED" : statusFilter;
      }

      if (typeFilter !== "All Type") {
        payload.type = typeFilter;
      }

      if (dateRange !== "All") {
        payload.dateRange = dateRange; // 'today' | 'week' | 'month' etc.
      }

      if (searchQuery.trim()) {
        payload.search = searchQuery.trim();
      }

      // 🟢 POST request instead of GET
      const response: any = await POST(
        `${API_LIST.BASE_URL}${API_LIST.HISTORY}`,
        payload
      );

      // 🧭 Update state
      setHistoryArticles(response.articles ?? []);
      setPageMetaData(response.pagination);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching history:", error);
      }
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen flex flex-col pt-16 bg-[#F6FAF6]">
      <main className="flex-1 p-8 flex flex-col">
        <>
          {/* Header */}
          <div className="flex items-center gap-2">
            <HeaderIcon className="text-[#008001]" name="History" />
            <p className="font-bold text-2xl text-[#101828]">History Log</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-5 py-5 gap-6">
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

          {/* Sticky Toolbar */}
          <section className="sticky top-16 bg-[#F6FAF6] z-10">
            <div
              style={{ boxShadow: "0px 2px 10px 0px #959DA533" }}
              className="bg-white rounded-lg border border-gray-200 p-6 mb-2"
            >
              <div className="flex items-center justify-between space-x-4">
                {/* Search */}
                <div className="relative max-w-96 w-full border border-[#ECECEC] bg-[#F7FBF7] rounded-[8px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search Articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full bg-[#F6FAF6]"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                  {/* Status */}
                  <div className="border border-[#ECECEC] bg-[#F7FBF7] rounded-[8px]">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
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

                  {/* Type */}
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

                  {/* Date Range */}
                  <div className="border border-[#ECECEC] bg-[#F7FBF7] rounded-[8px]">
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-40 font-semibold bg-[#F6FAF6] ![&>svg]:text-black text-black">
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Date Range</SelectItem>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Table Section */}
          {loading ? (
            <Loading />
          ) : (
            <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
              <div
                style={{ boxShadow: "0px 2px 10px 0px #959DA533" }}
                className="bg-white rounded-lg border w-full px-3 border-gray-200 overflow-hidden"
              >
                <div className="overflow-x-auto px-3">
                  <table className="w-full py-2 px-1">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-bold text-[14px] text-[#999999] whitespace-nowrap">
                          Title
                        </th>
                        <th className="text-left py-3 px-4 font-bold text-[14px] text-[#999999] whitespace-nowrap">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-bold text-[14px] text-[#999999] whitespace-nowrap">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-bold text-[14px] text-[#999999] whitespace-nowrap">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 font-bold text-[14px] text-[#999999] whitespace-nowrap">
                          Last Updated
                        </th>
                        <th className="text-left py-3 px-4 font-bold text-[14px] text-[#999999] whitespace-nowrap">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {historyArticles.length > 0 ? (
                        historyArticles.map((article: any) => (
                          <tr
                            key={article.id}
                            onClick={() =>
                              handleEdit(article.id, article.status)
                            }
                            className="hover:bg-gray-50 cursor-pointer"
                          >
                            <td className="py-4 px-8 max-w-[280px] whitespace-nowrap">
                              <div
                                className="font-medium text-[#1E2939] truncate"
                                title={article.title}
                              >
                                {article.title}
                              </div>
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {typeIcons[getArticleType(article) as PostType]}
                                <span className="capitalize text-[#1E2939]">
                                  {getArticleType(article)}{" "}
                                  {getArticleType(article) === "text"
                                    ? "Article"
                                    : "Post"}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              <Badge
                                className={`px-[16px] font-medium py-[4px] !text-[14px] ${HISTORY_STATUS(
                                  article.status
                                )}`}
                              >
                                {article.status === "REVIEWED"
                                  ? "APPROVED"
                                  : article.status}
                              </Badge>
                            </td>

                            <td className="py-4 px-4 text-[#1E2939] whitespace-nowrap">
                              {article.category}
                            </td>

                            <td className="py-4 px-4 text-[#1E2939] whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} color="#4B5563" />
                                <span>
                                  {moment(article.updatedAt).format(
                                    "DD MMM YYYY hh:mm A"
                                  )}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 space-x-2 px-4 whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 border border-[#4F668133] h-8 w-8 hover:text-gray-900"
                                onClick={() =>
                                  handleEdit(article.id, article.status)
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {article.status == "DRAFT" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-600 border border-[#4F668133] h-8 w-8 hover:text-gray-900"
                                  onClick={() =>
                                    handleEdit(article.id, article.status)
                                  }
                                >
                                  <PencilLine className="w-4 h-4" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-8 text-center text-gray-500 text-sm"
                          >
                            No log available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      </main>

      {/* Sticky Pagination */}
      {pageMetaData.totalPages >= 1 && (
        <div className="sticky bottom-0 bg-gray-50 border-t py-5 z-20">
          <div className="ms-16">
            <Pagination
              currentPage={pageMetaData.page}
              pageCount={pageMetaData.totalPages}
              onPageChange={handlePageChange}
              setCurrentPage={setCurrentPage}
              setSortConfig={handlePageSize}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryLogPage;
