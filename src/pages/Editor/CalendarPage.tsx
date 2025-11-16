import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";

import type {
  CalendarApi,
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

import ContentHeader from "@/components/ContentHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CalendarSidebar from "@/components/CalendarSidebar";
import { API_LIST } from "@/api/endpoints";
import { GET } from "@/api/apiMethods";
import { useCancelEvent } from "@/hooks/useCalendarAPI";
import type { AxiosError } from "axios";
import type { CalendarEventsResponse } from "@/types/apitypes";
import {
  transformScheduleData,
  type TransformedItem,
} from "@/utils/PublishCenter";
import { cn } from "@/components/ui/utils";
import Loading from "../Shared/agency-feeds/loading";

const CalendarPage: React.FC = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<TransformedItem[]>([]);
  const [view, setView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  >("dayGridMonth");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedEvents, setSelectedEvents] = useState<TransformedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { handleCancelAPI } = useCancelEvent();

  const getCalendarEvents = async () => {
    try {
      setLoading(true);
      const url = API_LIST.BASE_URL + API_LIST.CALENDAR_EVENTS;
      const response = await GET<CalendarEventsResponse>(url);
      return response.data;
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.log("Error fetching calendar events:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const { handleShow, handleDelete } = {
    handleShow: () => setShowSidebar((p) => !p),
    handleDelete: async (id: string) => {
      console.log(
        "Delete event with id:",
        id,
        selectedEvents,
        selectedEvents[0]?.platform
      );
      await handleCancelAPI(
        id.split("-")[0],
        selectedEvents[0]?.platform?.split(",") || []
      );
      setShowSidebar((p) => !p);
      getCalendarEvents();
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCalendarEvents();
        if (data) {
          const transformed = transformScheduleData(
            data,
            view === "dayGridMonth"
              ? "month"
              : view === "timeGridWeek"
              ? "week"
              : "day"
          );
          setEvents(transformed);
          console.log(transformed);
        }
      } catch (error: unknown) {
        const err = error as AxiosError;
        console.log("Error fetching calendar events:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [view]);

  const fullCalendarEvents: EventInput[] = events.map((e) => ({
    id: e.id.toString(),
    title: e.title,
    start: e.start,
    end: e.end,
    extendedProps: { ...e },
  }));

  const handleNavigate = (direction: "prev" | "next") => {
    const api = calendarRef.current?.getApi() as CalendarApi;
    if (!api) return;

    if (direction === "prev") {
      api.prev();
    } else {
      api.next();
    }

    setCurrentDate(api.getDate());
  };

  const handleViewChange = (v: "month" | "week" | "day") => {
    const api = calendarRef.current?.getApi() as CalendarApi;
    if (!api) return;
    const newView =
      v === "month"
        ? "dayGridMonth"
        : v === "week"
        ? "timeGridWeek"
        : "timeGridDay";
    setView(newView);
    api.changeView(newView);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const clickedDate = moment(clickInfo.event.start).startOf("day");
    const dayEvents = events.filter((e) =>
      moment(e.start).isSame(clickedDate, "day")
    );
    setSelectedEvents(dayEvents);
    setShowSidebar(true);
    console.log("Event clicked:", dayEvents);
  };

  const handleSelect = (selectInfo: DateSelectArg) => {
    const clickedDate = moment(selectInfo.start).startOf("day");
    const dayEvents = events.filter((e) =>
      moment(e.start).isSame(clickedDate, "day")
    );
    if (dayEvents.length > 0) {
      setSelectedEvents(dayEvents);
      setShowSidebar(true);
      console.log("dayEvents clicked:", selectInfo);
    }
  };

  const renderEvent = (arg: EventContentArg) => {
    const event = arg.event.extendedProps as TransformedItem;
    const isDay = view === "timeGridDay";
    const isScheduled = event.status?.toLowerCase() === "scheduled";
    const color = isScheduled ? "#1E3A8A" : "#16A34A";
    const bgColor = isScheduled ? "#03528F1A" : "#2DA94F1A";
    const timeLabel = arg.event.start
      ? moment(arg.event.start).format("h:mm A")
      : "";

    return (
      <div
        className="flex items-center gap-2 px-1 py-0.5 rounded text-xs font-medium"
        title={`${arg.event.title} • ${timeLabel}`}
        style={{
          border: `1px solid ${color}`,
          borderLeft: `3px solid ${color}`,
          backgroundColor: view !== "dayGridMonth" ? "white" : bgColor,
          color: color,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.02) inset",
          maxWidth: `90%`,
        }}
      >
        {/* style={{ maxWidth: 180 }} */}
        <div className={cn("truncate", isDay ? "max-w-min" : "max-w-48")}>
          {arg.event.title}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full px-8">
        <div className="my-6">
          <ContentHeader
            text="Calendar"
            iconName="Calendar"
            description="Here's what's happening in your newsroom today."
          />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="bg-white mb-6 flex flex-col">
            <div className="flex w-full py-4 justify-between">
              <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                <div className="flex items-center">
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
                  {view === "dayGridMonth"
                    ? moment(currentDate).format("MMMM YYYY")
                    : view === "timeGridWeek"
                    ? `${moment(currentDate)
                        .startOf("week")
                        .format("MMM D")} – ${moment(currentDate)
                        .endOf("week")
                        .format("MMM D, YYYY")}`
                    : view === "timeGridDay"
                    ? moment(currentDate).format("MMMM D, YYYY")
                    : ""}{" "}
                </h2>
              </div>

              <div className="flex items-center text-[#333333] space-x-2">
                <Badge variant="outline" className="border-none">
                  <span className="h-3 w-3 rounded bg-[#03528F]"></span>{" "}
                  Scheduled
                </Badge>
                <Badge variant="outline" className="border-none">
                  <span className="h-3 rounded w-3 bg-[#2DA94F]"></span>{" "}
                  Published
                </Badge>

                <Select
                  value={
                    view === "dayGridMonth"
                      ? "month"
                      : view === "timeGridWeek"
                      ? "week"
                      : "day"
                  }
                  onValueChange={handleViewChange}
                >
                  <SelectTrigger className="border border-[#E0E0E0] w-[94px] bg-[#FFFFFF] text-[#282C3F] rounded-[4px]">
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

            <div className="bg-white rounded-lg shadow-sm p-4">
              <style>{`
  .fc .fc-day-today {
    background-color: transparent !important;
    border: none !important;
  }

  /* MONTH VIEW — highlight only date number */
  .fc .fc-day-today .fc-daygrid-day-number {
    background-color: #008001 !important;
    color: white !important;
    padding: 2px 6px;
    border-radius: 50%;
    font-weight: 600;
  }
.fc .fc-more-popover .fc-popover-body{
    background-color: #ffffff !important;
}
    .fc-theme-standard .fc-popover-header{
        background-color: #ffffff !important;

    }
  .fc .fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion {
    background-color: #008001 !important;
    color: white !important;
    padding: 2px 8px;
    border-radius: 50%;
    font-weight: 600;
    display: inline-block; /* ensures the circle wraps the text */
  }

  /* WEEK/DAY VIEW - Today's header styling */
  .fc .fc-timeGridWeek .fc-col-header-cell.fc-day-today,
  .fc .fc-timeGridDay .fc-col-header-cell.fc-day-today {
    background-color: #008001 !important;
  }

  /* Override Tailwind text colors for today's header */
  .fc .fc-timeGridWeek .fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion,
  .fc .fc-timeGridDay .fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion {
    background-color: #008001 !important;
  }

  .fc .fc-timeGridWeek .fc-col-header-cell.fc-day-today .text-gray-500,
  .fc .fc-timeGridDay .fc-col-header-cell.fc-day-today .text-gray-500,
  .fc .fc-timeGridWeek .fc-col-header-cell.fc-day-today .text-gray-900,
  .fc .fc-timeGridDay .fc-col-header-cell.fc-day-today .text-gray-900 {
    color: white !important;
  }

  /* WEEK/DAY VIEW - Today's time slot styling */
  .fc .fc-timegrid-axis-frame.fc-timegrid-axis-frame-liquid {
    background-color: transparent !important;
  }

  .fc .fc-timeGridWeek .fc-day-today,
  .fc .fc-timeGridDay .fc-day-today {
    background-color: #008001 !important;
  }

  .fc .fc-timeGridWeek .fc-day-today .fc-timegrid-col-frame,
  .fc .fc-timeGridDay .fc-day-today .fc-timegrid-col-frame {
    background-color: #008001 !important;
  }

  /* White text for today's date in week/day view time slots */
  .fc .fc-timeGridWeek .fc-day-today .fc-timegrid-col-frame *,
  .fc .fc-timeGridDay .fc-day-today .fc-timegrid-col-frame * {
    color: white !important;
  }

  /* Today's date number in week view header */
  .fc .fc-timeGridWeek .fc-day-today .fc-timegrid-axis-frame,
  .fc .fc-timeGridDay .fc-day-today .fc-timegrid-axis-frame {
    color: white !important;
  }
/* WEEK VIEW — make the weekday white */
.fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion span:nth-child(1) {
  color: white !important;
}

/* WEEK VIEW — make the date number white */
.fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion span:nth-child(2) {
  color: white !important;
}



`}</style>

              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={view}
                headerToolbar={false}
                events={fullCalendarEvents}
                selectable={true}
                select={handleSelect}
                eventClick={handleEventClick}
                eventContent={renderEvent}
                dayMaxEventRows={4}
                allDaySlot={false}
                nowIndicator={true}
                height="80vh"
                moreLinkClick="popover"
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                eventMinHeight={20}
                // eventOverlap={(stillEvent, movingEvent) => {
                //   return stillEvent.startStr === movingEvent?.startStr;
                // }}
                dayHeaderFormat={{
                  weekday: "short", // 'Sun', 'Mon', 'Tue'
                  day: "numeric", // 3, 4, 5
                }}
                dayHeaderContent={(arg) => {
                  const weekday = arg.date.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  const day = arg.date.getDate();
                  return {
                    html: `
      <div class="flex flex-col items-center leading-tight">
        <span class="text-xs text-gray-500">${weekday}</span>
        <span class="text-base font-semibold text-gray-900">${day}</span>
      </div>
    `,
                  };
                }}
                eventOverlap={true}
                slotEventOverlap={true}
                eventOrder="title"
                dayCellClassNames={() => "px-1 py-2"}
                moreLinkContent={(arg) => {
                  return {
                    html: `
        <span style="
          color: #076122;
          font-weight: 600;
          text-align: center;
          display: inline-block;
          width: 100%;
        ">
          +${arg.num} more
        </span>
      `,
                  };
                }}
              />
            </div>
          </div>
        )}

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
};

export default CalendarPage;
