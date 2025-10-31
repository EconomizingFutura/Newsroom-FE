import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye, FileText, Calendar, ChevronDown } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";
import {
  FILTER_OPTIONS,
  getStatusColor,
  historyEditorStats,
  TABLE_HEADERS,
} from "@/utils/HistoryUtils";
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
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string>("all");

  console.log(selectedCategory, selectedAuthor, selectedStatus, dateRange);

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

  const handleDropDownSelect = (
    value: string,
    callback: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    callback((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="min-h-screen pt-16 bg-[#F6FAF6]">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <ContentHeader text="History" iconName="History" />
          <div className="grid grid-cols-4 py-5 gap-6">
            {historyEditorStats.stats.map((item, index) => (
              <HistoryCard
                key={index}
                title={item.title}
                value={item.value}
                pillBg={item.pillBg}
                pillText={item.pillText}
              />
            ))}
          </div>
          {/* Filters */}
          <div
            style={{ boxShadow: "0px 2px 10px 0px #959DA533" }}
            className="bg-white rounded-lg border  border-gray-200 p-6 mb-6"
          >
            <div className="flex items-center w-full justify-between space-x-4">
              <div className="relative border border-history-select-border bg-[#F7FBF7] rounded-[8px] flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 "
                />
              </div>
              <div className="flex gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-40 border flex justify-between items-center bg-[#F7FBF7] border-history-select-border rounded-[8px] text-black font-semibold text-sm px-3 py-2 text-left">
                      Category
                      <ChevronDown strokeWidth={2.5} size={15} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    {FILTER_OPTIONS.CATEGORY.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onSelect={(e) => e.preventDefault()}
                        onClick={() =>
                          handleDropDownSelect(
                            option.value,
                            setSelectedCategory
                          )
                        }
                      >
                        <Checkbox
                          className="data-[state=checked]:!bg-green-500 data-[state=checked]:!border-green-500 data-[state=checked]:!text-white"
                          checked={selectedCategory.includes(option.value)}
                        />
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-40 border flex justify-between items-center bg-[#F7FBF7] border-history-select-border rounded-[8px] text-black font-semibold text-sm px-3 py-2 text-left">
                      Author
                      <ChevronDown strokeWidth={2.5} size={15} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    {FILTER_OPTIONS.AUTHOR.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onSelect={(e) => e.preventDefault()}
                        onClick={() =>
                          handleDropDownSelect(option.value, setSelectedAuthor)
                        }
                      >
                        <Checkbox
                          className="data-[state=checked]:!bg-green-500 data-[state=checked]:!border-green-500 data-[state=checked]:!text-white"
                          checked={selectedAuthor.includes(option.value)}
                        />
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-40 border flex justify-between items-center bg-[#F7FBF7] border-history-select-border rounded-[8px] text-black font-semibold text-sm px-3 py-2 text-left">
                      Status
                      <ChevronDown strokeWidth={2.5} size={15} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    {FILTER_OPTIONS.STATUS.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onSelect={(e) => e.preventDefault()}
                        onClick={() =>
                          handleDropDownSelect(option.value, setSelectedStatus)
                        }
                      >
                        <Checkbox
                          className="data-[state=checked]:!bg-green-500 data-[state=checked]:!border-green-500 data-[state=checked]:!text-white"
                          checked={selectedStatus.includes(option.value)}
                        />
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40 border flex justify-between items-center bg-[#F7FBF7] border-history-select-border rounded-[8px] text-black font-semibold text-sm px-3 py-2 text-left">
                    <SelectValue placeholder="all" />
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

          {/* Articles Table */}
          <div
            style={{ boxShadow: "0px 2px 10px 0px #959DA533" }}
            className="bg-white rounded-lg border px-3 border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto px-3">
              <table className="w-full p-2">
                <thead className=" border-b  border-gray-200">
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
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 mx-2">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {article.title}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-[#1E2939]">{article.type}</span>
                        </div>
                      </td>
                      <td className="py-4 font-semibold px-4">
                        <Badge
                          className={`px-2 py-1 ${getStatusColor(
                            article.status
                          )}`}
                        >
                          <span className="!font-semibold text-[14px]">
                            {article.status}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-[#1E2939]">
                        {article.category}
                      </td>
                      <td className="py-4 px-4 ">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} color="black" strokeWidth={2.5} />

                          <span className="text-[#1E2939]">
                            {article.receivedTime}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#1E2939]">
                        {article.author}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {}}
                          className="text-gray-600 border border-[#4F668133] h-8 w-8  hover:text-gray-900"
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
