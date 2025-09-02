import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchFilterTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOptions: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const SearchFilterTab: React.FC<SearchFilterTabProps> = ({
  searchQuery,
  setSearchQuery,
  filterOptions,
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className="bg-white shadow-md rounded-xl px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search Drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-72 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Filters - Right Aligned */}
        <div className="flex gap-2 justify-end">
          {filterOptions.map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant="outline"
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter
                  ? "bg-[#f9faf9] border border-[#B3E6B3] text-[#006601] rounded-md shadow-sm"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md"
              }
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilterTab;
