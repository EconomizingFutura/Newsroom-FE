// src/pages/CalendarPage.tsx
import React, { useRef, useState, useMemo } from "react";
import FullCalendar, {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  CalendarApi,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";

/**
 * Notes:
 * - Month view is default.
 * - Posts only have a date+time; for rendering in timeGrid views we use a small visual duration (15 min).
 * - dayMaxEventRows is set to 4 for month cells to show "+ n more".
 * - Colors are sampled from provided screenshots: backgrounds are subtle (near #F7FAF7), title is dark.
 */

type Post = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  status?: "draft" | "scheduled" | "published";
  platform?: string;
};

const BG_PAGE = "#F7FAF7"; // sampled light background from screenshot
const CARD_BG = "#FFFFFF";
const TITLE_COLOR = "#1B1B1B"; // near black from screenshot sampling
const SUBTEXT = "#6B7280"; // tailwind gray-500 like
const SCHEDULE_COLOR = "#1E3A8A"; // deep blue (for scheduled)
const PUBLISHED_COLOR = "#16A34A"; // green (for published)
const EVENT_TEXT = "#0B1220"; // event text color

// Utility to convert date + time to ISO string and create small end time (15 min)
const toEventRange = (date: string, time: string) => {
  const [hh, mm] = time.split(":").map(Number);
  const start = new Date(date);
  start.setHours(hh, mm, 0, 0);
  const end = new Date(start.getTime() + 15 * 60 * 1000); // 15 minute visual duration
  return { start: start.toISOString(), end: end.toISOString() };
};

