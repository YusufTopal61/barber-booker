import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  format,
  addDays,
  startOfDay,
  isSameDay,
  setHours,
  setMinutes,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateTimeSelectionProps {
  selectedServiceId: string;
  selectedDateTime: Date | null;
  onSelect: (dateTime: Date) => void;
}

const DateTimeSelection = ({
  selectedServiceId,
  selectedDateTime,
  onSelect,
}: DateTimeSelectionProps) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = startOfDay(new Date());

  // Generate dates for the current week view
  const dates = useMemo(() => {
    const startDate = addDays(today, weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  }, [weekOffset, today]);

  // Get the selected service for duration
  const { data: service } = useQuery({
    queryKey: ["service", selectedServiceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", selectedServiceId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Get availability rules
  const { data: availabilityRules } = useQuery({
    queryKey: ["availability-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_rules")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data;
    },
  });

  // Get availability exceptions for the displayed dates
  const { data: exceptions } = useQuery({
    queryKey: ["availability-exceptions", dates[0], dates[6]],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_exceptions")
        .select("*")
        .gte("exception_date", format(dates[0], "yyyy-MM-dd"))
        .lte("exception_date", format(dates[6], "yyyy-MM-dd"));
      if (error) throw error;
      return data;
    },
    enabled: dates.length > 0,
  });

  // Get existing appointments for the displayed dates
  const { data: existingAppointments, isLoading: loadingAppointments } =
    useQuery({
      queryKey: ["appointments-check", dates[0], dates[6]],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("appointments")
          .select("start_datetime, end_datetime")
          .gte("start_datetime", dates[0].toISOString())
          .lte("start_datetime", addDays(dates[6], 1).toISOString())
          .neq("status", "cancelled");
        if (error) throw error;
        return data;
      },
      enabled: dates.length > 0,
    });

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    selectedDateTime ? startOfDay(selectedDateTime) : null
  );

  // Generate time slots for a given date
  const generateTimeSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    const rule = availabilityRules?.find((r) => r.weekday === dayOfWeek);

    if (!rule) return [];

    // Check for exceptions
    const dateStr = format(date, "yyyy-MM-dd");
    const exception = exceptions?.find((e) => e.exception_date === dateStr);

    if (exception?.exception_type === "blocked" && !exception.start_time) {
      return []; // Whole day blocked
    }

    const startTime = exception?.start_time || rule.start_time;
    const endTime = exception?.end_time || rule.end_time;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const slots: Date[] = [];
    const slotDuration = service?.duration_minutes || 30;
    const bufferAfter = service?.buffer_after || 5;
    const totalSlotTime = slotDuration + bufferAfter;

    let currentTime = setMinutes(setHours(date, startHour), startMinute);
    const endDateTime = setMinutes(setHours(date, endHour), endMinute);
    const now = new Date();

    while (isBefore(currentTime, endDateTime)) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

      // Check if slot is in the past
      if (isAfter(currentTime, now)) {
        // Check if slot conflicts with existing appointments
        const hasConflict = existingAppointments?.some((apt) => {
          const aptStart = parseISO(apt.start_datetime);
          const aptEnd = parseISO(apt.end_datetime);
          return (
            (isAfter(currentTime, aptStart) && isBefore(currentTime, aptEnd)) ||
            (isAfter(slotEnd, aptStart) && isBefore(slotEnd, aptEnd)) ||
            (isBefore(currentTime, aptStart) && isAfter(slotEnd, aptEnd)) ||
            (isSameDay(currentTime, aptStart) &&
              currentTime.getTime() === aptStart.getTime())
          );
        });

        if (!hasConflict) {
          slots.push(new Date(currentTime));
        }
      }

      currentTime = new Date(currentTime.getTime() + totalSlotTime * 60000);
    }

    return slots;
  };

  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const isDateAvailable = (date: Date) => {
    if (isBefore(date, today)) return false;

    const dayOfWeek = date.getDay();
    const hasRule = availabilityRules?.some((r) => r.weekday === dayOfWeek);

    const dateStr = format(date, "yyyy-MM-dd");
    const exception = exceptions?.find((e) => e.exception_date === dateStr);

    if (exception?.exception_type === "blocked" && !exception.start_time) {
      return false;
    }

    return hasRule;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Kies datum & tijd</h2>
        <p className="text-muted-foreground">Selecteer een beschikbaar moment</p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
          disabled={weekOffset === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm font-medium">
          {format(dates[0], "d MMM", { locale: nl })} —{" "}
          {format(dates[6], "d MMM yyyy", { locale: nl })}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWeekOffset((prev) => prev + 1)}
          disabled={weekOffset >= 4}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const isAvailable = isDateAvailable(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isPast = isBefore(date, today);

          return (
            <button
              key={date.toISOString()}
              onClick={() => isAvailable && setSelectedDate(date)}
              disabled={!isAvailable || isPast}
              className={`p-3 rounded-xl text-center transition-all border ${
                isSelected
                  ? "bg-foreground text-background border-foreground"
                  : isAvailable
                  ? "bg-transparent border-border hover:border-foreground/30"
                  : "bg-transparent border-transparent text-muted-foreground/50 cursor-not-allowed"
              }`}
            >
              <div className="text-xs uppercase mb-1 font-medium">
                {format(date, "EEE", { locale: nl })}
              </div>
              <div className="text-lg font-medium">{format(date, "d")}</div>
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            Beschikbare tijden op{" "}
            {format(selectedDate, "EEEE d MMMM", { locale: nl })}
          </h3>

          {loadingAppointments ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : timeSlots.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {timeSlots.map((slot) => {
                const isSelected =
                  selectedDateTime &&
                  slot.getTime() === selectedDateTime.getTime();
                return (
                  <button
                    key={slot.toISOString()}
                    onClick={() => onSelect(slot)}
                    className={`p-3 rounded-lg text-center text-sm font-medium transition-all border ${
                      isSelected
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent border-border hover:border-foreground/30"
                    }`}
                  >
                    {format(slot, "HH:mm")}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Geen beschikbare tijden op deze dag
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
