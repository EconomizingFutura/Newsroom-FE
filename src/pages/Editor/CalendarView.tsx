import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Clock,
  MapPin,
  X,
  Save,
  Trash2,
} from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  time: string;
  type: string;
  priority: string;
  author?: string;
  category?: string;
  location?: string;
  status: string;
  description?: string;
}

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)); // January 2025
  const [expandedView, setExpandedView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);

  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventPriority, setEventPriority] = useState("medium");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventAuthor, setEventAuthor] = useState("");
  const [eventCategory, setEventCategory] = useState("");

  // Sample calendar events
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Breaking: City Council Votes on New Housing Development",
      date: new Date(2025, 0, 15),
      time: "16:00:00",
      type: "publish",
      priority: "high",
      author: "Sarah Chen",
      category: "Politics",
      status: "scheduled",
      description:
        "Scheduled publication of the city council housing development story.",
    },
    {
      id: 2,
      title: "Local Sports Team Championship Coverage",
      date: new Date(2025, 0, 16),
      time: "14:30:00",
      type: "publish",
      priority: "medium",
      author: "Mike Rodriguez",
      category: "Sports",
      status: "scheduled",
      description: "Coverage of the championship match results.",
    },
    {
      id: 3,
      title: "Weekly Editorial Meeting",
      date: new Date(2025, 0, 16),
      time: "10:00:00",
      type: "meeting",
      priority: "low",
      location: "Conference Room A",
      status: "scheduled",
      description: "Weekly editorial planning and review meeting.",
    },
    {
      id: 4,
      title: "Interview with Mayor",
      date: new Date(2025, 0, 18),
      time: "09:00:00",
      type: "interview",
      priority: "high",
      location: "City Hall",
      status: "confirmed",
      description: "Scheduled interview with the mayor regarding new policies.",
    },
    {
      id: 5,
      title: "Technology Center Opening Coverage",
      date: new Date(2025, 0, 20),
      time: "11:00:00",
      type: "publish",
      priority: "medium",
      author: "Lisa Wang",
      category: "Technology",
      status: "scheduled",
      description: "Coverage of the new technology center opening.",
    },
    {
      id: 6,
      title: "Environmental Report Deadline",
      date: new Date(2025, 0, 22),
      time: "17:00:00",
      type: "deadline",
      priority: "high",
      author: "Emma Johnson",
      category: "Environment",
      status: "pending",
      description: "Final deadline for environmental impact report submission.",
    },
    {
      id: 7,
      title: "Community Event Planning",
      date: new Date(2025, 0, 22),
      time: "14:00:00",
      type: "meeting",
      priority: "low",
      location: "Community Center",
      status: "scheduled",
      description: "Planning meeting for upcoming community events.",
    },
    {
      id: 8,
      title: "Business Quarter Review Publication",
      date: new Date(2025, 0, 25),
      time: "08:00:00",
      type: "publish",
      priority: "medium",
      author: "David Brown",
      category: "Business",
      status: "scheduled",
      description: "Quarterly business review article publication.",
    },
  ]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return calendarEvents.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "publish":
        return "bg-green-100 text-green-800 border-green-200";
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "interview":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const eventsOnDate = getEventsForDate(date);
    if (eventsOnDate.length > 3) {
      setExpandedView(true);
    } else {
      // Open new event modal for the selected date
      openNewEventModal(date);
    }
  };

  const handleShowMore = (date: Date) => {
    setSelectedDate(date);
    setExpandedView(true);
  };

  const openNewEventModal = (date: Date) => {
    setIsNewEvent(true);
    setEditingEvent(null);
    resetEventForm();
    setEventDate(date.toISOString().split("T")[0]);
    setEventModalOpen(true);
  };

  const openEditEventModal = (event: CalendarEvent) => {
    setIsNewEvent(false);
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventDate(event.date.toISOString().split("T")[0]);
    setEventTime(event.time);
    setEventType(event.type);
    setEventPriority(event.priority);
    setEventLocation(event.location || "");
    setEventDescription(event.description || "");
    setEventAuthor(event.author || "");
    setEventCategory(event.category || "");
    setEventModalOpen(true);
  };

  const resetEventForm = () => {
    setEventTitle("");
    setEventDate("");
    setEventTime("");
    setEventType("");
    setEventPriority("medium");
    setEventLocation("");
    setEventDescription("");
    setEventAuthor("");
    setEventCategory("");
  };

  const handleSaveEvent = () => {
    const newEvent: CalendarEvent = {
      id: isNewEvent ? Date.now() : editingEvent!.id,
      title: eventTitle,
      date: new Date(eventDate),
      time: eventTime,
      type: eventType,
      priority: eventPriority,
      author: eventAuthor || undefined,
      category: eventCategory || undefined,
      location: eventLocation || undefined,
      status: "scheduled",
      description: eventDescription || undefined,
    };

    if (isNewEvent) {
      setCalendarEvents([...calendarEvents, newEvent]);
    } else {
      setCalendarEvents(
        calendarEvents.map((event) =>
          event.id === editingEvent!.id ? newEvent : event
        )
      );
    }

    setEventModalOpen(false);
    resetEventForm();
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setCalendarEvents(
        calendarEvents.filter((event) => event.id !== editingEvent.id)
      );
      setEventModalOpen(false);
      resetEventForm();
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex gap-6 h-full">
            {/* Calendar Section */}
            <div className="flex-1">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-6 h-6 text-[#008001]" />
                  <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                </div>
                <p className="text-gray-600">
                  Schedule and manage your publishing timeline.
                </p>
              </div>

              {/* Calendar Controls */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {monthNames[currentMonth.getMonth()]}{" "}
                      {currentMonth.getFullYear()}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={previousMonth}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextMonth}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="text-[#008001] border-green-200 bg-green-50"
                    >
                      <div className="w-2 h-2 text-[#008001] rounded-full mr-2"></div>
                      Publish
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-200 bg-blue-50"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Meeting
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-200 bg-red-50"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Deadline
                    </Badge>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day Headers */}
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-sm font-medium text-gray-500 border-b"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {days.map((day, index) => {
                    const events = day ? getEventsForDate(day) : [];
                    const isToday = day
                      ? day.toDateString() === new Date().toDateString()
                      : false;

                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          isToday ? "bg-green-50 border-green-200" : ""
                        }`}
                        onClick={() => day && handleDateClick(day)}
                      >
                        {day && (
                          <>
                            <div
                              className={`text-sm font-medium mb-2 ${
                                isToday ? "text-green-700" : "text-gray-900"
                              }`}
                            >
                              {day.getDate()}
                            </div>
                            <div className="space-y-1">
                              {events.slice(0, 3).map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs px-2 py-1 rounded border ${getEventTypeColor(
                                    event.type
                                  )} truncate cursor-pointer hover:opacity-80`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditEventModal(event);
                                  }}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {events.length > 3 && (
                                <button
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowMore(day);
                                  }}
                                >
                                  +{events.length - 3} more
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Event Details Panel - Shows when expandedView is true */}
            {expandedView && selectedDate && (
              <div className="w-96">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openNewEventModal(selectedDate)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Event
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedView(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {getEventsForDate(selectedDate).map((event) => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => openEditEventModal(event)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 flex-1">
                            {event.title}
                          </h4>
                          <Badge
                            className={`text-xs ${getEventTypeColor(
                              event.type
                            )}`}
                          >
                            {event.type}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>

                          {event.author && (
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{event.author}</span>
                            </div>
                          )}

                          {event.location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}

                          {event.category && (
                            <Badge variant="outline" className="text-xs">
                              {event.category}
                            </Badge>
                          )}
                        </div>

                        {event.type === "publish" && (
                          <div className="mt-3 flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Event Creation/Editing Modal */}
      <Dialog open={eventModalOpen} onOpenChange={setEventModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {isNewEvent ? "Create New Event" : "Edit Event"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {isNewEvent
                ? "Add a new event to your calendar."
                : "Update event details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Event Title */}
            <div>
              <Label
                htmlFor="event-title"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Event Title *
              </Label>
              <Input
                id="event-title"
                placeholder="Enter event title..."
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="event-date"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Date *
                </Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="event-time"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Time *
                </Label>
                <Input
                  id="event-time"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Event Type and Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Event Type *
                </Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publish">Publish</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Priority
                </Label>
                <Select value={eventPriority} onValueChange={setEventPriority}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div>
              <Label
                htmlFor="event-location"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Location
              </Label>
              <Input
                id="event-location"
                placeholder="Enter location..."
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Author and Category (for publish events) */}
            {eventType === "publish" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label
                    htmlFor="event-author"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Author
                  </Label>
                  <Input
                    id="event-author"
                    placeholder="Enter author..."
                    value={eventAuthor}
                    onChange={(e) => setEventAuthor(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="event-category"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Category
                  </Label>
                  <Input
                    id="event-category"
                    placeholder="Enter category..."
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <Label
                htmlFor="event-description"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Description
              </Label>
              <Textarea
                id="event-description"
                placeholder="Enter event description..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <div>
                {!isNewEvent && (
                  <Button
                    variant="outline"
                    onClick={handleDeleteEvent}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setEventModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEvent}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={
                    !eventTitle || !eventDate || !eventTime || !eventType
                  }
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isNewEvent ? "Create Event" : "Update Event"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
