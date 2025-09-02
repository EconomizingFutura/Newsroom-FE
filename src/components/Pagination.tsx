import React from "react";
import ReactPaginate from "react-paginate";
import PaginationFilter from "@/components/PaginationFilter";
interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: { selected: number }) => void;
  setCurrentPage: (page: number) => void;
  setSortConfig: (value: string) => void;
  disabled?: boolean;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageCount,
  onPageChange,
  setCurrentPage,
  setSortConfig,
  disabled,
}) => {
  return (
    <div
      className={`h-8 w-[calc(90vw-180px)] mx-auto justify-end gap-4 flex items-center ${
        disabled ? "opacity-0 pointer-events-none" : ""
      }`}
    >
      <PaginationFilter onClick={setSortConfig} />
      <div className="pagination-container h-8 flex items-center gap-2">
        <button
          className="pagination-prev h-8 w-8 hover:border-[#03101F] border border-[#ECECEC] rounded-md px-2"
          onClick={() => {
            if (currentPage > 1) setCurrentPage(currentPage - 1);
          }}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <span className="current-page-info border h-8 w-12 flex justify-center items-center border-[#ECECEC] rounded-md px-2 font-circular-500 font-medium leading-[17.5px] text-sm">
          {currentPage}/{pageCount}
        </span>

        <ReactPaginate
          breakLabel=""
          nextLabel={null}
          onPageChange={onPageChange}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel={null}
          containerClassName="pagination hidden"
          activeClassName="pagination-active"
        />

        <button
          className="pagination-next h-8 w-8 hover:border-[#03101F] border border-[#ECECEC] rounded-md px-2"
          onClick={() => {
            if (currentPage < pageCount) setCurrentPage(currentPage + 1);
          }}
          disabled={currentPage === pageCount}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
