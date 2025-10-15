import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Setup localizer
const localizer = momentLocalizer(moment);

// Example events
const events = [
  {
    title: "Leak Detection Review",
    start: new Date(2025, 0, 11, 10, 0),
    end: new Date(2025, 0, 11, 11, 0),
    type: "scheduled",
  },
  {
    title: "Pipeline Review",
    start: new Date(2025, 0, 11, 12, 0),
    end: new Date(2025, 0, 11, 13, 0),
    type: "published",
  },
  {
    title: "Emissions Check",
    start: new Date(2025, 0, 19, 14, 0),
    end: new Date(2025, 0, 19, 15, 0),
    type: "scheduled",
  },
  {
    title: "Facility Audit",
    start: new Date(2025, 0, 24, 9, 0),
    end: new Date(2025, 0, 24, 10, 30),
    type: "scheduled",
  },
];

export function CalendarView() {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [date, setDate] = useState(new Date());

  // Handle navigation
  const handleNavigate = (action: "prev" | "next") => {
    const newDate =
      action === "prev"
        ? moment(date).subtract(1, view === "month" ? "month" : "week").toDate()
        : moment(date).add(1, view === "month" ? "month" : "week").toDate();
    setDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <CalendarIcon className="w-6 h-6 text-green-700" />
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          </div>
          <p className="text-gray-600">
            Schedule and manage your content publishing timeline.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-3 sm:mb-0">
            <h2 className="text-xl font-semibold text-gray-900">
              {moment(date).format("MMMM YYYY")}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate("next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-green-700 border-green-200 bg-green-50"
            >
              Published
            </Badge>
            <Badge
              variant="outline"
              className="text-blue-700 border-blue-200 bg-blue-50"
            >
              Scheduled
            </Badge>

            {/* View Selector */}
            <Select value={view} onValueChange={(v) => setView(v as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={date}
            view={view}
            onView={(newView) => setView(newView as any)}
            onNavigate={(newDate) => setDate(newDate)}
            views={["month", "week", "day"]}
            style={{ height: "80vh" }}
            eventPropGetter={(event) => ({
              className: "",
              style: {
                backgroundColor:
                  event.type === "published" ? "#d1fae5" : "#dbeafe",
                borderColor:
                  event.type === "published" ? "#6ee7b7" : "#93c5fd",
                color:
                  event.type === "published" ? "#065f46" : "#1e40af",
                borderRadius: "8px",
                borderWidth: "1px",
                padding: "2px 6px",
                fontSize: "0.8rem",
              },
            })}
          />
        </div>
      </div>
    </div>
  );
}
