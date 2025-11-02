import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye, FileText, Calendar, ChevronDown } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";
import { FILTER_OPTIONS, TABLE_HEADERS } from "@/utils/HistoryUtils";
import { HistoryCard } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import Loading from "../Shared/agency-feeds/loading";
import { GET } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import {
  historyStatus,
  type AuthorResponse,
  type HistoryContentResponse,
  type HistoryResponse,
  type HistoryStatus,
} from "@/types/apitypes";
import {
  formatDateForInput,
  transformHistoryStats,
  type HistoryTstatus,
} from "@/utils/utils";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { useDebounce } from "@/hooks/useDebounce";

export function HistoryLog() {
  const [filters, setFilters] = useState({
    search: "",
    categories: [] as string[],
    authors: [] as string[],
    statuses: [] as string[],
    dateRange: "all",
  });
  const navigate = useNavigate();
  const [authors, setAuthors] = useState<AuthorResponse[] | []>([]);

  const [stats, setStats] = useState<HistoryTstatus[] | []>([]);
  const [historyArticles, setHistoryArticles] = useState<
    HistoryContentResponse[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [pageMetaData, setPageMetaData] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const {
    currentPage,
    setPageSize,
    setCurrentPage,
    handlePageChange,
    pageSize,
  } = usePagination({
    initialPage: 1,
    totalPages: pageMetaData.totalPages ?? 1,
    initialPageSize: pageMetaData.pageSize ?? 10,
  });
  const debouncedSearch = useDebounce(filters.search, 600);

  console.log("⌨️ filters.search:", filters.search);
console.log("🕓 debouncedSearch:", debouncedSearch);


  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const response: HistoryStatus = await GET(
          API_LIST.BASE_URL + "articles/editor-history-stats"
        );
        if (cancelled) return;
        const tres = transformHistoryStats(response);
        setStats(tres);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    const fetchAuthor = async () => {
      try {
        const response: AuthorResponse[] = await GET(
          API_LIST.BASE_URL + API_LIST.AUTHOR_LIST
        );
        if (cancelled) return;
        // const ALL = {
        //   id: "all",
        //   username: "All Authors",
        //   email: "all",
        // };
        const data = [...response];
        console.log(data);
        setAuthors(response);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
    fetchAuthor();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewStory = (id: string) => {
    const article = historyArticles.find((a) => a.id == id);
    const isEditable = article?.status === "SUBMITTED";
    console.log(isEditable);

    navigate(`/editor/viewcontent/${id}?from=editor-history`, {
      state: { articletype: article?.type, editable: isEditable },
    });
  };



  useEffect(() => {
  const controller = new AbortController();

  const getHistoryList = async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      // ✅ use filters normally, but for search use debouncedSearch
      if (filters.statuses.length > 0) {
        queryParams.append("status", filters.statuses.join(","));
      }
      if (filters.categories.length > 0) {
        queryParams.append("category", filters.categories.join(","));
      }
      if (filters.authors.length > 0) {
        queryParams.append("authorId", filters.authors.join(","));
      }
      if (filters.dateRange !== "all") {
        queryParams.append("dateRange", filters.dateRange);
      }
      if (debouncedSearch.trim() !== "") {
        queryParams.append("search", debouncedSearch.trim());
      }

      const url = `${API_LIST.BASE_URL}${API_LIST.HISTORY}?${queryParams.toString()}`;
      console.log("📡 API triggered with search:", debouncedSearch);
      const response: HistoryResponse = await GET(url, { signal });

      setHistoryArticles(response.articles ?? []);
      setPageMetaData(
        response.pagination ?? {
          total: 0,
          page: currentPage,
          pageSize,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      );
    } catch (err) {
      if ((err as AxiosError).name !== "AbortError") {
        console.error("Error fetching history:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  getHistoryList(controller.signal);

  return () => controller.abort();
}, [
  debouncedSearch,            // ✅ only triggers when debounce completes
  filters.statuses,
  filters.categories,
  filters.authors,
  filters.dateRange,
  currentPage,
  pageSize,
]);

  const handleDropDownToggle = (
    value: string,
    key: "categories" | "authors" | "statuses"
  ) => {
    let allOptions: string[] = [];

    if (key === "statuses") {
      allOptions = FILTER_OPTIONS.STATUS.map((s) => s.value);
    } else if (key === "categories") {
      allOptions = FILTER_OPTIONS.CATEGORY.map((c) => c.value);
    } else if (key === "authors") {
      allOptions = authors.map((a) => a.id);
    }

    setFilters((prev) => {
      const arr = prev[key];

      if (value === "all") {
        const allSelected = arr.length === allOptions.length;
        return {
          ...prev,
          [key]: allSelected ? [] : [...allOptions],
        };
      }

      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];

      const allSelected = next.length === allOptions.length;

      return {
        ...prev,
        [key]: allSelected ? [...allOptions] : next,
      };
    });
  };

  const paginatedArticles = historyArticles;

  const totalPages = pageMetaData?.totalPages >= 1;

  console.log(totalPages);

  const isEmpty = !loading && paginatedArticles.length === 0;

const PAGINATION = useMemo(() => {
  if (!loading && totalPages) {
    return (
      <div className="sticky bottom-0 bg-gray-50 border-t py-5 z-20">
        <Pagination
          currentPage={currentPage}
          pageCount={pageMetaData.totalPages}
          onPageChange={(p) => {
            handlePageChange(p);
            setCurrentPage(p.selected);
          }}
          setCurrentPage={setCurrentPage}
          setSortConfig={(val) => {
            const size = Number(val.split(" ")[0]);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    );
  }
  return null;
}, [
  totalPages,
  currentPage,
  pageMetaData.totalPages,
]);



  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[#F6FAF6]">
      <main className="flex-1 p-8 flex flex-col">
        <>
          <ContentHeader text="History" iconName="History" />

          <div className="grid grid-cols-4 py-5 gap-6">
            {stats?.map((item, index) => (
              <HistoryCard
                key={index}
                title={item.title}
                value={item.value}
                pillBg={item.pillBg}
                pillText={item.pillText}
              />
            ))}
          </div>

          <section className="sticky top-16 bg-[#F6FAF6] z-10">
            <div
              style={{ boxShadow: "0px 2px 10px 0px #959DA533" }}
              className="bg-white rounded-lg border border-gray-200 p-6 mb-2"
            >
              <div className="flex items-center w-full justify-between space-x-4">
                <div className="relative max-w-96 w-full border border-[#ECECEC] bg-[#F7FBF7] rounded-[8px]">
                  <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search Articles..."
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="pl-9 w-full bg-[#F6FAF6]"
                  />
                </div>

                <div className="flex gap-4 ">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-40 border flex justify-between items-center bg-[#F7FBF7] border-history-select-border text-[#1E2939] font-semibold text-sm px-3 py-2 rounded-[8px]">
                        Category <ChevronDown strokeWidth={2.5} size={15} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      {FILTER_OPTIONS.CATEGORY.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onSelect={(e) => e.preventDefault()}
                          onClick={() =>
                            handleDropDownToggle(option.value, "categories")
                          }
                        >
                          <Checkbox
                            className="data-[state=checked]:!bg-green-500 data-[state=checked]:!border-green-500"
                            checked={filters.categories.includes(option.value)}
                          />
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-40 border flex justify-between items-center bg-[#F7FBF7] border-history-select-border text-[#1E2939] font-semibold text-sm px-3 py-2 rounded-[8px]">
                        Author <ChevronDown strokeWidth={2.5} size={15} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      {authors?.map((option) => (
                        <DropdownMenuItem
                          key={option.id}
                          onSelect={(e) => e.preventDefault()}
                          onClick={() =>
                            handleDropDownToggle(option.id, "authors")
                          }
                        >
                          <Checkbox
                            className="data-[state=checked]:!bg-green-500 data-[state=checked]:!border-green-500"
                            checked={filters.authors.includes(option.id)}
                          />
                          {option.username}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-40 border flex justify-between items-center bg-[#F7FBF7] border-history-select-border text-[#1E2939] font-semibold text-sm px-3 py-2 rounded-[8px]">
                        Status <ChevronDown strokeWidth={2.5} size={15} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      {FILTER_OPTIONS.STATUS.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onSelect={(e) => e.preventDefault()}
                          onClick={() =>
                            handleDropDownToggle(option.value, "statuses")
                          }
                        >
                          <Checkbox
                            className="data-[state=checked]:!bg-green-500 data-[state=checked]:!border-green-500"
                            checked={filters.statuses.includes(option.value)}
                          />
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Select
                    value={filters.dateRange}
                    onValueChange={(val) => updateFilter("dateRange", val)}
                  >
                    <SelectTrigger className="w-40 border bg-[#F7FBF7] border-history-select-border rounded-[8px] text-[#1E2939] font-semibold text-sm px-3 py-2">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {FILTER_OPTIONS.DATE_RANGE.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>
          {loading ? (
            <Loading />
          ) : (
            <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
              <div
                style={{ boxShadow: "0px 2px 10px 0px #959DA533" }}
                className="bg-white rounded-lg border px-3 border-gray-200 overflow-hidden"
              >
                <div className="overflow-x-auto px-3">
                  <table className="w-full p-2">
                    <thead className="border-b border-gray-200">
                      <tr>
                        {Object.values(TABLE_HEADERS).map((header) => (
                          <th
                            key={header}
                            className="text-left py-3 px-4 font-bold text-[14px] text-[#999999]"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 mx-2">
                      {paginatedArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50 mx-2">
                          <td className="py-4 px-4 max-w-[250px]">
                            {" "}
                            <div
                              className="font-medium text-[#1E2939] truncate"
                              title={article.title}
                            >
                              {article.title}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-[#1E2939]">
                                {article.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-4  px-4">
                            <Badge
                              className={`px-2 py-1 ${historyStatus(
                                article.status
                              )}`}
                            >
                              <span className=" text-[14px]">
                                {article.status}
                              </span>
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-[#1E2939]">
                            {article.category}
                          </td>
                          <td className="py-4 px-4 max-w-[200px]">
                            <div className="flex items-center gap-2 truncate">
                              <Calendar
                                size={16}
                                color="#4B5563"
                                strokeWidth={2}
                              />
                              <span
                                className="text-[#1E2939] text-sm truncate"
                                title={formatDateForInput(article.createdAt)}
                              >
                                {article.createdAt
                                  ? formatDateForInput(article.createdAt)
                                  : "—"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-[#1E2939]">
                            {article.reporter.username}
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 border border-[#4F668133] h-8 w-8 hover:text-gray-900"
                              onClick={() => handleViewStory(article.id.toString())}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {isEmpty && (
                        <tr>
                          <td
                            colSpan={Object.keys(TABLE_HEADERS).length}
                            className="py-8 text-center text-gray-500"
                          >
                            No history articles found.
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
      { PAGINATION }


      {/* {!loading && totalPages && (
        <div className="sticky bottom-0 bg-gray-50 border-t py-5 z-20">
          <Pagination
            currentPage={currentPage}
            pageCount={pageMetaData.totalPages}
            onPageChange={(p) => {
              handlePageChange(p);
              setCurrentPage(p.selected);
            }}
            setCurrentPage={setCurrentPage}
            setSortConfig={(val) => {
              const size = Number(val.split(" ")[0]);
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      )} */}
    </div>
  );
}
