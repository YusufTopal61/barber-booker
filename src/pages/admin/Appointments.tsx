import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfDay, endOfDay, addDays } from "date-fns";
import { nl } from "date-fns/locale";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Search,
  X,
  Clock,
  User,
  Mail,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminAppointments = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Fetch appointments for selected date
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["admin-appointments", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name, duration_minutes, price)")
        .gte("start_datetime", startOfDay(selectedDate).toISOString())
        .lte("start_datetime", endOfDay(selectedDate).toISOString())
        .order("start_datetime", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Cancel appointment mutation
  const cancelAppointment = useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast.success("Afspraak geannuleerd");
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    },
    onError: () => {
      toast.error("Kon afspraak niet annuleren");
    },
  });

  const filteredAppointments = appointments?.filter((apt) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      apt.customer_name.toLowerCase().includes(search) ||
      apt.customer_email.toLowerCase().includes(search)
    );
  });

  const goToPreviousDay = () => setSelectedDate(addDays(selectedDate, -1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">Afspraken</h1>
            <p className="text-muted-foreground mt-1">
              Bekijk en beheer alle afspraken
            </p>
          </div>
        </div>

        {/* Date Navigation & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-2">
            <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="px-4 min-w-[200px] text-center">
              <p className="font-semibold">
                {format(selectedDate, "EEEE", { locale: nl })}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, "d MMMM yyyy", { locale: nl })}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={goToNextDay}>
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Vandaag
            </Button>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Zoek op naam of e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-card border border-border rounded-lg">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredAppointments && filteredAppointments.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`p-6 ${
                    apt.status === "cancelled" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-secondary flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-primary">
                          {format(parseISO(apt.start_datetime), "HH:mm")}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {apt.customer_name}
                          </h3>
                          {apt.status === "cancelled" && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-destructive/10 text-destructive">
                              Geannuleerd
                            </span>
                          )}
                        </div>
                        <p className="text-primary font-medium">
                          {apt.services?.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {apt.services?.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {apt.customer_email}
                          </span>
                          {apt.customer_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {apt.customer_phone}
                            </span>
                          )}
                        </div>
                        {apt.notes && (
                          <p className="mt-2 text-sm text-muted-foreground italic">
                            "{apt.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">
                        €{Number(apt.services?.price).toFixed(0)}
                      </span>
                      {apt.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/20 hover:bg-destructive/10"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setCancelDialogOpen(true);
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Annuleer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Geen afspraken gevonden voor deze dag
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Afspraak Annuleren</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je deze afspraak wilt annuleren?
              {selectedAppointment && (
                <div className="mt-4 p-4 bg-secondary rounded-lg">
                  <p className="font-semibold">{selectedAppointment.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.services?.name} op{" "}
                    {format(
                      parseISO(selectedAppointment.start_datetime),
                      "d MMMM om HH:mm",
                      { locale: nl }
                    )}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Terug
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedAppointment &&
                cancelAppointment.mutate(selectedAppointment.id)
              }
              disabled={cancelAppointment.isPending}
            >
              {cancelAppointment.isPending ? "Bezig..." : "Annuleren"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAppointments;
