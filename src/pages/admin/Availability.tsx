import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const weekdays = [
  { value: 0, label: "Zondag" },
  { value: 1, label: "Maandag" },
  { value: 2, label: "Dinsdag" },
  { value: 3, label: "Woensdag" },
  { value: 4, label: "Donderdag" },
  { value: 5, label: "Vrijdag" },
  { value: 6, label: "Zaterdag" },
];

const AdminAvailability = () => {
  const queryClient = useQueryClient();
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [exceptionDialogOpen, setExceptionDialogOpen] = useState(false);

  const [ruleForm, setRuleForm] = useState({
    weekday: 1,
    start_time: "09:00",
    end_time: "18:00",
    is_active: true,
  });

  const [exceptionForm, setExceptionForm] = useState({
    exception_date: "",
    exception_type: "blocked" as "blocked" | "extra",
    start_time: "",
    end_time: "",
    note: "",
  });

  // Fetch availability rules
  const { data: rules, isLoading: loadingRules } = useQuery({
    queryKey: ["admin-availability-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_rules")
        .select("*")
        .order("weekday", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Fetch exceptions (upcoming only)
  const { data: exceptions, isLoading: loadingExceptions } = useQuery({
    queryKey: ["admin-availability-exceptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_exceptions")
        .select("*")
        .gte("exception_date", format(new Date(), "yyyy-MM-dd"))
        .order("exception_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Save rule mutation
  const saveRuleMutation = useMutation({
    mutationFn: async (data: typeof ruleForm) => {
      const { error } = await supabase.from("availability_rules").insert({
        weekday: data.weekday,
        start_time: data.start_time,
        end_time: data.end_time,
        is_active: data.is_active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-availability-rules"] });
      toast.success("Beschikbaarheid toegevoegd");
      setRuleDialogOpen(false);
    },
    onError: () => {
      toast.error("Kon niet opslaan");
    },
  });

  // Delete rule mutation
  const deleteRuleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("availability_rules")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-availability-rules"] });
      toast.success("Regel verwijderd");
    },
  });

  // Save exception mutation
  const saveExceptionMutation = useMutation({
    mutationFn: async (data: typeof exceptionForm) => {
      const { error } = await supabase.from("availability_exceptions").insert({
        exception_date: data.exception_date,
        exception_type: data.exception_type,
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        note: data.note || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-availability-exceptions"],
      });
      toast.success("Uitzondering toegevoegd");
      setExceptionDialogOpen(false);
      setExceptionForm({
        exception_date: "",
        exception_type: "blocked",
        start_time: "",
        end_time: "",
        note: "",
      });
    },
    onError: () => {
      toast.error("Kon niet opslaan");
    },
  });

  // Delete exception mutation
  const deleteExceptionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("availability_exceptions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-availability-exceptions"],
      });
      toast.success("Uitzondering verwijderd");
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold">Beschikbaarheid</h1>
          <p className="text-muted-foreground mt-1">
            Beheer je werkuren en uitzonderingen
          </p>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">
                Wekelijkse Beschikbaarheid
              </h2>
              <p className="text-sm text-muted-foreground">
                Standaard werkuren per dag
              </p>
            </div>
            <Button onClick={() => setRuleDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Dag Toevoegen
            </Button>
          </div>

          <div className="p-6">
            {loadingRules ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : rules && rules.length > 0 ? (
              <div className="grid gap-3">
                {weekdays.map((day) => {
                  const dayRules = rules.filter((r) => r.weekday === day.value);
                  const hasRules = dayRules.length > 0;

                  return (
                    <div
                      key={day.value}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        hasRules ? "bg-secondary/50" : "bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-medium w-24 ${
                            !hasRules ? "text-muted-foreground" : ""
                          }`}
                        >
                          {day.label}
                        </span>
                        {hasRules ? (
                          <div className="flex flex-wrap gap-2">
                            {dayRules.map((rule) => (
                              <div
                                key={rule.id}
                                className="flex items-center gap-2 bg-card px-3 py-1 rounded-full border border-border"
                              >
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm">
                                  {rule.start_time.slice(0, 5)} -{" "}
                                  {rule.end_time.slice(0, 5)}
                                </span>
                                <button
                                  onClick={() =>
                                    deleteRuleMutation.mutate(rule.id)
                                  }
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Gesloten
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nog geen werkuren ingesteld
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Exceptions */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">Uitzonderingen</h2>
              <p className="text-sm text-muted-foreground">
                Vakanties, feestdagen of extra openingstijden
              </p>
            </div>
            <Button onClick={() => setExceptionDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Uitzondering Toevoegen
            </Button>
          </div>

          <div className="p-6">
            {loadingExceptions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : exceptions && exceptions.length > 0 ? (
              <div className="space-y-3">
                {exceptions.map((exc) => (
                  <div
                    key={exc.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      exc.exception_type === "blocked"
                        ? "bg-destructive/10 border border-destructive/20"
                        : "bg-green-500/10 border border-green-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Calendar
                        className={`w-5 h-5 ${
                          exc.exception_type === "blocked"
                            ? "text-destructive"
                            : "text-green-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">
                          {format(parseISO(exc.exception_date), "EEEE d MMMM yyyy", {
                            locale: nl,
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exc.exception_type === "blocked"
                            ? exc.start_time
                              ? `Gesloten van ${exc.start_time.slice(0, 5)} - ${exc.end_time?.slice(0, 5)}`
                              : "Hele dag gesloten"
                            : `Extra open: ${exc.start_time?.slice(0, 5)} - ${exc.end_time?.slice(0, 5)}`}
                          {exc.note && ` - ${exc.note}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteExceptionMutation.mutate(exc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Geen uitzonderingen</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Rule Dialog */}
      <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Werkdag Toevoegen</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveRuleMutation.mutate(ruleForm);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Dag</Label>
              <Select
                value={ruleForm.weekday.toString()}
                onValueChange={(v) =>
                  setRuleForm({ ...ruleForm, weekday: parseInt(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weekdays.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Starttijd</Label>
                <Input
                  type="time"
                  value={ruleForm.start_time}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, start_time: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Eindtijd</Label>
                <Input
                  type="time"
                  value={ruleForm.end_time}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, end_time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRuleDialogOpen(false)}
              >
                Annuleren
              </Button>
              <Button type="submit" disabled={saveRuleMutation.isPending}>
                {saveRuleMutation.isPending ? "Opslaan..." : "Opslaan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Exception Dialog */}
      <Dialog open={exceptionDialogOpen} onOpenChange={setExceptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uitzondering Toevoegen</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveExceptionMutation.mutate(exceptionForm);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Datum</Label>
              <Input
                type="date"
                value={exceptionForm.exception_date}
                onChange={(e) =>
                  setExceptionForm({
                    ...exceptionForm,
                    exception_date: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={exceptionForm.exception_type}
                onValueChange={(v: "blocked" | "extra") =>
                  setExceptionForm({ ...exceptionForm, exception_type: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blocked">Gesloten</SelectItem>
                  <SelectItem value="extra">Extra open</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Starttijd{" "}
                  <span className="text-muted-foreground">(optioneel)</span>
                </Label>
                <Input
                  type="time"
                  value={exceptionForm.start_time}
                  onChange={(e) =>
                    setExceptionForm({
                      ...exceptionForm,
                      start_time: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Eindtijd{" "}
                  <span className="text-muted-foreground">(optioneel)</span>
                </Label>
                <Input
                  type="time"
                  value={exceptionForm.end_time}
                  onChange={(e) =>
                    setExceptionForm({
                      ...exceptionForm,
                      end_time: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Notitie{" "}
                <span className="text-muted-foreground">(optioneel)</span>
              </Label>
              <Input
                value={exceptionForm.note}
                onChange={(e) =>
                  setExceptionForm({ ...exceptionForm, note: e.target.value })
                }
                placeholder="Bijv. Kerst, Vakantie..."
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setExceptionDialogOpen(false)}
              >
                Annuleren
              </Button>
              <Button type="submit" disabled={saveExceptionMutation.isPending}>
                {saveExceptionMutation.isPending ? "Opslaan..." : "Opslaan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAvailability;
