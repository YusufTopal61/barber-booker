import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Calendar,
  Users,
  Scissors,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const today = new Date();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch today's appointments
  const { data: todayAppointments, isLoading: loadingToday } = useQuery({
    queryKey: ["admin-appointments-today"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name, duration_minutes, price)")
        .gte("start_datetime", startOfDay(today).toISOString())
        .lte("start_datetime", endOfDay(today).toISOString())
        .neq("status", "cancelled")
        .order("start_datetime", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Fetch this week's appointments count
  const { data: weekAppointments } = useQuery({
    queryKey: ["admin-appointments-week"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id")
        .gte("start_datetime", startOfWeek(today, { locale: nl }).toISOString())
        .lte("start_datetime", endOfWeek(today, { locale: nl }).toISOString())
        .neq("status", "cancelled");

      if (error) throw error;
      return data;
    },
  });

  // Fetch total services count
  const { data: servicesCount } = useQuery({
    queryKey: ["admin-services-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("active", true);

      if (error) throw error;
      return count || 0;
    },
  });

  const stats = [
    {
      label: "Afspraken Vandaag",
      value: todayAppointments?.length || 0,
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Deze Week",
      value: weekAppointments?.length || 0,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Actieve Services",
      value: servicesCount || 0,
      icon: Scissors,
      color: "text-blue-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welkom terug! Hier is een overzicht van vandaag.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-secondary flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Appointments */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">
                Afspraken Vandaag
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(today, "EEEE d MMMM yyyy", { locale: nl })}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/appointments" className="flex items-center gap-2">
                Alle afspraken
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="p-6">
            {loadingToday ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : todayAppointments && todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((apt: any) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{apt.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.services?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {format(parseISO(apt.start_datetime), "HH:mm")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {apt.services?.duration_minutes} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Geen afspraken voor vandaag
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/services"
            className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                <Scissors className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold">Services Beheren</h3>
                <p className="text-sm text-muted-foreground">
                  Voeg toe, bewerk of verwijder services
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/availability"
            className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                <Calendar className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold">Beschikbaarheid</h3>
                <p className="text-sm text-muted-foreground">
                  Beheer werkuren en uitzonderingen
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