// Example: create sample posts for THIS WEEK (relative to today)
const createThisWeekPosts = (): Post[] => {
  const now = new Date();
  // find this week's Sunday (0) as base
  const base = new Date(now);
  base.setDate(now.getDate() - now.getDay()); // Sunday
  // Helper to create date string for offset days 0..6
  const d = (offset: number) => {
    const dd = new Date(base);
    dd.setDate(base.getDate() + offset);
    const yyyy = dd.getFullYear();
    const mm = String(dd.getMonth() + 1).padStart(2, "0");
    const day = String(dd.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${day}`;
  };

  return [
    { id: "p1", title: "Pipeline Review", date: d(1), time: "10:00", status: "scheduled" }, // Monday
    { id: "p2", title: "Leak Detection", date: d(1), time: "10:00", status: "scheduled" }, // same time, same date
    { id: "p3", title: "Market Snapshot", date: d(1), time: "10:00", status: "published" }, // same time, same date => 3 items at same slot
    { id: "p4", title: "Content Draft Review", date: d(2), time: "14:30", status: "scheduled" }, // Tue
    { id: "p5", title: "Editorial Meeting", date: d(3), time: "09:15", status: "scheduled" }, // Wed
    { id: "p6", title: "Graphics Approval", date: d(4), time: "15:00", status: "published" }, // Thu
    { id: "p7", title: "Social Plan", date: d(5), time: "11:00", status: "scheduled" }, // Fri
    
    // Add more to demonstrate +n behavior in month view
    { id: "p8", title: "Evening Publish", date: d(1), time: "20:00", status: "scheduled" },
    { id: "p9", title: "Breaking: Local", date: d(1), time: "20:00", status: "scheduled" },
    { id: "p10", title: "Local Brief", date: d(1), time: "20:00", status: "scheduled" },
    { id: "p11", title: "Sports Blast", date: d(1), time: "20:00", status: "published" },
    // p8..p11 share same time -> will show + more when month cell limited to 4 rows
  ];
};

const CalendarPage: React.FC = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [view, setView] = useState<"dayGridMonth" | "timeGridWeek" | "timeGridDay">("dayGridMonth"); // month default
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // posts (in real app load from API). We'll initialize with this week's posts.
  const posts = useMemo(() => createThisWeekPosts(), []);

  // Convert posts to FullCalendar events (each has short visual duration)
  const events: EventInput[] = posts.map((p) => {
    const range = toEventRange(p.date, p.time);
    const bg =
      p.status === "published" ? PUBLISHED_COLOR : SCHEDULE_COLOR;
    return {
      id: p.id,
      title: p.title,
      start: range.start,
      end: range.end,
      // store original fields for use in eventContent or eventDidMount
      extendedProps: {
        status: p.status,
        platform: p.platform,
        rawDate: p.date,
        rawTime: p.time,
        color: bg,
      },
      backgroundColor: "transparent", // we'll style in eventContent
      borderColor: "transparent",
    };
  });

  // Programmatic navigation
  const changeView = (v: typeof view) => {
    const api = calendarRef.current?.getApi() as CalendarApi | undefined;
    setView(v);
    api?.changeView(v);
  };
  const navPrev = () => {
    const api = calendarRef.current?.getApi() as CalendarApi;
    api?.prev();
    setCurrentDate(new Date(api?.getDate() ?? new Date()));
  };
  const navNext = () => {
    const api = calendarRef.current?.getApi() as CalendarApi;
    api?.next();
    setCurrentDate(new Date(api?.getDate() ?? new Date()));
  };
  const navToday = () => {
    const api = calendarRef.current?.getApi() as CalendarApi;
    api?.today();
    setCurrentDate(new Date(api?.getDate() ?? new Date()));
  };

  // Selecting a slot — in newsroom we might create a post at that time
  const handleSelect = (selectInfo: DateSelectArg) => {
    // For this build we just unselect; in production open "create new post" modal prefilled with date/time
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // For now show a small confirm delete (demo). Replace with modal to edit/view post.
    const title = clickInfo.event.title;
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Open post: "${title}" ? (OK to view, Cancel to do nothing)`)) {
      // replace with route/modal
      alert(`Open post: ${title}\nTime: ${format(clickInfo.event.start!, "PPP p")}`);
    }
  };

  // Custom small event renderer to match screenshot style
  const renderEvent = (arg: EventContentArg) => {
    const color = arg.event.extendedProps.color ?? SCHEDULE_COLOR;
    // event title in screenshot is small, truncated in month view; we show full in tooltip
    const timeLabel = arg.event.start ? format(arg.event.start, "p") : "";
    // Provide a compact card like screenshot: small border left color + title
    return (
      <div
        className="flex items-center gap-2 px-1 py-0.5 rounded text-xs font-medium"
        title={`${arg.event.title} • ${timeLabel}`}
        style={{
          borderLeft: `3px solid ${color}`,
          backgroundColor: "#ffffff",
          color: EVENT_TEXT,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.02) inset",
        }}
      >
        <div className="truncate" style={{ maxWidth: 180 }}>
          {arg.event.title}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-80" style={{ backgroundColor: BG_PAGE }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: TITLE_COLOR }}>
            <span className="mr-2">📅</span> Calendar
          </h1>
          <p className="text-sm mt-1" style={{ color: SUBTEXT }}>
            Schedule and manage newsroom posts — month / week / day view.
          </p>
        </div>

        {/* Right controls: Prev / Today / Next, Dropdown for view */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-md px-2 py-1 shadow-sm">
            <button
              onClick={navPrev}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Previous"
            >
              ◀
            </button>
            <button
              onClick={navToday}
              className="px-2 py-1 rounded text-sm hover:bg-gray-100"
              aria-label="Today"
            >
              Today
            </button>
            <button
              onClick={navNext}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Next"
            >
              ▶
            </button>
          </div>

          {/* Current range display */}
          <div className="bg-white px-3 py-1 rounded-md shadow-sm text-sm">
            <strong style={{ color: TITLE_COLOR }}>
              {/* We display center title from FullCalendar's API */}
              {/* derive from calendar ref */}
              {(() => {
                try {
                  const api = calendarRef.current?.getApi();
                  return api ? api.view.title : format(currentDate, "LLLL yyyy");
                } catch {
                  return format(currentDate, "LLLL yyyy");
                }
              })()}
            </strong>
          </div>

          {/* View dropdown */}
          <div className="bg-white px-2 py-1 rounded-md shadow-sm">
            <select
              value={view === "dayGridMonth" ? "Month" : view === "timeGridWeek" ? "Week" : "Day"}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "Month") changeView("dayGridMonth");
                else if (val === "Week") changeView("timeGridWeek");
                else changeView("timeGridDay");
              }}
              className="bg-transparent text-sm outline-none"
            >
              <option>Month</option>
              <option>Week</option>
              <option>Day</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, backgroundColor: SCHEDULE_COLOR, borderRadius: 2 }} />
          <span className="text-sm" style={{ color: SUBTEXT }}>
            Scheduled
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, backgroundColor: PUBLISHED_COLOR, borderRadius: 2 }} />
          <span className="text-sm" style={{ color: SUBTEXT }}>
            Published
          </span>
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={false}
          // event data
          events={events}
          // Month cell: show up to 4 lines and then "+n more"
          dayMaxEventRows={4}
          // Allow selection to create a post (we do not add here; placeholder)
          selectable={true}
          select={handleSelect}
          // Time grid behavior
          allDaySlot={false}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          // show the thin line for current time
          nowIndicator={true}
          // Let events overlap and be displayed side-by-side when times conflict
          eventOverlap={true}
          // Use our custom renderer to style events like screenshot
          eventContent={renderEvent}
          // event click opens modal in production; here we show a small handler
          eventClick={handleEventClick}
          // small responsive height
          height="auto"
          // show more link uses built-in popover
          moreLinkClick="popover"
          // small spacing tweak to visually match screenshots
          dayCellClassNames={() => "px-1 py-2"}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
