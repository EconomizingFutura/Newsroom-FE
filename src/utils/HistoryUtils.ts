export const historyStats = Object.freeze({
  stats: [
    {
      title: "Total Posts",
      value: 20,
      pillBg: "bg-[#F2F4F6]",
      pillText: "text-[#4A5565]",
    },
    {
      title: "Draft",
      value: 10,
      pillBg: "bg-[#F2F4F6]",
      pillText: "text-gray-600",
    },
    {
      title: "Submitted",
      value: 10,
      pillBg: "bg-[#DCE9FE]",
      pillText: "text-[#206DFD]",
    },
    {
      title: "Approved",
      value: 10,
      pillBg: "bg-[#DBF2D9]",
      pillText: "text-[#008001]",
    },
    {
      title: "Reverted",
      value: 10,
      pillBg: "bg-[#FEE2E0]",
      pillText: "text-[#F41D28]",
    },
  ],
});

export const historyEditorStats = Object.freeze({
  stats: [
    {
      title: "Total Published",
      value: 20,
      pillBg: "bg-[#F2F4F6]",
      pillText: "text-[#4A5565]",
    },

    {
      title: "Approved",
      value: 10,
      pillBg: "bg-[#DBF2D9]",
      pillText: "text-[#008001]",
    },
    {
      title: "Reverted",
      value: 10,
      pillBg: "bg-[#FEE2E0]",
      pillText: "text-[#F41D28]",
    },
    {
      title: "Scheduled",
      value: 10,
      pillBg: "bg-[#F2F4F6]",
      pillText: "text-[#4A5565]",
    },
  ],
});

export const TABLE_HEADERS = Object.freeze({
  TITLE: "Title",
  TYPE: "Type",
  STATUS: "Status",
  CATEGORY: "Category",
  RECEIVED_TIME: "Received Time",
  AUTHOR: "Author",
  ACTION: "Action",
});

export const getStatusColor = (status: string) => {
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

export const FILTER_OPTIONS = Object.freeze({
  CATEGORY: [
    { value: "all", label: "All Categories" },
    { value: "politics", label: "Politics" },
    { value: "business", label: "Business" },
    { value: "entertainment", label: "Entertainment" },
    { value: "sports", label: "Sports" },
    { value: "environment", label: "Environment" },
  ],
  AUTHOR: [
    { value: "all", label: "All Authors" },
    { value: "sarah", label: "Sarah Chen" },
    { value: "muthu", label: "MutHu" },
    { value: "nikitha", label: "Nikitha" },
    { value: "guna", label: "Guna" },
    { value: "hari", label: "Hari" },
  ],
  STATUS: [
    { value: "all", label: "All Status" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "in-review", label: "In Review" },
    { value: "published", label: "Published" },
  ],
  DATE_RANGE: [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ],
});
