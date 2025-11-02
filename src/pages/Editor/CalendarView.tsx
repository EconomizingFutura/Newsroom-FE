import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar, momentLocalizer } from "react-big-calendar";
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
import ContentHeader from "@/components/ContentHeader";
import { CALENDAR_BG, CALENDAR_BORDER } from "@/utils/utils";
import CalendarSidebar from "@/components/CalendarSidebar";
import type { AxiosError } from "axios";
import { API_LIST } from "@/api/endpoints";
import { GET } from "@/api/apiMethods";
import type { CalendarEventsResponse } from "@/types/apitypes";
import {
  transformScheduleData,
  type TransformedItem,
} from "@/utils/PublishCenter";
import { useCancelEvent } from "@/hooks/useCalendarAPI";
const localizer = momentLocalizer(moment);

export function CalendarView() {
  const [events, setEvents] = useState<TransformedItem[]>([]);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [date, setDate] = useState(new Date());
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedEvents, setSelectedEvents] = useState<TransformedItem[]>([]);
  const { handleCancelAPI } = useCancelEvent();

  const { handleShow, handleDelete } = {
    handleShow: () => setShowSidebar((p) => !p),
    handleDelete: async (id: string) => {
      await handleCancelAPI(id);
      setShowSidebar((p) => !p);
    },
  };

  // Handle navigation
  const handleNavigate = (action: "prev" | "next") => {
    const unit = view === "month" ? "month" : view === "week" ? "week" : "day";
    const newDate =
      action === "prev"
        ? moment(date).subtract(1, unit).toDate()
        : moment(date).add(1, unit).toDate();
    setDate(newDate);
  };

  const getCalendarEvents = async () => {
    try {
      const url = API_LIST.BASE_URL + API_LIST.CALENDAR_EVENTS;
      const response = await GET<CalendarEventsResponse>(url);
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.log("Error fetching calendar events:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCalendarEvents();
      if (data) {
        const tranformedData = transformScheduleData(data);
        setEvents(tranformedData);
      }
    };

    fetchData();
  }, []);

  const CustomEvent = ({ event }: { event: TransformedItem }) => (
    <span
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {event.title}
    </span>
  );

  // Custom function to show "+X more" link
  // const CustomShowMore = ({ count, onShowMore }) => (
  //   <button
  //     onClick={onShowMore}
  //     style={{
  //       color: "#1e40af",
  //       fontSize: "0.75rem",
  //       cursor: "pointer",
  //       background: "none",
  //       border: "none",
  //       padding: "2px 0",
  //       textDecoration: "underline",
  //       fontWeight: "500",
  //     }}
  //   >
  //     +{count} more
  //   </button>
  // );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 ">
      <style>{`
        /* Limit events shown in week view time slots */
        .rbc-time-slot .rbc-events-container {
          max-height: 60px;
          overflow: hidden;
        }
        
        /* Style for the show more link in week view */
        .rbc-show-more {
          margin-top: 2px;
          font-size: 0.75rem;
          color: #1e40af;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        
        /* Ensure events don't overlap excessively in week view */
        .rbc-event {
          max-width: 100%;
        }
      `}</style>
      <div className=" w-full px-8">
        {/* Header */}
        <div className="my-6">
          <ContentHeader
            text={"Calendar"}
            iconName="Calendar"
            description="Here's what's happening in your newsroom today."
          />
        </div>
        {/* Controls */}
        <div className="bg-white  mb-6 flex flex-col  ">
          <div className="flex w-full py-4 justify-between">
            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
              <div className="flex items-center ">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-none"
                  onClick={() => handleNavigate("prev")}
                >
                  <ChevronLeft color="#282C3F" className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-none"
                  onClick={() => handleNavigate("next")}
                >
                  <ChevronRight color="#282C3F" className="w-6 h-6" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {moment(date).format("MMMM YYYY")}
              </h2>
            </div>

            <div className="flex items-center text-[#333333] space-x-2">
              <Badge variant="outline" className="border-none">
                <span className="h-3 w-3 rounded bg-[#03528F]"></span> Scheduled
              </Badge>
              <Badge variant="outline" className="border-none">
                <span className="h-3 rounded w-3 bg-[#2DA94F]"></span> Published
              </Badge>
              {/* View Selector */}
              <Select
                value={view}
                onValueChange={(v: "month" | "week" | "day") => setView(v)}
              >
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

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={date}
            view={view}
            onView={handleShow}
            selectable
            onSelectSlot={(slotInfo) => {
              const clickedDate = moment(slotInfo.start).startOf("day");
              const dayEvents = events.filter((e) =>
                moment(e.start).isSame(clickedDate, "day")
              );

              if (dayEvents.length > 0) {
                setSelectedEvents(dayEvents);
                setShowSidebar(true);
              }
            }}
            onSelectEvent={(event) => {
              const clickedDate = moment(event.start).startOf("day");
              const dayEvents = events.filter((e) =>
                moment(e.start).isSame(clickedDate, "day")
              );
              setSelectedEvents(dayEvents);
              setShowSidebar(true);
            }}
            onNavigate={(newDate) => setDate(newDate)}
            views={["month", "week", "day"]}
            components={{
              event: CustomEvent,
            }}
            popup={true}
            popupOffset={30}
            doShowMoreDrillDown={false}
            max={moment().hours(23).minutes(59).toDate()}
            style={{ height: "80vh" }}
            eventPropGetter={(event) => ({
              style: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: CALENDAR_BG(
                  event.status.toLowerCase() as "scheduled" | "posted"
                ),
                border: `1px solid ${CALENDAR_BORDER(
                  event.status.toLowerCase() as "scheduled" | "posted"
                )}`,
                color:
                  event.status.toLowerCase() === "scheduled"
                    ? "#03528F"
                    : "#2DA94F",
                borderRadius: "4px",
                padding: "2px 6px",
                fontSize: "0.8rem",
                maxWidth: "124px",
                margin: "2px auto",
                textAlign: "center",
              },
            })}
          />
        </div>
        {showSidebar && (
          <CalendarSidebar
            onToggle={handleShow}
            onConfirmdelete={handleDelete}
            events={selectedEvents}
          />
        )}
      </div>
    </div>
  );
}
