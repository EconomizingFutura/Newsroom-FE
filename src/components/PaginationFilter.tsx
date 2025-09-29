import React, { useState } from "react";
import { List, Check } from "lucide-react";

interface PaginationFilterProps {
  onClick: (value: string) => void;
}

const PaginationFilter: React.FC<PaginationFilterProps> = ({ onClick }) => {
  const OPTIONS = [
    "1 per page",
    "10 per page",
    "30 per page",
    "70 per page",
    "100 per page",
    "150 per page",
  ];
  const [selectedOption, setSelectedOption] = useState(OPTIONS[1]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onClick(option);
  };

  return (
    <div className="relative w-[123px]">
      <div
        className="cursor-pointer flex gap-2 w-[123px] items-center rounded-md  h-8 justify-evenly border border-[#03101F80] font-circular-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <List size={18} />
        <p className="text-sm text-[#03101F]">{selectedOption}</p>
      </div>

      {isOpen && (
        <div className="absolute -top-44 font-circular-500 w-[123px] bg-white border border-[#03101F33] rounded-md mt-1 shadow-md z-10">
          {OPTIONS.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between cursor-pointer px-2 py-1 hover:bg-[#F7F7F7]"
              onClick={() => handleClick(option)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <p
                className={`text-sm ${
                  selectedOption === option
                    ? "font-medium text-[#03101F]"
                    : hoveredIndex === index
                    ? "text-[#03101F]"
                    : "text-[#A1A1A1]"
                }`}
              >
                {option}
              </p>
              {selectedOption === option || hoveredIndex === index ? (
                <Check className="text-[#03101F]" size={16} />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaginationFilter;
