import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Loader2, Check } from "lucide-react";

interface ServiceSelectionProps {
  selectedServiceId: string | null;
  onSelect: (serviceId: string) => void;
}

const ServiceSelection = ({
  selectedServiceId,
  onSelect,
}: ServiceSelectionProps) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Kies een service</h2>
        <p className="text-muted-foreground">
          Selecteer de behandeling die je wilt boeken
        </p>
      </div>

      <div className="space-y-3">
        {services?.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={`w-full p-5 rounded-xl border text-left transition-all duration-300 ${
                isSelected
                  ? "border-foreground bg-secondary"
                  : "border-border bg-transparent hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-lg">{service.name}</h3>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                        <Check className="w-3 h-3 text-background" />
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration_minutes} minuten</span>
                  </div>
                </div>
                <div className="ml-6">
                  <span className="text-2xl font-semibold">
                    €{Number(service.price).toFixed(0)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelection;
